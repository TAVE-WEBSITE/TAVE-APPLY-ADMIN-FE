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

export { postApplication };
