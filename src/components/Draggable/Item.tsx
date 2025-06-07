import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRef, useState, useCallback } from "react";
import FlexBox from "../Layout/FlexBox";
import Icon from "@/components/Icon/Icon";
import Switch from "../Input/Switch";

import WordLimitModal from "@/pages/Setting/Document/WordLimitModal";
import InterviewScheduleModal from "@/pages/Setting/Document/InterviewScheduleModal";

interface DraggableItemProps {
  item: any;
  onStartEdit: (itemId: string) => void;
  onEndEdit: () => void;
  onEdit: (itemId: string, value: string) => void;
  onDelete: (itemId: string) => void;
  onToggleRequired: (itemId: string) => void;
}

const DraggableItem = ({
  item,
  onStartEdit,
  onEndEdit,
  onEdit,
  onDelete,
  onToggleRequired,
}: DraggableItemProps) => {
  const wordLimitModalRef = useRef<HTMLDialogElement>(null);
  const interviewScheduleModal = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(item.question);

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

  const handleFocus = useCallback(() => {
    if (item.mode === "default") {
      onStartEdit(item.id);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    } else {
      onEndEdit();
    }
  }, [item.id, item.mode, onStartEdit, onEndEdit]);

  const handleEdit = useCallback(() => {
    onEdit(item.id, inputValue);
  }, [item.id, inputValue, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(item.id);
  }, [item.id, onDelete]);

  const handleToggleRequired = useCallback(() => {
    onToggleRequired(item.id);
  }, [item.id, onToggleRequired]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      e.target.style.width = `${e.target.value.length + 5}ch`;
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleEdit();
      }
    },
    [handleEdit]
  );

  return (
    <li
      onKeyDown={handleKeyDown}
      className={`flex items-center w-full border border-gray-300 rounded-xl bg-white pr-4 justify-between hover:bg-gray-100 ${
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
        <input
          ref={inputRef}
          readOnly={item.mode !== "focused"}
          value={inputValue}
          className={`text-gray-900 font-medium ${
            isDragging ? "cursor-grabbing" : ""
          }`}
          onChange={handleInputChange}
          style={{ width: `${item.question.length + 5}ch` }}
        />
        {item.maxLength && (
          <p className="text-gray-500 text-sm">{`(${item.maxLength}자 이내)`}</p>
        )}
      </div>

      <FlexBox className="gap-4">
        <Switch
          title="필수 질문"
          isOn={item.required}
          setIsOn={handleToggleRequired}
        />

        <button
          className="p-2 border border-gray-300 rounded-lg hover:bg-blue-100 cursor-pointer"
          onClick={() => {
            item.question === "가능한 오프라인 면접 시간"
              ? interviewScheduleModal.current?.showModal()
              : handleFocus();
          }}
        >
          <Icon type="Pen" size={20} />
        </button>

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
      <WordLimitModal ref={wordLimitModalRef} />
      <InterviewScheduleModal ref={interviewScheduleModal} />
    </li>
  );
};

export default DraggableItem;
