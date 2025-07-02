import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useCallback } from "react";
import DraggableItem from "./Item";
import Icon from "@/components/Icon/Icon";
import useDocument from "@/hooks/Setting/Document/useDocument";
import useDocumentStore from "@/hooks/Setting/Document/useDocumentStore";

const DraggableList = () => {
  const {
    addNewQuestion,
    startEditQuestion,
    endEditQuestion,
    editQuestion,
    deleteQuestion,
    toggleRequired,
  } = useDocument();
  const { questions, setQuestions, skillSets } = useDocumentStore();

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id || !questions) return;

      const oldIndex = questions.findIndex((item) => item.id === active.id);
      const newIndex = questions.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(questions, oldIndex, newIndex);
      setQuestions(newItems);
    },
    [questions]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        endEditQuestion();
      }
    },
    [endEditQuestion]
  );
  if (!questions || questions.length === 0) {
    return (
      <ul className="flex flex-col items-center p-8 gap-4 w-full">
        <li
          className="w-full flex items-center border border-dotted border-gray-300 rounded-xl bg-white p-4 justify-center text-gray-900 gap-2 cursor-pointer hover:bg-gray-100"
          onClick={addNewQuestion}
        >
          <Icon type="Plus" size={20} className="text-gray-900" />
          질문 추가하기
        </li>
      </ul>
    );
  }

  return (
    <ul
      className="flex flex-col items-center p-8 gap-4 w-full"
      onKeyDown={handleKeyDown}
    >
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext
          items={questions}
          strategy={verticalListSortingStrategy}
        >
          {questions.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              skills={skillSets}
              onStartEdit={startEditQuestion}
              onEndEdit={endEditQuestion}
              onEdit={editQuestion}
              onDelete={deleteQuestion}
              onToggleRequired={toggleRequired}
            />
          ))}
        </SortableContext>
      </DndContext>

      <li
        className="w-full flex items-center border border-dotted border-gray-300 rounded-xl bg-white p-4 justify-center text-gray-900 gap-2 cursor-pointer hover:bg-gray-100"
        onClick={addNewQuestion}
      >
        <Icon type="Plus" size={20} className="text-gray-900" />
        질문 추가하기
      </li>
    </ul>
  );
};

export default DraggableList;
