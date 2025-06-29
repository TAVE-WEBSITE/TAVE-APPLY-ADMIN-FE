import { axiosInstance } from "@/api/axiosInstance";

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
