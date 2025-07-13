import { axiosInstance } from "@/api/axiosInstance";

export const fetchDocumentDetail = async (resumeId: string) => {
  try {
    console.log("=== fetchDocumentDetail API 호출 ===");
    console.log("resumeId:", resumeId);
    console.log("요청 URL:", `/v1/manager/resume/evaluate/${resumeId}`);
    
    const res = await axiosInstance.post(
      `/v1/manager/resume/evaluate/${resumeId}`
    );

    
    return res.data;
  } catch (error: any) {
    console.error("=== fetchDocumentDetail API 에러 ===");
    console.error("에러:", error);
    if (error.response) {
      console.error("에러 상태:", error.response.status);
      console.error("에러 데이터:", error.response.data);
    }
    throw error; 
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
    
    console.log("=== postApplication API 응답 ===");
    console.log("응답 상태:", res.status);
    console.log("응답 데이터:", res.data);
    
    return res.data;
  } catch (error: any) {
    console.error("=== postApplication API 에러 ===");
    console.error("에러:", error);
    if (error.response) {
      console.error("에러 데이터:", error.response.data);
    }
    throw error;
  }
};

export const getInterviewTimeTable = async (generation: number | string) => {
  try {
    const res = await axiosInstance.get(
      `/api/interviews/timetable?generation=${generation}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getTimeTableForm = async () => {
  try {
    const res = await axiosInstance.get("/v1/manager/interview-final/form", {
      responseType: "blob", // 👈 중요: 파일 다운로드할 때 blob으로 설정
    });

    // 다운로드 처리
    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // 서버에서 파일명을 내려주는 경우 Content-Disposition 파싱 필요
    const disposition = res.headers["content-disposition"];
    const match = disposition?.match(/filename="?(.+)"?/);
    const filename = match?.[1] || "form.xlsx";

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
