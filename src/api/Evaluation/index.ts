import { axiosInstance } from "../axiosInstance";

interface postApplicationBody {
  score: string | number;
  opinion: string;
}
const postApplication = async (resumeId: string, body: postApplicationBody) => {
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

const getInterviewTimeTable = async (generation: number | string) => {
  try {
    const res = await axiosInstance.get(
      `/api/interviews/timetable?generation=${generation}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

const getTimeTableForm = async () => {
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

const getSheet = async () => {
  try {
    const res = await axiosInstance.get("/v1/manager/interview-final/sheet");
    return res.data;
  } catch (error) {
    return error;
  }
};

export { postApplication, getInterviewTimeTable, getTimeTableForm, getSheet };
