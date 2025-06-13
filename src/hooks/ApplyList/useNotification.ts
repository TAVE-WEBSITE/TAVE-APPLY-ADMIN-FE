import { axiosInstance } from "@/api/axiosInstance";
import { useState } from "react";

export const useNotification = () => {
  const [isPending, setIsPending] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastOpen, setIsToastOpen] = useState(false);

  const postNotification = async () => {
    setIsPending(true);
    try {
      const res = await axiosInstance.post(
        "/v1/admin/notification/reservation"
      );
      setToastMessage("전체 메일 전송했습니다");
      setIsToastOpen(true);
      return res.data;
    } catch (error) {
      return error;
    } finally {
      setIsPending(false);
    }
  };

  const postIndividual = async (id: string | number) => {
    try {
      const res = await axiosInstance.post(
        `/v1/admin/notification/individual?id=${id}`
      );
      setToastMessage(`${id}번 회원에 대해 메일 전송했습니다`);
      setIsToastOpen(true);
      return res.data;
    } catch (error) {
      return error;
    }
  };

  return {
    isPending,
    isToastOpen,
    toastMessage,
    setIsToastOpen,
    postNotification,
    postIndividual,
  };
};
