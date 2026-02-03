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
import { useQuery } from "@tanstack/react-query";
import { fetchAllQuestions } from "@/pages/Setting/api/Document";

const DraggableList = () => {
  const {
    addNewQuestion,
    startEditQuestion,
    endEditQuestion,
    editQuestion,
    deleteQuestion,
    toggleRequired,
    swapQuestions,
  } = useDocument();
  const { questions, setQuestions, skillSets } = useDocumentStore();

  // 전체 질문 조회
  const { data: allQuestionsData } = useQuery({
    queryKey: ["setting", "document", "all-questions"],
    queryFn: () => fetchAllQuestions(),
  });

  // console.log(allQuestionsData);

  // 조회된 전체 질문들
  const allQuestions = allQuestionsData?.result || [];
  
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id || !questions) return;

      const oldIndex = questions.findIndex((item) => item.id === active.id);
      const newIndex = questions.findIndex((item) => item.id === over.id);

      // 로컬 상태 업데이트
      const newItems = arrayMove(questions, oldIndex, newIndex);
      setQuestions(newItems);

      // API 호출을 위한 ID 추출
      const activeId = parseInt(active.id as string);
      const overId = parseInt(over.id as string);

      // 순서 변경 API 호출
      if (!isNaN(activeId) && !isNaN(overId)) {
        await swapQuestions(activeId, overId);
      }
    },
    [questions, swapQuestions]
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
          {questions.map((item) => {
            // 현재 item과 매칭되는 전체 질문 데이터 찾기
            const matchingQuestion = allQuestions.find((q: any) => q.id === item.id);
            
            return (
              <DraggableItem
                key={item.id}
                item={item}
                skills={skillSets}
                questionData={matchingQuestion}
                onStartEdit={startEditQuestion}
                onEndEdit={endEditQuestion}
                onEdit={editQuestion}
                onDelete={deleteQuestion}
                onToggleRequired={toggleRequired}
              />
            );
          })}
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
