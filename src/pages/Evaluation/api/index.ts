import { axiosInstance } from "@/api/axiosInstance";

interface DocumentEvaluationBody {
  score: number;
  opinion: string;
}

export const fetchDocumentDetail = async (resumeId: string, body?: DocumentEvaluationBody) => {
  try {
    const requestBody = body || {};

    const res = await axiosInstance.post(
      `/v1/manager/resume/evaluate/${resumeId}`,
      requestBody
    );
    return res.data;
  } catch (error: any) {
      console.error("에러 상태:", error.response.status);
      console.error("에러 데이터:", error.response.data);
    throw error; 
  }
};

// 지원자 정보 조회 API
export const fetchMemberInfo = async (memberId: string) => {
  try {
    const res = await axiosInstance.get(
      `/v1/member/info/${memberId}`
    );
     
    return res.data;
  } catch (error: any) {
    console.error("에러:", error);
    throw error;
  }
};

// 지원서 질문 & 답변 정보 API
export const fetchResumeQuestions = async (resumeId: string) => {
  try {
    const allQuestions = [];
    
    for (let page = 1; page <= 2; page++) {
      const res = await axiosInstance.get(
        `/v1/member/resumes/${resumeId}/questions?page=${page}`
      );
      const pageData = res.data?.result || [];
      allQuestions.push(...pageData);
    }
    
 
    const transformedQuestions = allQuestions.map((q: any) => ({
      question: q.question,
      answer: q.answer || "답변이 없습니다."
    }));
    
    // page 1 = 파트별 질문 / [age 2 =공통 질문
    const partQuestions = transformedQuestions.slice(0, transformedQuestions.length / 2);
    const commonQuestions = transformedQuestions.slice(transformedQuestions.length / 2);
    
    return {
      result: {
        commonQuestions: commonQuestions,
        partQuestions: partQuestions
      }
    };
  } catch (error: any) {
    console.error("에러:", error);
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

    return res.data;
  } catch (error: any) {
    console.error("에러:", error);
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
