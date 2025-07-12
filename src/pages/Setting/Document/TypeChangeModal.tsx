import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Modal from "@/components/Modal/Modal";
import { useQueryClient } from "@tanstack/react-query";
import { updateQuestion } from "@/pages/Setting/api/Document";

interface TypeChangeModalProps {
  questionId?: number;
  currentContent?: string;
  currentFieldType?: string;
  currentOrdered?: number;
  currentTextLength?: number;
  currentAnswerType?: string;
  currentRequired?: boolean;
  onUpdateSuccess?: () => void;
}

const TypeChangeModal = forwardRef<HTMLDialogElement | null, TypeChangeModalProps>(({
  questionId,
  currentContent,
  currentFieldType,
  currentOrdered,
  currentTextLength,
  currentAnswerType,
  currentRequired,
  onUpdateSuccess
}, ref) => {
  const [selectedType, setSelectedType] = useState(currentAnswerType || "TEXTAREA");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // currentAnswerType이 변경될 때마다 selectedType 상태 업데이트
  useEffect(() => {
    console.log("currentAnswerType 변경됨:", currentAnswerType);
    if (currentAnswerType) {
      setSelectedType(currentAnswerType);
    }
  }, [currentAnswerType]);

  const handleTypeChange = (value: string) => {
    console.log("라디오 버튼 선택됨:", value);
    setSelectedType(value);
  };

  const updateQuestionType = async () => {
    if (!questionId || !currentContent || !currentFieldType) {
      console.error("필수 데이터가 누락되었습니다:", { questionId, currentContent, currentFieldType });
      return;
    }

    setIsLoading(true);
    try {
      console.log("타입 변경 API 호출:", {
        id: questionId,
        content: currentContent,
        fieldType: currentFieldType,
        ordered: currentOrdered,
        textLength: currentTextLength,
        required: currentRequired,
        answerType: selectedType
      });

      // updateQuestion API 호출하여 answerType 업데이트
      const response = await updateQuestion(
        questionId,
        currentContent,
        currentFieldType as any,
        currentOrdered || 0,
        currentTextLength || 500,
        currentRequired, // 기존 required 값 사용
        selectedType
      );

      console.log("타입 변경 성공");
      console.log("API 응답:", response);
      console.log("요청한 answerType:", selectedType);
      console.log("API 응답의 answerType:", response?.result?.answerType);
      
      // 데이터 무효화하여 다시 조회
      await queryClient.invalidateQueries({ queryKey: ["setting", "document", "questions", currentFieldType] });
      await queryClient.invalidateQueries({ queryKey: ["setting", "document", "all-questions"] });
      
      // 성공 콜백 호출
      onUpdateSuccess?.();
      
      // 모달 닫기
      if (ref && 'current' in ref && ref.current) {
        ref.current.close();
      }
    } catch (error) {
      console.error("타입 변경 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      dialogRef={ref as React.RefObject<HTMLDialogElement | null>}
      title="질문 타입 변경"
      buttonCount={2}
      onConfirm={updateQuestionType}
      isPending={isLoading}
      onChange={(e) => console.log(e)}
      confirmText="변경"
      className="h-full!"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            질문 타입 선택
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="questionType"
                value="TEXTAREA"
                checked={selectedType === "TEXTAREA"}
                onChange={() => handleTypeChange("TEXTAREA")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">텍스트 입력 (TEXTAREA)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="questionType"
                value="PROGRAMMING"
                checked={selectedType === "PROGRAMMING"}
                onChange={() => handleTypeChange("PROGRAMMING")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">메인 프로그래밍 실력 (PROGRAMMING)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="questionType"
                value="URL"
                checked={selectedType === "URL"}
                onChange={() => handleTypeChange("URL")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">링크 (URL)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="questionType"
                value="FILE"
                checked={selectedType === "FILE"}
                onChange={() => handleTypeChange("FILE")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">포트폴리오 (FILE)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="questionType"
                value="TIME"
                checked={selectedType === "TIME"}
                onChange={() => handleTypeChange("TIME")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">면접 시간 (TIME)</span>
            </label>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>TEXTAREA:</strong> 일반적인 텍스트 입력 질문
          </p>
          <p className="text-xs text-gray-600 mt-1">
            <strong>PROGRAMMING:</strong> 메인 프로그래밍, 디자인 툴 레벨 측정
          </p>
          <p className="text-xs text-gray-600 mt-1">
            <strong>INPUT:</strong> 기타 프로그래밍 실력 선택
          </p>
          <p className="text-xs text-gray-600 mt-1">
            <strong>URL:</strong> 링크, 포트폴리오 입력 질문
          </p>
          <p className="text-xs text-gray-600 mt-1">
            <strong>TIME:</strong> 면접 시간 선택 질문
          </p>
        </div>
      </div>
    </Modal>
  );
});

export default TypeChangeModal; 