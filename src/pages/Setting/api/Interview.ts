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

const fetchAddress = async () => {
  try {
    const res = await axiosInstance.get("/v1/manager/interview-place");
    return res.data;
  } catch (error) {
    return error;
  }
};

const postInterviewPlace = async (
  updatedInterviewPlace: Omit<InterviewAddress, "id">[]
) => {
  try {
    const res = await axiosInstance.post(
      "/v1/manager/interview-place",
      updatedInterviewPlace
    );
    return res.data;
  } catch (error) {
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
};
