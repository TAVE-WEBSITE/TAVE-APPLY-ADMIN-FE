import { useEffect } from "react";
import useDocumentStore from "./useDocumentStore";
import {
  fetchSkillSetByField,
  fetchQuestionsByField,
} from "@/pages/Setting/api/Document";

import { useQuery } from "@tanstack/react-query";

const useDocument = () => {
  const { questions, setQuestions, currentType, setSkillSets } =
    useDocumentStore();

  const { data } = useQuery({
    queryKey: ["setting", "document", "questions", currentType],
    queryFn: () => fetchQuestionsByField(currentType),
  });

  const { data: currentSkills } = useQuery({
    queryKey: ["setting", "document", "skills", currentType],
    queryFn: () => fetchSkillSetByField(currentType),
    enabled: currentType !== "COMMON",
  });

  useEffect(() => {
    if (data) {
      setQuestions(data.result);
    }
    if (currentSkills) {
      setSkillSets(currentSkills.result);
    }
  }, [data, currentSkills]);

  const addNewQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      question: "",
      maxLength: 100,
      required: false,
    };
    const temp = [...questions, newQuestion];
    setQuestions(temp);
  };

  const deleteQuestion = (itemId: string) => {
    const temp = questions.filter((question) => question.id !== itemId);
    setQuestions(temp);
  };

  const startEditQuestion = (itemId: string) => {
    const newQuestions = questions.map((question) => ({
      ...question,
      mode: question.id === itemId ? "focused" : "blurred",
    }));
    setQuestions(newQuestions);
  };

  const editQuestion = (itemId: string, updatedQuestion: string) => {
    const newQuestions = questions.map((item) => ({
      ...item,
      question: item.id === itemId ? updatedQuestion : item.question,
    }));
    setQuestions(newQuestions);
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

  return {
    questions,
    setQuestions,
    addNewQuestion,
    deleteQuestion,
    startEditQuestion,
    editQuestion,
    endEditQuestion,
    toggleRequired,
  };
};

export default useDocument;
