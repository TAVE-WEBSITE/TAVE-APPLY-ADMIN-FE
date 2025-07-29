import { axiosInstance } from "@/api/axiosInstance";

export interface InterviewAddress {
  id: number;
  interviewDay: string;
  generalAddress: string;
  detailAddress: string;
  openChatLink: string;
  code: string;
}

const fetchAllInterviewers = async () => {
  try {
    const res = await axiosInstance.get("/v1/manager/interview-final");
    return res.data;
  } catch (error) {
    throw error;
  }
};

const fetchInterviewer = async (resumeId: string) => {
  try {
    const res = await axiosInstance.get(
      `/v1/admin/interview/resume?id=${resumeId}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

const postInterviewDate = async ({
  selectedDate,
}: {
  selectedDate: string;
}) => {
  try {
    const res = await axiosInstance.post("/v1/admin/interview", selectedDate);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const postInterviewFile = async ({ file }: { file: File }) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // 파일 필드명을 "file"로 수정
    const res = await axiosInstance.post(
      "/v1/manager/excel/interview/time-table",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

// 면접자 시간표 양식 다운로드
const downloadInterviewTimeTableForm = async () => {
  try {
    const res = await axiosInstance.get("/v1/manager/interview-final/form", {
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
    const filename = match?.[1] || "interview-time-table-form.xlsx";

    link.download = decodeURIComponent(filename);
    link.click();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("면접자 시간표 양식 다운로드 실패:", error);
    throw error;
  }
};

// 면접관 시간표 포함 다운로드
const downloadInterviewerTimeTableForm = async () => {
  try {
    const res = await axiosInstance.get("/v1/manager/excel/interview/time-table", {
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
    const filename = match?.[1] || "interviewer-time-table-form.xlsx";

    link.download = decodeURIComponent(filename);
    link.click();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("면접관 시간표 포함 다운로드 실패:", error);
    throw error;
  }
};

// 면접 가능 시간표 생성 (POST - 생성만)
const generateInterviewTimeTable = async () => {
  try {
    const res = await axiosInstance.post("/v1/manager/excel/interviewer/time-table");

  } catch (error) {
    console.error("면접 가능 시간표 생성 실패:", error);
    throw error;
  }
};

// 면접자 시간 파악 다운로드 (GET - 파일 다운로드)
const downloadInterviewerTimeTable = async () => {
  try {
    const res = await axiosInstance.get("/v1/manager/excel/interviewer/time-table", {
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
    const filename = match?.[1] || "interviewer-time-table.xlsx";

    link.download = decodeURIComponent(filename);
    link.click();
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error("면접자 시간 파악 다운로드 실패:", error);
    throw error;
  }
};

// 면접 평가 초기 양식 다운로드
const downloadInterviewEvaluationForm = async () => {
  try {
    const res = await axiosInstance.get("/v1/manager/excel/interview/evaluation-form", {
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
    const filename = match?.[1] || "interview-evaluation-form.xlsx";

    link.download = decodeURIComponent(filename);
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("면접 평가 초기 양식 다운로드 실패:", error);
    throw error;
  }
};

// 면접자 시간표 파일 업로드
const uploadIntervieweeScheduleFile = async ({ file }: { file: File }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post(
      "/v1/manager/excel/interviewer/time-table",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("면접자 시간표 파일 업로드 실패:", error);
    throw error;
  }
};

// 면접관 시간표 파일 업로드
const uploadInterviewerScheduleFile = async ({ file }: { file: File }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post(
      "/v1/manager/excel/interview/time-table",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("면접관 시간표 파일 업로드 실패:", error);
    throw error;
  }
};

// 면접 평가 시트 템플릿 업로드
const uploadInterviewEvaluationTemplate = async ({ file }: { file: File }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post(
      "/v1/manager/excel/interview/evaluation",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("면접 평가 시트 템플릿 업로드 실패:", error);
    throw error;
  }
};



// 면접 장소 조회 
const fetchAddress = async () => {
  try {
    const res = await axiosInstance.get("/v1/manager/interview-place");
    return res.data;
  } catch (error) {
    return error;
  }
};


const fetchInterviewTime = async () => {
  try {
    const res = await axiosInstance.get("/v1/manager/config/interview-time");
    return res.data;
  } catch (error) {
    return error;
  }
};
const postInterviewPlace = async (payload: any) => {
  try {
    const res = await axiosInstance.post("/v1/manager/interview-place", payload);
    return res.data;
  } catch (error) {
    console.error("면접 설정 등록 실패:", error);
    return error;
  }
};

export {
  fetchAllInterviewers,
  fetchInterviewer,
  postInterviewDate,
  postInterviewFile,
  fetchAddress,
  postInterviewPlace,
  fetchInterviewTime,
  downloadInterviewTimeTableForm,
  downloadInterviewerTimeTableForm,
  generateInterviewTimeTable,
  downloadInterviewerTimeTable,
  downloadInterviewEvaluationForm,
  uploadIntervieweeScheduleFile,
  uploadInterviewerScheduleFile,
  uploadInterviewEvaluationTemplate,
};
