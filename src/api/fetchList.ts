import { axiosInstance } from "@/api/axiosInstance";
import { type ApplicationType, type Status } from "@/types/application";

export interface Pagination {
  page: number;
  size: number;
  status?: Status;
}
export const fetchList = async (
  type: ApplicationType,
  { page, size, status }: Pagination
) => {
  try {
    let url = "";
    const params: Record<string, any> = { page, size };

    // status가 undefined, null이 아닐 때 params에 추가 (ALL 포함)
    if (status !== undefined && status !== null) {
      params.status = status;
    }

    switch (type) {
      case "알림 신청":
        url = "/v1/admin/notification";
        break;
      case "지원서":
        url = `/v1/manager/resume/evaluate`;
        // status가 유효한 값일 때만 추가 (ALL 포함)
        if (status !== undefined && status !== null) {
          params.status = status;
        }
        break;
      case "면접 설정":
        url = `/v1/manager/interview-final`;
        params.pageNum = page;
        params.pageSize = size;
        break;
      case "서류 평가":
        url = `/v1/manager/resume/evaluate`;
        break;
      case "최종 서류 평가":
        url = `/v1/manager/resume/evaluate/final`;
        break;
      case "최종 면접 평가":
        url = `/v1/manager/interview-final`;
        params.pageNum = page;
        params.pageSize = size;
        const finalInterviewRes = await axiosInstance.get(url, { params });
        return finalInterviewRes.data;
    }

    console.log("=== fetchList API 요청 ===");
    console.log("Base URL:", axiosInstance.defaults.baseURL);
    console.log("Full URL:", `${axiosInstance.defaults.baseURL}${url}`);
    console.log("Params:", params);
    console.log("Status:", status);

    const res = await axiosInstance.get(url, { params });

    console.log("응답 상태:", res.status);
    console.log("응답 헤더:", res.headers);
    console.log("응답 데이터:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("=== fetchList API 에러 ===");
    console.error("에러 메시지:", error.message);
    console.error("에러 응답:", error.response?.data);
    console.error("에러 상태:", error.response?.status);
    console.error("에러 헤더:", error.response?.headers);
    console.error("전체 에러:", error);
    throw error;
  }
};
