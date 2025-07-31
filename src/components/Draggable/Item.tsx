import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRef, useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import FlexBox from "../Layout/FlexBox";
import Icon from "@/components/Icon/Icon";
import Switch from "../Input/Switch";
import ChipController from "@/pages/Setting/Document/ChipController";
import WordLimitModal from "@/pages/Setting/Document/WordLimitModal";
import TypeChangeModal from "@/pages/Setting/Document/TypeChangeModal";
import InterviewScheduleModal from "@/pages/Setting/Document/InterviewScheduleModal";

import useDocumentStore from "@/hooks/Setting/Document/useDocumentStore";
import type { SkillSet } from "@/hooks/Setting/Document/useDocumentStore";

type QuestionItem = {
  id: string;
  question: string;
  required: boolean;
  maxLength?: number;
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
  // 전달받은 데이터 로깅
  // console.log("DraggableItem - item:", item);
  // console.log("DraggableItem - questionData:", questionData);
  const queryClient = useQueryClient();
  const wordLimitModalRef = useRef<HTMLDialogElement>(null);
  const typeChangeModalRef = useRef<HTMLDialogElement>(null);
  const interviewScheduleModal = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState(
    questionData?.content || item.question || ""
  );
  const [showDropdown, setShowDropdown] = useState(false);

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
      if (e.key === "Enter") {
        e.preventDefault(); // Enter 키의 기본 동작 방지
        await handleEdit();
      }
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
        <div
          className={`flex items-center rounded-lg p-4 ${
            !isDragging && "hover:outline-2 hover:outline-blue-500"
          } ${
            isDragging
              ? "cursor-grabbing outline-2 outline-blue-500"
              : "cursor-pointer"
          }`}
          {...listeners}
        >
          <Icon type="Menu" size={20} className="mr-2" />
          <textarea
            ref={inputRef}
            readOnly={item.mode !== "focused"}
            value={inputValue}
            className={`text-gray-900 font-medium resize-none border-none outline-none bg-transparent ${
              isDragging ? "cursor-grabbing" : ""
            }`}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{ 
              width: `${Math.min(inputValue.length + 5, 80)}ch`,
              minHeight: '1.5rem',
              height: '1.5rem',
              overflow: 'hidden'
            }}

          />
          {item.maxLength && (
            <p className="text-gray-500 text-sm">{`(${item.maxLength}자 이내)`}</p>
          )}
        </div>

        <FlexBox className="gap-4">
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

          {item.maxLength && (
            <button
              className="p-2 border border-gray-300 rounded-lg hover:bg-blue-100 cursor-pointer"
              onClick={() => wordLimitModalRef.current?.showModal()}
            >
              <Icon type="TextLength" size={20} />
            </button>
          )}

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
          currentTextLength={questionData?.textLength || item.maxLength}
          onUpdateSuccess={() => {
            console.log("글자수 제한 업데이트 완료");
          }}
        />
        <TypeChangeModal 
          ref={typeChangeModalRef}
          questionId={questionData?.id}
          currentContent={questionData?.content || item.question}
          currentFieldType={questionData?.fieldType}
          currentOrdered={questionData?.ordered}
          currentTextLength={questionData?.textLength || item.maxLength}
          currentAnswerType={questionData?.answerType}
          currentRequired={questionData?.required}
          onUpdateSuccess={async () => {
            await queryClient.invalidateQueries({ queryKey: ["setting", "document", "questions", questionData?.fieldType] });
            await queryClient.invalidateQueries({ queryKey: ["setting", "document", "all-questions"] });
            console.log("데이터 무효화 완료");
          }}
        />
        <InterviewScheduleModal ref={interviewScheduleModal} />
      </div>
      {skills.length > 0 && (
        <div className="px-4 pb-4">
          <ChipController chips={skills} focused={item.mode === "focused"} />
        </div>
      )}
    </li>
  );
};

export default DraggableItem;
