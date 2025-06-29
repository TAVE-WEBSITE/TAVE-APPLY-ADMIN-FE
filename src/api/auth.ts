import { axiosInstance } from "./axiosInstance";

export const logOut = async () => {
  try {
    const res = await axiosInstance.get(`/v1/auth/signout`);
    return res.data;
  } catch (error) {
    return error;
  }
};
