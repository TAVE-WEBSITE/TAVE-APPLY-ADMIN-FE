import { useEffect } from "react";
import useDocumentStore from "./useDocumentStore";
import {
  fetchSkillSetByField,
  fetchQuestionsByField,
  fetchAllQuestions,
  postQuestionByField,
  updateQuestion,
  swapQuestionOrder,
  deleteQuestionById,
} from "@/pages/Setting/api/Document";

import { useQuery } from "@tanstack/react-query";

const useDocument = () => {
  const { questions, setQuestions, currentType, setSkillSets } =
    useDocumentStore();



  const { data } = useQuery({
    queryKey: ["setting", "document", "questions", currentType],
    queryFn: () => fetchQuestionsByField(currentType),
  });

  const { data: allQuestionsData } = useQuery({
    queryKey: ["setting", "document", "all-questions"],
    queryFn: () => fetchAllQuestions(),
  });

  const allQuestions = allQuestionsData?.result || [];

  const { data: currentSkills } = useQuery({
    queryKey: ["setting", "document", "skills", currentType],
    queryFn: () => fetchSkillSetByField(currentType),
    enabled: currentType !== "COMMON",
  });

  useEffect(() => {
    if (data) {
      console.log(`[${currentType}] 분야 질문 리스트:`, data.result);
      setQuestions(data.result);
    }
    if (currentSkills) {
      setSkillSets(currentSkills.result);
    }
  }, [data, currentSkills, currentType]);

  // 전체 질문 데이터 로깅
  useEffect(() => {
    if (allQuestions.length > 0) {
      console.log("전체 질문 조회 결과:", allQuestions);
    }
  }, [allQuestions]);

  // 분야 변경 시 로깅
  useEffect(() => {
   
  }, [currentType, questions?.length]);

  const addNewQuestion = () => {
    const existingIds = new Set([
      ...(allQuestions?.map((q: any) => q.id) || []),
      ...(questions?.map(q => q.id) || [])
    ]);
    
    let nextId = 1;
    while (existingIds.has(nextId)) {
      nextId++;
    }
    
    const newQuestion = {
      id: nextId,
      question: "",
      maxLength: 100,
      required: false,
      mode: "default", 
    };
    
    console.log("새 질문 생성:", newQuestion);
    const temp = [...(questions ?? []), newQuestion];
    setQuestions(temp);
  };

  const deleteQuestion = async (itemId: string) => {
    try {
      const questionId = parseInt(itemId);
      
      if (!isNaN(questionId)) {
        // 기존 질문 데이터가 있는지 확인
        const existingQuestion = allQuestions?.find((q: any) => q.id === questionId);
        
        if (existingQuestion) {
          // 기존 질문이 있으면 삭제 API 호출
          console.log("질문 삭제 API 호출 시작:", { questionId });
          await deleteQuestionById(questionId);
          console.log("질문이 성공적으로 삭제되었습니다:", questionId);
        } else {
          console.log("기존 질문이 없어서 로컬에서만 삭제:", questionId);
        }
      }
      
      // 로컬 상태에서도 제거
      const temp = questions.filter((question) => question.id !== itemId);
      console.log("Deleting question with ID:", itemId);
      console.log("Updated questions array:", temp);
      setQuestions(temp);
      
    } catch (error) {
      console.error("질문 삭제 실패:", error);
      // 에러가 발생해도 로컬에서는 제거 (사용자 경험을 위해)
      const temp = questions.filter((question) => question.id !== itemId);
      setQuestions(temp);
    }
  };

  const startEditQuestion = (itemId: string) => {
    const newQuestions = questions.map((question) => ({
      ...question,
      mode: question.id === itemId ? "focused" : "blurred",
    }));
    console.log("Starting edit for question ID:", itemId);
    setQuestions(newQuestions);
  };

  const editQuestion = async (itemId: string, updatedQuestion: string) => {
    // 로컬 상태 업데이트
    const newQuestions = questions.map((item) => ({
      ...item,
      question: item.id === itemId ? updatedQuestion : item.question,
    }));
    console.log("Editing question ID:", itemId, "New text:", updatedQuestion);
    console.log("Current field type:", currentType);
    setQuestions(newQuestions);

    // 질문이 비어있지 않고 현재 필드 타입이 있을 때 API 호출
    if (updatedQuestion.trim() && currentType) {
      try {
        const questionItem = newQuestions.find(q => q.id === itemId);
        if (questionItem) {
          // 기존 질문 데이터가 있는지 확인 (questionData에서 찾기)
          const existingQuestion = allQuestions?.find((q: any) => q.id === parseInt(itemId));
          
          if (existingQuestion) {
            // 기존 질문이 있으면 수정 API 호출
            console.log("질문 수정 API 호출 시작:", {
              id: existingQuestion.id,
              content: updatedQuestion.trim(),
              fieldType: currentType,
              ordered: existingQuestion.ordered,
              textLength: existingQuestion.textLength || 500
            });
            
            await updateQuestion(
              existingQuestion.id,
              updatedQuestion.trim(),
              currentType,
              existingQuestion.ordered,
              existingQuestion.textLength || 500
            );
            console.log("질문이 성공적으로 수정되었습니다:", updatedQuestion);
          } else {
            // 기존 질문이 없으면 생성 API 호출
            console.log("질문 생성 API 호출 시작:", {
              fieldType: currentType,
              question: updatedQuestion.trim(),
              required: questionItem.required,
              maxLength: questionItem.maxLength
            });
            
            await postQuestionByField(
              currentType,
              updatedQuestion.trim(),
              questionItem.required,
              questionItem.maxLength
            );
            console.log("질문이 성공적으로 생성되었습니다:", updatedQuestion);
          }
        }
      } catch (error) {
        console.error("질문 API 호출 실패:", error);
      }
    } else {
      console.log("API 호출 조건 불충족:", {
        hasQuestion: !!updatedQuestion.trim(),
        hasFieldType: !!currentType,
        currentType: currentType
      });
    }
  };

  const endEditQuestion = () => {
    const newQuestions = questions.map((question) => ({
      ...question,
      mode: "default",
    }));
    console.log("Ending edit mode");
    setQuestions(newQuestions);
  };

  const toggleRequired = (itemId: string) => {
    const newQuestions = questions.map((question) => ({
      ...question,
      required: question.id === itemId ? !question.required : question.required,
    }));
    console.log("Toggling required for question ID:", itemId);
    setQuestions(newQuestions);
  };

  const swapQuestions = async (id1: number, id2: number) => {
    try {
      console.log("질문 순서 변경 API 호출:", { id1, id2 });
      await swapQuestionOrder(id1, id2);
      console.log("질문 순서 변경 성공");
    } catch (error) {
      console.error("질문 순서 변경 실패:", error);
    }
  };

  return {
    questions,
    setQuestions,
    addNewQuestion,
    deleteQuestion,
    startEditQuestion,
    editQuestion,
    endEditQuestion,
    toggleRequired,
    swapQuestions,
  };
};

export default useDocument;
