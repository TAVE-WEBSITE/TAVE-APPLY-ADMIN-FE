import { axiosInstance } from "../axiosInstance";

export const getNotificationList = async () => {
  try {
    const res = await axiosInstance.get("/v1/admin/notification");
    return res.data;
  } catch (error) {
    return error;
  }
};
