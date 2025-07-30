import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { submitInterviewFinalEvaluation } from "./index"; 
import { useState } from "react";

export const useFinalInterviewEvaluation = (interviewFinalId?: string) => {
  const navigate = useNavigate();
  const [interviewFinalPostMessage, setInterviewFinalPostMessage] = useState("");
  const [isInterviewFinalToastOpen, setIsInterviewFinalToastOpen] = useState(false);

  const {
    mutate: interviewFinalMutate,
    isPending: isInterviewFinalPending,
    isError: isInterviewFinalError,
  } = useMutation({
    mutationKey: ["final-interview-evaluation", "submit"],
    mutationFn: (status: "FINAL_PASS" | "FINAL_FAIL") => {
      if (!interviewFinalId) {
        throw new Error("interviewFinalId가 없습니다.");
      }
      return submitInterviewFinalEvaluation(interviewFinalId, status);
    },
    onSuccess: (response) => {
      setInterviewFinalPostMessage(
        response.message || "최종 면접 평가가 성공적으로 제출되었습니다."
      );
      setIsInterviewFinalToastOpen(true);
      setTimeout(() => {
        navigate("/evaluation/interview/final");
      }, 1000);
    },
    onError: (error: any) => {
      setInterviewFinalPostMessage(
        error.response?.data?.message || "최종 면접 평가 제출에 실패했습니다."
      );
      setIsInterviewFinalToastOpen(true);
    },
  });

  return {
    interviewFinalMutate,
    isInterviewFinalPending,
    isInterviewFinalError,
    interviewFinalPostMessage,
    isInterviewFinalToastOpen,
    setIsInterviewFinalToastOpen,
  };
};
