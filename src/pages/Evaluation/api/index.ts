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
    throw error; 
  }
};

// 서류 평가 조회
export const getDocumentDetail = async (resumeId: string, body?: DocumentEvaluationBody) => {
  try {
    const requestBody = body || {};

    const res = await axiosInstance.get(
      `/v1/manager/resume/evaluate/${resumeId}`,
      requestBody
    );
    return res.data;
  } catch (error: any) {
  
    // resumeEvaluation이 null인 경우 빈 결과 반환
    if (error.response?.data?.message?.includes("resumeEvaluation") && 
        error.response?.data?.message?.includes("null")) {
      return {
        code: "200",
        message: "평가 데이터가 없습니다.",
        result: null
      };
    }
    
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

// 운영진 평가 조회 API
export const fetchFinalEvaluation = async (resumeId: string) => {
  try {
    const res = await axiosInstance.get(
      `/v1/manager/resume/evaluate/final/${resumeId}`
    );
    return res.data;
  } catch (error: any) {
    console.error("운영진 평가 조회 에러:", error);
    throw error;
  }
};

// 최종 평가 제출 API
export const submitFinalEvaluation = async (resumeId: string, status: "PASS" | "FAIL") => {
  try {
    const res = await axiosInstance.post(
      `/v1/manager/resume/evaluate/final/${resumeId}`,
      { status }
    );
    return res.data;
  } catch (error: any) {
    console.error("최종 평가 제출 에러:", error);
    throw error;
  }
};

// 포트폴리오 다운로드 API
export const downloadPortfolio = async (resumeId: string) => {
  try {
    const res = await axiosInstance.get(
      `/v1/manager/resume/portfolio/${resumeId}`,
      {
        responseType: 'blob',
        headers: {
          'Accept': 'application/octet-stream',
        },
      }
    );
    
    if (res.data instanceof Blob) {
      return res.data;
    } else {
      throw new Error('응답이 Blob 형태가 아닙니다.');
    }
  } catch (error: any) {
    console.error("포트폴리오 다운로드 에러:", error);
    
    throw error;
  }
};

// 지원서 질문 & 답변 정보 API
export const fetchResumeQuestions = async (resumeId: string) => {
  try {
    const res = await axiosInstance.get(
      `/v1/member/resumes/${resumeId}/details`
    );
    const result = res.data?.result;
    
    // 공통 질문과 파트별 질문을 분리하여 변환
    const commonQuestions = result?.common?.commonQuestions?.map((q: any) => ({
      question: q.question,
      answer: q.answer || "답변이 없습니다.",
      id: q.id,
      fieldType: q.fieldType,
      ordered: q.ordered,
      answerType: q.answerType,
      textLength: q.textLength,
      required: q.required,
      common: q.common
    })) || [];
    
    const partQuestions = result?.specific?.specificQuestions?.map((q: any) => ({
      question: q.question,
      answer: q.answer || "답변이 없습니다.",
      id: q.id,
      fieldType: q.fieldType,
      ordered: q.ordered,
      answerType: q.answerType,
      textLength: q.textLength,
      required: q.required,
      common: q.common
    })) || [];
    
    return {
      result: {
        commonQuestions: commonQuestions,
        partQuestions: partQuestions,
        timeSlots: result?.common?.timeSlots || [],
        languageLevels: result?.specific?.languageLevels || [],
        blogUrl: result?.common?.blogUrl,
        githubUrl: result?.common?.githubUrl,
        portfolioUrl: result?.common?.portfolioUrl
      }
    };
    
    return {
      result: {
        commonQuestions: commonQuestions,
        partQuestions: partQuestions,
        timeSlots: result?.common?.timeSlots || [],
        languageLevels: result?.specific?.languageLevels || [],
        blogUrl: result?.common?.blogUrl,
        githubUrl: result?.common?.githubUrl,
        portfolioUrl: result?.common?.portfolioUrl
      }
    };
  } catch (error: any) {

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
      `/v1/manager/interview-final/time-table/${generation}`
    );
    return res.data;
  } catch (error: any) {
    console.error("GET /v1/manager/interview-final/time-table 에러 상세:");
    console.error("URL:", `/v1/manager/interview-final/time-table/${generation}`);
    console.error("에러 객체:", error);
    if (error.response) {
      console.error("응답 상태:", error.response.status);
      console.error("응답 헤더:", error.response.headers);
      console.error("응답 데이터:", error.response.data);
    } else if (error.request) {
      console.error("요청 객체:", error.request);
    } else {
      console.error("에러 메시지:", error.message);
    }
    console.error("전체 에러 스택:", error.stack);
    return error;
  }
};

// 면접 시간표 다운로드
export const getTimeTableForm = async () => {
  try {
    const res = await axiosInstance.get("/v1/manager/excel/interview/time-table", {
      responseType: "blob",
    });

    // 다운로드 처리
    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const disposition = res.headers["content-disposition"];
    const match = disposition?.match(/filename="?(.+)"?/);
    const filename = match?.[1] || "면접시간표.xlsx";

    link.download = decodeURIComponent(filename);
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("다운로드 실패:", error);
  }
};

// 면접 평가 시트 다운로드
export const getSheet = async () => {
  try {
    const res = await axiosInstance.get("/v1/manager/excel/interview/evaluation", {
      responseType: "blob", // 파일 다운로드를 위해 blob으로 설정
    });

    // 다운로드 처리
    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // 서버에서 파일명을 내려주는 경우 Content-Disposition 파싱
    const disposition = res.headers["content-disposition"];
    const match = disposition?.match(/filename="?(.+)"?/);
    const filename = match?.[1] || "interview-evaluation-sheet.xlsx";

    link.download = decodeURIComponent(filename);
    link.click();
    window.URL.revokeObjectURL(url);
    
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const response = error.response as { data: Blob };
      if (response.data instanceof Blob) {
        const text = await response.data.text();
        try {
          const json = JSON.parse(text);
          console.error("서버 오류 메시지:", json);
        } catch {
        console.error("서버에서 반환된 오류 텍스트:", text);
      }
    }
    console.error("면접 평가 시트 다운로드 실패:", error);
    throw error;
  }
};}

//서류 평가 후 이메일 발송 예약
export const getRecruitmentEmailConfig = async () => {
  try {
    const res = await axiosInstance.get("/v1/admin/config/recruitment/document/email");
    return res.data;
  } catch (error) {
    return error;
  }
};

//서류 평가 후 이메일 발송 예약 취소
export const getRecruitmentEmailCancel = async () => {
  try {
    const res = await axiosInstance.get("/v1/admin/config/recruitment/document/email/cancel");
    return res.data;
  } catch (error) {
    return error;
  }
};

//면접 평가 후 이메일 발송 예약
export const getFinalInterviewEmailConfig = async () => {
  try {
    const res = await axiosInstance.get("/v1/admin/config/recruitment/last/email");
    return res.data;
  } catch (error) {
    return error;
  }
};

//면접 평가 후 이메일 발송 예약 취소
export const getFinalInterviewEmailCancel = async () => {
  try {
    const res = await axiosInstance.get("/v1/admin/config/recruitment/last/email/cancel");
    return res.data;
  } catch (error) {
    return error;
  }
};

// 서류 평가 이메일 예약 여부 조회
// api.ts (혹은 해당 파일)
export const getRecruitmentDocumentEmailFind = async (): Promise<{ isBooked: boolean }> => {
  try {
    const res = await axiosInstance.get("/v1/admin/config/recruitment/document/email/find");
    const isBooked = res.data?.result?.bookStatus;
    return {
      isBooked
    };
  } catch (error) {
    return {
      isBooked: false,
    };
  }
};


// 최종 면접 이메일 예약 여부 조회
export const getFinalInterviewEmailFind = async (): Promise<{ isBooked: boolean }> => {
  try {
    const res = await axiosInstance.get("/v1/admin/config/recruitment/last/email/find");
    const isBooked = res.data?.result?.bookStatus;
    return {
      isBooked,
    };
  } catch (error) {
    return {
      isBooked: false,
    };
  }
};


// 최종 면접 평가 제출 API
export const submitInterviewFinalEvaluation = async (
  interviewFinalId: string,
  status: "FINAL_PASS" | "FINAL_FAIL"
) => {
  try {
    const res = await axiosInstance.post(
      `/v1/admin/interview-final/${interviewFinalId}?status=${status}`
    );
    return res.data;
  } catch (error: any) {
    console.error("최종 면접 평가 제출 에러:", error.response?.data || error);
    throw error;
  }
};
