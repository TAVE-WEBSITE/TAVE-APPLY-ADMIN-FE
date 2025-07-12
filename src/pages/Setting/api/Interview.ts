import { axiosInstance } from "@/api/axiosInstance";

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
    formData.append(`${file}`, file);
    const res = await axiosInstance.post(
      "/v1/admin/interview/files",
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

// 면접 장소 조회 API 없음 -> 필요하면 백엔드 요청 필요
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
    console.log("면접 설정 등록 API 호출:", payload);
    const res = await axiosInstance.post("/v1/manager/interview-place", payload);
    console.log("면접 설정 등록 성공:", res.data);
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
};
