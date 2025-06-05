import { axiosInstance } from "@/api/axiosInstance";

const fetchAllInterviewers = async () => {
  try {
    const res = await axiosInstance.get("/v1/admin/interview");
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

export {
  fetchAllInterviewers,
  fetchInterviewer,
  postInterviewDate,
  postInterviewFile,
};
