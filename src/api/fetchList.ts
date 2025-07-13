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

    switch (type) {
      case "알림 신청":
        url = "/v1/admin/notification";
        break;
      case "지원서":
        url = `/v1/manager/resume/evaluate`;
        params.status = status;
        break;
      case "면접 설정":
        url = `/v1/manager/interview-final?pageNum=${page}&pageSize=${size}`;
        break;
      case "서류 평가":
        url = `/v1/manager/resume/evaluate`;
        params.status = status;
        break;
      case "최종 서류 평가":
        // 아직 구현안함
        url = "/v1/manager/resume/evaluate/final";
        params.status = status;
        break;
    }

    const res = await axiosInstance.get(url, { params });
    console.log(res.data);
    return res.data;
  } catch (error: any) {
    console.error("=== API 에러 정보 ===");
    console.error("에러:", error);
    if (error.response) {
      console.error("에러 상태:", error.response.status);
      console.error("에러 데이터:", error.response.data);
    }
    throw error;
  }
};
