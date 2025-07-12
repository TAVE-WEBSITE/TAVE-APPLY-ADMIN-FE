import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Modal from "@/components/Modal/Modal";
import Input from "@/components/Input/Input";
import ToastMessage from "@/components/Modal/ToastMessage";
import { updateQuestion, type FieldType } from "@/pages/Setting/api/Document";

interface WordLimitModalProps {
  questionId?: number;
  currentContent?: string;
  currentFieldType?: FieldType;
  currentOrdered?: number;
  currentTextLength?: number;
  onUpdateSuccess?: () => void;
}

const WordLimitModal = forwardRef<HTMLDialogElement | null, WordLimitModalProps>(({
  questionId,
  currentContent,
  currentFieldType,
  currentOrdered,
  currentTextLength,
  onUpdateSuccess
}, ref) => {
  const [wordLimit, setWordLimit] = useState("");

  // currentTextLength가 변경될 때마다 wordLimit 상태 업데이트
  useEffect(() => {
    if (currentTextLength) {
      setWordLimit(currentTextLength.toString());
    }
  }, [currentTextLength]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const updateWordLimit = async () => {
    if (!questionId || !currentContent || !currentFieldType) {
      console.error("필수 데이터가 누락되었습니다:", { questionId, currentContent, currentFieldType });
      return;
    }

    setIsLoading(true);
    try {
      console.log("글자수 제한 업데이트 API 호출:", {
        id: questionId,
        content: currentContent,
        fieldType: currentFieldType,
        ordered: currentOrdered,
        textLength: parseInt(wordLimit)
      });

      await updateQuestion(
        questionId,
        currentContent,
        currentFieldType,
        currentOrdered || 0,
        parseInt(wordLimit)
      );

      console.log("글자수 제한 업데이트 성공");
      setIsOpen(true);
      onUpdateSuccess?.();
    } catch (error) {
      console.error("글자수 제한 업데이트 실패:", error);
    } finally {
      setIsLoading(false);
      setWordLimit("");
    }
  };

  return (
    <Modal
      dialogRef={ref as React.RefObject<HTMLDialogElement | null>}
      title="글자 수 제한"
      buttonCount={2}
      onConfirm={updateWordLimit}
      isPending={isLoading}
      onChange={(e) => console.log(e)}
      confirmText="수정"
      className="h-full!"
    >
      <Input
        type="number"
        value={wordLimit}
        placeholder="제한할 글자수를 입력하세요 (ex. 700)"
        className="w-full"
        onChange={(e) => setWordLimit(e.target.value)}
      />

      <ToastMessage
        message={"제한 글자수를 변경하셨습니다"}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </Modal>
  );
});

export default WordLimitModal;
