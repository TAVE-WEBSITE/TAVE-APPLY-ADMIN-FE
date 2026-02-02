import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRef, useState, useCallback, useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import FlexBox from "../Layout/FlexBox";
import Icon from "@/components/Icon/Icon";
import Switch from "../Input/Switch";
import ChipController from "@/pages/Setting/Document/ChipController";
import WordLimitModal from "@/pages/Setting/Document/WordLimitModal";
import TypeChangeModal from "@/pages/Setting/Document/TypeChangeModal";
import ToastMessage from "@/components/Modal/ToastMessage";
import { axiosInstance } from "@/api/axiosInstance";

import useDocumentStore from "@/hooks/Setting/Document/useDocumentStore";
import type { SkillSet } from "@/hooks/Setting/Document/useDocumentStore";

// 프로그래밍 언어 조회 API
const fetchProgrammingLanguages = async (field: string) => {
  try {
    const res = await axiosInstance.get(`/v1/member/lan/field/${field}`);
    return res.data;
  } catch (error) {
    console.error("프로그래밍 언어 조회 실패:", error);
    return { result: [] };
  }
};

type QuestionItem = {
  id: string;
  question: string;
  required: boolean;
  textLength?: number;
  mode?: string;
};

interface DraggableItemProps {
  item: QuestionItem;
  skills?: SkillSet[];
  questionData?: any;
  onStartEdit: (itemId: string) => void;
  onEndEdit: () => void;
  onEdit: (itemId: string, value: string, required?: boolean) => void;
  onDelete: (itemId: string) => void;
  onToggleRequired: (itemId: string) => void;
}

const DraggableItem = ({
  item,
  skills = [],
  questionData,
  onStartEdit,
  onEndEdit,
  onEdit,
  onDelete,
  onToggleRequired,
}: DraggableItemProps) => {

  
  const queryClient = useQueryClient();
  const wordLimitModalRef = useRef<HTMLDialogElement>(null);
  const typeChangeModalRef = useRef<HTMLDialogElement>(null);
  const interviewScheduleModal = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState(
    questionData?.content || item.question || ""
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // 프로그래밍 언어 조회 (answerType이 PROGRAMMING일 때만)
  const { data: programmingLanguages } = useQuery({
    queryKey: ["programming-languages", questionData?.fieldType],
    queryFn: () => fetchProgrammingLanguages(questionData?.fieldType || ""),
    enabled: questionData?.answerType === "PROGRAMMING" && !!questionData?.fieldType,
  });

  // 프로그래밍 언어를 chips 형태로 변환
  const programmingLanguageChips = programmingLanguages?.result
    ?.filter((lang: any) => lang.field === questionData?.fieldType) // fieldType에 따라 필터링
    ?.map((lang: any) => ({
      id: lang.id,
      language: lang.language, // ChipController가 기대하는 속성명
      field: questionData?.fieldType,
      selected: false
    })) || [];

  // answerType에 따라 표시할 chips 결정
  const displayChips = questionData?.answerType === "PROGRAMMING" 
    ? (programmingLanguageChips || []) // undefined 방지
    : (skills || []); // undefined 방지

  // 언어 삭제 핸들러
  const handleLanguageDelete = useCallback(async (languageId: number, languageName: string) => {
    try {
      // 프로그래밍 언어 삭제 API 호출
      await axiosInstance.delete(`/v1/manager/lan/${languageId}`);
      
      // 토스트 메시지 표시
      setToastMessage(`${languageName} 삭제했습니다.`);
      setIsToastOpen(true);
      
      // 2초 후 새로고침
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error("언어 삭제 실패:", error);
      setToastMessage("언어 삭제에 실패했습니다.");
      setIsToastOpen(true);
    }
  }, []);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // questionData가 변경될 때 inputValue 업데이트
  useEffect(() => {
    if (questionData?.content) {
      setInputValue(questionData.content);
    }
  }, [questionData]);

  // inputValue가 변경될 때 높이 조정
  useEffect(() => {
    if (inputRef.current) {
      const charCount = inputValue.length;
      
      if (charCount > 51) {
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      } else {
        inputRef.current.style.height = '1.5rem';
      }
    }
  }, [inputValue]);

  // mode가 focused일 때 자동으로 포커스
  useEffect(() => {
    if (item.mode === "focused" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [item.mode]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // 드롭다운 내부 클릭인지 확인
      if (target.closest('.dropdown-container')) {
        return;
      }
      
      if (showDropdown) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleFocus = useCallback(() => {
    if (item.mode === "default" || !item.mode) {
      onStartEdit(item.id);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    } else {
      onEndEdit();
    }
  }, [item.id, item.mode, onStartEdit, onEndEdit]);

  const handleEdit = useCallback(async () => {
    await onEdit(item.id, inputValue);
  }, [item.id, inputValue, onEdit, questionData]);

  const handleDelete = useCallback(async () => {
    await onDelete(item.id);
  }, [item.id, onDelete]);

  const handleToggleRequired = useCallback(async () => {

    const newRequiredValue = !item.required;
    
    // API 호출을 위한 데이터 준비
    if (questionData?.id && questionData?.content && questionData?.fieldType) {
      try {
        // updateQuestion API 호출 (required 필드 포함)
        await onEdit(item.id, questionData.content, newRequiredValue);
      } catch (error) {
        console.error("필수 질문 상태 업데이트 실패:", error);
      }
    } else {
      // API 호출 조건이 안 되면 로컬 상태만 업데이트
      onToggleRequired(item.id);
      console.log("API 호출 조건 불충족, 로컬 상태만 업데이트:", { questionData });
    }
  }, [item.id, item.required, onToggleRequired, questionData, onEdit]);

  const handleDropdownToggle = useCallback(() => {
    setShowDropdown(prev => !prev);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
      e.target.style.width = `${e.target.value.length + 5}ch`;
    },
    []
  );

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent) => {
      // textarea 내부에서 입력 중일 때는 이벤트 전파를 막지 않음
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // Enter 키의 기본 동작 방지
        await handleEdit();
      }
      // 스페이스 바와 다른 키들은 정상적으로 작동하도록 함
    },
    [handleEdit]
  );

  return (
    <li
      className={`flex flex-col justify-between w-full border border-gray-300 rounded-xl bg-white pr-4 hover:bg-gray-100 ${
        item.mode === "focused"
          ? "outline outline-blue-500 shadow-lg scale-103"
          : item.mode === "blurred"
          ? "opacity-50"
          : ""
      }`}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center rounded-lg p-4">
          <div
            className={`flex items-center ${
              !isDragging && "hover:outline-2 hover:outline-blue-500"
            } ${
              isDragging
                ? "cursor-grabbing outline-2 outline-blue-500"
                : "cursor-grab"
            }`}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon type="Menu" size={20} className="mr-2" />
          </div>
          <textarea
            ref={inputRef}
            readOnly={item.mode !== "focused"}
            value={inputValue}
            className={`text-gray-900 font-medium resize-none border-none outline-none bg-transparent ${
              isDragging ? "cursor-grabbing" : "cursor-text"
            }`}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ 
              width: `${Math.min(inputValue.length + 10, (item.textLength || 100))}ch`,
              minHeight: '1.5rem',
              height: '1.5rem',
              overflow: 'hidden'
            }}
          />
        </div>

        <FlexBox className="gap-4">
          <p className="text-gray-500 text-sm">{`(${item.textLength || 100}자 이내)`}</p>
          <Switch
            title="필수 질문"
            setIsOn={handleToggleRequired}
            isOn={item.required}
          />

          <div className="relative">
            <button
              className="p-2 border border-gray-300 rounded-lg hover:bg-blue-100 cursor-pointer"
              onClick={handleDropdownToggle}
            >
              <Icon type="Dots" size={20} />
            </button>
            
            {showDropdown && (
                              <div className="dropdown-container absolute right-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[150px]">
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 border-b border-gray-200 flex items-center gap-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      
                      // answerType이 TIME인 경우 InterviewScheduleModal 띄우기
                      if (questionData?.answerType === "TIME") {
                        interviewScheduleModal.current?.showModal();
                        setShowDropdown(false);
                      } else {
                        // 일반적인 질문 수정 모드
                        handleFocus();
                        setShowDropdown(false);
                      }
                    }}
                  >
                    <Icon type="Pen" size={20} />
                    <span className="whitespace-nowrap">
                      {questionData?.answerType === "TIME" ? "면접 일정 설정" : "질문 수정하기"}
                    </span>
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 border-b border-gray-200 flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      wordLimitModalRef.current?.showModal();
                      setShowDropdown(false);
                    }}
                  >
                    <Icon type="TextLength" size={20} />
                    <span className="whitespace-nowrap">글자수 제한하기</span>
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      typeChangeModalRef.current?.showModal();
                      setShowDropdown(false);
                    }}
                  >
                    <Icon type="Type" size={20} />
                    <span className="whitespace-nowrap">타입 변경하기</span>
                  </button>
              </div>
            )}
          </div>

          {/* {item.textLength && (
            <button
              className="p-2 border border-gray-300 rounded-lg hover:bg-blue-100 cursor-pointer"
              onClick={() => wordLimitModalRef.current?.showModal()}
            >
              <Icon type="TextLength" size={20} />
            </button>
          )} */}

          <button
            className="p-2 border border-gray-300 rounded-lg hover:bg-blue-100 cursor-pointer"
            onClick={handleDelete}
          >
            <Icon type="Trash" size={20} />
          </button>
        </FlexBox>
        <WordLimitModal 
          ref={wordLimitModalRef}
          questionId={questionData?.id}
          currentContent={questionData?.content || item.question}
          currentFieldType={questionData?.fieldType}
          currentOrdered={questionData?.ordered}
          currentTextLength={questionData?.textLength || item.textLength}
          onUpdateSuccess={() => {
          
          }}
        />
        <TypeChangeModal 
          ref={typeChangeModalRef}
          questionId={questionData?.id}
          currentContent={questionData?.content || item.question}
          currentFieldType={questionData?.fieldType}
          currentOrdered={questionData?.ordered}
          currentTextLength={questionData?.textLength || item.textLength}
          currentAnswerType={questionData?.answerType}
          currentRequired={questionData?.required}
          onUpdateSuccess={async () => {
            await queryClient.invalidateQueries({ queryKey: ["setting", "document", "questions", questionData?.fieldType] });
            await queryClient.invalidateQueries({ queryKey: ["setting", "document", "all-questions"] });
            console.log("데이터 무효화 완료");
          }}
        />
    
      </div>
      {(displayChips.length > 0 || questionData?.answerType === "PROGRAMMING") && (
        <div className="px-4 pb-4">
          <ChipController 
            chips={displayChips} 
            focused={item.mode === "focused"}
            onLanguageDelete={questionData?.answerType === "PROGRAMMING" ? handleLanguageDelete : undefined}
            answerType={questionData?.answerType}
          />
        </div>
      )}
      
      <ToastMessage
        message={toastMessage}
        isOpen={isToastOpen}
        setIsOpen={setIsToastOpen}
        isError={false}
      />
    </li>
  );
};

export default DraggableItem;
