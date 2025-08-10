import { axiosInstance } from "@/api/axiosInstance";
import { type ApplicationType, type Status } from "@/types/application";

export interface Pagination {
  page: number;
  size: number;
  status?: Status;
  name?: string;
  pageType?: string;
  type?: string;
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
    let extractedPageType: string | undefined;
    let extractedType: string | undefined;

    if (type === "면접 현황") {
      const { date, time } = params as InterviewTimeParams;
      url = "/v1/manager/resume/interview-time";
      requestParams = { date, time };
    } else {
      const { page, size, status, name, pageType, type: fieldType } = params as Pagination;
      extractedPageType = pageType;
      extractedType = fieldType;
      requestParams = { page, size };
      if (status !== undefined && status !== null) {
        requestParams.status = status;
      }
      if (name && name.trim() !== "") {
        requestParams.name = name.trim();
      }
      if (pageType && pageType.trim() !== "") {
        requestParams.pageType = pageType;
      }
      if (fieldType && fieldType.trim() !== "") {
        requestParams.type = fieldType;
      }
      switch (pageType) {
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
    console.log("전달받은 type (ApplicationType):", type);
    console.log("전달받은 params:", params);
    console.log("추출된 pageType:", extractedPageType);
    console.log("추출된 type (지원분야):", extractedType);
    console.log("최종 URL:", url);
    console.log("최종 requestParams:", requestParams);


    const res = await axiosInstance.get(url, { params: requestParams });

    console.log("응답 데이터:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("전체 에러:", error);
    throw error;
  }
};
