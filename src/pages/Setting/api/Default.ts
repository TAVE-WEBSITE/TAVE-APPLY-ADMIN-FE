import { axiosInstance } from "@/api/axiosInstance";
import type { SettingBody } from "./types";

const fetchSettingDefault = async () => {
  try {
    const res = await axiosInstance.get("/v1/normal/apply/setting");
    return res.data;
  } catch (error) {
    return error;
  }
};

const postSettingDefault = async (data: SettingBody) => {
  try {
    const res = await axiosInstance.post("/v1/admin/apply/setting", data);
    return res.data;
  } catch (error) {
    return error;
  }
};

export { fetchSettingDefault, postSettingDefault };
