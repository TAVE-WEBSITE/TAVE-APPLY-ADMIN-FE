import { axiosInstance } from "@/api/axiosInstance";
import type { FinalPassResult } from "./types";

const formatDateTimeForBackend = (dateTimeStr: string): string => {
  if (!dateTimeStr) return "";
  return dateTimeStr.replace(/\.\d{3}Z$/, "");
};

const fetchSettingFinalPass = async () => {
  try {
    const res = await axiosInstance.get("/v1/member/final-pass");
    return res.data;
  } catch (error: any) {

    return error;
  }
};

const postSettingFinalPass = async (data : FinalPassResult) => {
  try {
    // 백엔드 형식에 맞게 날짜 변환
    const formattedData = {
      ...data,
      feeDeadline: formatDateTimeForBackend(data.feeDeadline),
      surveyDeadline: formatDateTimeForBackend(data.surveyDeadline),
      otDeadline: formatDateTimeForBackend(data.otDeadline),
    };

    const res = await axiosInstance.post("/v1/admin/final-pass", formattedData);
    return res.data;
  } catch (error: any) {
    throw error; 
  }
};

export { fetchSettingFinalPass, postSettingFinalPass };
