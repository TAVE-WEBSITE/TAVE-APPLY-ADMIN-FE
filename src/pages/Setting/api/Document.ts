import { axiosInstance } from "@/api/axiosInstance";
import type { DocumentKey, DocumentType } from "@/types/document";
export type FieldType =
  | "DESIGN"
  | "DEEPLEARNING"
  | "DATAANALYSIS"
  | "WEBFRONTEND"
  | "APPFRONTEND"
  | "BACKEND"
  | "COMMON";

export const fetchQuestionsByField = async (fieldType: FieldType) => {
  try {
    const res = await axiosInstance.get(`/v1/manager/question/${fieldType}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return error;
  }
};

export const fetchAllQuestions = async () => {
  try {
    const res = await axiosInstance.get("/v1/manager/question");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch all questions:", error);
    return error;
  }
};

export const fetchSkillSetByField = async (fieldType: FieldType) => {
  try {
    const res = await axiosInstance.get(`/v1/manager/lan/${fieldType}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const postSkillSetByField = async (
  fieldType: FieldType,
  skill: string
) => {
  try {
    const res = await axiosInstance.post("/v1/manager/lan", {
      field: fieldType,
      language: skill,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteSkillSetById = async (id: string | number) => {
  try {
    const res = await axiosInstance.delete(`/v1/manager/lan/${id}`);
    return res.data;
  } catch (error) {
    console.error("프로그래밍 언어 삭제 실패:", error);
    return error;
  }
};

export const postQuestionByField = async (
  fieldType: FieldType,
  question: string,
  required: boolean = false,
  maxLength?: number
) => {
  try {
    const requestBody = {
      content: question,
      fieldType: fieldType,
      textLength: maxLength || 500,
      answerType: "TEXTAREA",
      required: required,
    };

    const res = await axiosInstance.post("/v1/manager/question", requestBody);
    return res.data;
  } catch (error) {
    console.error("질문 생성 실패:", error);
    return error;
  }
};

export const updateQuestion = async (
  id: number,
  content: string,
  fieldType: FieldType,
  ordered: number,
  textLength: number = 500
) => {
  try {
    const requestBody = {
      id: id,
      content: content,
      fieldType: fieldType,
      ordered: ordered,
      textLength: textLength,
      answerType: "TEXTAREA",
    };

    const res = await axiosInstance.patch("/v1/manager/question", requestBody);
    return res.data;
  } catch (error) {
    console.error("질문 수정 실패:", error);
    return error;
  }
};

export const swapQuestionOrder = async (id1: number, id2: number) => {
  try {
    const requestBody = {
      id1: id1,
      id2: id2,
    };

    const res = await axiosInstance.patch("/v1/manager/question/swap", requestBody);
    return res.data;
  } catch (error) {
    console.error("질문 순서 변경 실패:", error);
    return error;
  }
};

export const deleteQuestionById = async (questionId: number) => {
  try {
    const res = await axiosInstance.delete(`/v1/manager/question/${questionId}`);
    return res.data;
  } catch (error) {
    console.error("질문 삭제 실패:", error);
    return error;
  }
};

export const fetchProgrammingLevel = async (id: number) => {
  try {
    const res = await axiosInstance.get(`/v1/member/lan/${id}`);
    return res.data;
  } catch (error) {
    console.error("프로그래밍 레벨 조회 실패:", error);
    return error;
  }
};

const documentMap: Record<DocumentKey, DocumentType> = {
  "공통 질문": "COMMON",
  "앱 프론트": "APPFRONTEND",
  "웹 프론트": "WEBFRONTEND",
  백엔드: "BACKEND",
  디자인: "DESIGN",
  "데이터 분석": "DATAANALYSIS",
  딥러닝: "DEEPLEARNING",
};

export const fetchItems = async (roleType: DocumentKey) => {
  try {
    const res = await axiosInstance.get(
      `/api/setting/document/${documentMap[roleType]}`
    );
    return res.data;
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return [];
  }
};
