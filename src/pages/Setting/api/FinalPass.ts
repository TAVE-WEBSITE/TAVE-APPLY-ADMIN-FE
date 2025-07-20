import { axiosInstance } from "@/api/axiosInstance";
import type { FinalPassResult } from "./types";

const fetchSettingFinalPass = async () => {
  try {
    const res = await axiosInstance.get("/v1/member/final-pass");
    return res.data;
  } catch (error) {
    return error;
  }
};

const postSettingFinalPass = async (data : FinalPassResult) => {
  try {
    const res = await axiosInstance.post("/v1/admin/final-pass", data);
    return res.data;
  } catch (error: any) {
    throw error; 
  }
};

export { fetchSettingFinalPass, postSettingFinalPass };
