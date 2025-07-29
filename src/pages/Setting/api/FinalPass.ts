import { axiosInstance } from "@/api/axiosInstance";
import type { FinalPassResult } from "./types";

const formatDateTimeForBackend = (dateTimeStr: string): string => {
  if (!dateTimeStr) return "";
  return dateTimeStr.replace(/\.\d{3}Z$/, "");
};

const fetchSettingFinalPass = async () => {
  try {
    console.log("=== 최종 합격 안내 조회 API 호출 ===");
    console.log("API 경로:", "/v1/member/final-pass");
    console.log("현재 토큰:", sessionStorage.getItem("access_token"));
    
    const res = await axiosInstance.get("/v1/member/final-pass");
    console.log("API 응답:", res.data);
    console.log("응답 상태:", res.status);
    console.log("=============================");
    return res.data;
  } catch (error: any) {
    console.error("=== 최종 합격 안내 조회 API 에러 ===");
    console.error("에러 타입:", typeof error);
    console.error("에러 메시지:", error?.message);
    console.error("에러 응답:", error?.response);
    console.error("에러 상태:", error?.response?.status);
    console.error("에러 데이터:", error?.response?.data);
    console.error("전체 에러:", error);
    console.error("=============================");
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
