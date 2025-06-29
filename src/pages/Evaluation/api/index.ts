import { axiosInstance } from "@/api/axiosInstance";

export const fetchDocumentDetail = async (resumeId: string) => {
  try {
    const res = await axiosInstance.get(
      `/v1/manager/resume/evaluate/final/${resumeId}`
    );
    return res.data;
  } catch (error) {
    return error;
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
