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
    const res = await axiosInstance.get("/v1/manager/interview-final/form");
    return res.data;
  } catch (error) {
    return error;
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
