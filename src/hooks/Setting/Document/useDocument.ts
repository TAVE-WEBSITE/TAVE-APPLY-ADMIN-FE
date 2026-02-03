import { useEffect } from "react";
import useDocumentStore from "./useDocumentStore";
import {
  fetchQuestionsByField,
  fetchAllQuestions,
  postQuestionByField,
  updateQuestion,
  swapQuestionOrder,
  deleteQuestionById,
  fetchProgrammingLevel,
} from "@/pages/Setting/api/Document";

import { useQuery, useQueryClient } from "@tanstack/react-query";

const useDocument = () => {
  const { questions, setQuestions, currentType, skillSets, setSkillSets } =
    useDocumentStore();
  const queryClient = useQueryClient();



  const { data } = useQuery({
    queryKey: ["setting", "document", "questions", currentType],
    queryFn: () => fetchQuestionsByField(currentType),
  });

  const { data: allQuestionsData } = useQuery({
    queryKey: ["setting", "document", "all-questions"],
    queryFn: () => fetchAllQuestions(),
  });

  const allQuestions = allQuestionsData?.result || [];

  useEffect(() => {
    if (data) {
      setQuestions(data.result);
    }
  }, [data, currentType]);


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
      mode: "focused",
    };

    const temp = [...(questions ?? []), newQuestion];
    setQuestions(temp);
  };

  const deleteQuestion = async (itemId: string) => {
    try {
      const questionId = parseInt(itemId);
      
      if (!isNaN(questionId)) {
        const existingQuestion = allQuestions?.find((q: any) => q.id === questionId);
        
        if (existingQuestion) {
       
          await deleteQuestionById(questionId);
         
        } else {
          console.log("기존 질문이 없어서 로컬에서만 삭제:", questionId);
        }
      }
      
      // 로컬 상태에서도 제거
      const temp = questions.filter((question) => question.id !== itemId);
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

  const editQuestion = async (itemId: string, updatedQuestion: string, required?: boolean) => {
    const newQuestions = questions.map((item) => ({
      ...item,
      question: item.id === itemId ? updatedQuestion : item.question,
      required: required !== undefined && item.id === itemId ? required : item.required,
    }));
    setQuestions(newQuestions);

    if (updatedQuestion.trim() && currentType) {
      try {
        const questionItem = newQuestions.find(q => q.id === itemId);
        if (questionItem) {
          const existingQuestion = allQuestions?.find((q: any) => q.id === parseInt(itemId));
          
          if (existingQuestion) {

            
            const response = await updateQuestion(
              existingQuestion.id,
              updatedQuestion.trim(),
              currentType,
              existingQuestion.ordered,
              existingQuestion.textLength || 500,
              required !== undefined ? required : existingQuestion.required
            );
            console.log("질문이 성공적으로 수정되었습니다:", updatedQuestion);
            console.log("API 응답:", response);
            
            await queryClient.invalidateQueries({ queryKey: ["setting", "document", "questions", currentType] });
            await queryClient.invalidateQueries({ queryKey: ["setting", "document", "all-questions"] });
          } else {
           
            const response = await postQuestionByField(
              currentType,
              updatedQuestion.trim(),
              required !== undefined ? required : questionItem.required,
              questionItem.maxLength
            );

            await queryClient.invalidateQueries({ queryKey: ["setting", "document", "questions", currentType] });
            await queryClient.invalidateQueries({ queryKey: ["setting", "document", "all-questions"] });
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
    setQuestions(newQuestions);
  };

  const toggleRequired = (itemId: string) => {
    const newQuestions = questions.map((question) => ({
      ...question,
      required: question.id === itemId ? !question.required : question.required,
    }));
    setQuestions(newQuestions);
  };

  const swapQuestions = async (id1: number, id2: number) => {
    try {
      await swapQuestionOrder(id1, id2);
    } catch (error) {
      console.error("질문 순서 변경 실패:", error);
    }
  };

  const getProgrammingLevel = async (id: number) => {
    try {
      const result = await fetchProgrammingLevel(id);
      return result;
    } catch (error) {
      console.error("프로그래밍 레벨 조회 실패:", error);
      return null;
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
    getProgrammingLevel,
  };
};

export default useDocument;
