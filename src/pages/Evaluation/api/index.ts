import { axiosInstance } from "@/api/axiosInstance";

export const fetchDocumentDetail = async (resumeId: string) => {
  try {
    const res = await axiosInstance.get(
      `/v1/manager/resume/evaluate/final/${resumeId}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updateStatusByDocumentEvaluation = async () => {
  try {
    const res = await axiosInstance.get(
      `/v1/admin/config/applicant/history/document/status`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

interface postApplicationBody {
  score: string | number;
  opinion: string;
}
export const postApplication = async (
  resumeId: string,
  body: postApplicationBody
) => {
  try {
    const res = await axiosInstance.post(
      `/v1/manager/resume/evaluate/${resumeId}`,
      body
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getInterviewTimeTable = async (generation: number | string) => {
  try {
    const res = await axiosInstance.get(
      `/v1/manager/interview-final/time-table/${generation}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getTimeTableForm = async () => {
  try {
    const res = await axiosInstance.get("/v1/manager/interview-final/form", {
      responseType: "blob",
    });

    // 다운로드 처리
    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const disposition = res.headers["content-disposition"];
    const match = disposition?.match(/filename="?(.+)"?/);
    const filename = match?.[1] || "면접시간표 양식.xlsx";

    link.download = decodeURIComponent(filename);
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("다운로드 실패:", error);
  }
};

// 왜 다운로드가 하나만 있을까?
export const getSheet = async () => {
  try {
    const res = await axiosInstance.get("/v1/manager/interview-final/sheet");
    return res.data;
  } catch (error) {
    return error;
  }
};
