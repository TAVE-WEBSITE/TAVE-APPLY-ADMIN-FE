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
