import { axiosInstance } from "@/api/axiosInstance";
import { type ApplicationType, type Status } from "@/types/application";

export interface Pagination {
  page: number;
  size: number;
  status?: Status;
}

export interface InterviewTimeParams {
  date: string;
  time: string;
}

export const fetchList = async (
  type: ApplicationType,
  params: Pagination | InterviewTimeParams
) => {
  try {
    let url = "";
    let requestParams: Record<string, any> = {};

    if (type === "면접 현황") {
      const { date, time } = params as InterviewTimeParams;
      url = "/v1/manager/resume/interview-time";
      requestParams = { date, time };
    } else {
      const { page, size, status } = params as Pagination;
      requestParams = { page, size };
      if (status !== undefined && status !== null) {
        requestParams.status = status;
      }
      switch (type) {
        case "알림 신청":
          url = "/v1/admin/notification";
          break;
        case "지원서":
          url = `/v1/manager/resume/evaluate`;
          if (status !== undefined && status !== null) {
            requestParams.status = status;
          }
          break;
        case "면접 설정":
          url = `/v1/manager/interview-final`;
          requestParams.pageNum = page;
          requestParams.pageSize = size;
          break;
        case "서류 평가":
          url = `/v1/manager/resume/evaluate`;
          break;
        case "최종 서류 평가":
          url = `/v1/manager/resume/evaluate/final`;
          break;
        case "최종 면접 평가":
          url = `/v1/admin/interview-final`;
          break;
      }
    }

    console.log("=== fetchList API 요청 ===");
    console.log("Params:", requestParams);
    console.log("URL:", url);
    console.log("Type:", type);

    const res = await axiosInstance.get(url, { params: requestParams });

    console.log("응답 데이터:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("전체 에러:", error);
    throw error;
  }
};
