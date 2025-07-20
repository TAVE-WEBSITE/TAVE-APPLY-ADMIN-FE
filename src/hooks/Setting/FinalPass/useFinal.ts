import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { SettingFinalPassResponse } from "@/pages/Setting/api/types";
import {
  fetchSettingFinalPass,
  postSettingFinalPass,
} from "@/pages/Setting/api/FinalPass";

export const useFinalPassSetting = () => {
  const { data, isLoading, error } = useQuery<SettingFinalPassResponse>({
    queryKey: ["setting", "final-pass"],
    queryFn: fetchSettingFinalPass,
    retry: false,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const {
    mutate,
    isPending,
    isSuccess,
    isError,
    data: mutationData,
  } = useMutation({
    mutationFn: postSettingFinalPass,
    onSuccess: (data: any) => {
      setToastMessage(data?.message);
    },
    onError: () => {
      setToastMessage("최종 합격 안내 설정에 실패했습니다.");
    },
  });

  const [totalFee, setTotalFee] = useState(0);
  const [clubFee, setClubFee] = useState(0);
  const [mtFee, setMtFee] = useState(0);
  const [feeDeadline, setFeeDeadline] = useState(""); // ISO
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [surveyLink, setSurveyLink] = useState("");
  const [surveyDeadline, setSurveyDeadline] = useState(""); // ISO
  const [otLink, setOtLink] = useState("");
  const [otPassword, setOtPassword] = useState("");
  const [otDeadline, setOtDeadline] = useState(""); // ISO

  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!data) return;
    const res = data.result;
    setTotalFee(res?.totalFee);
    setClubFee(res?.clubFee);
    setMtFee(res?.mtFee);
    setFeeDeadline(res?.feeDeadline || ""); // ISO
    setBankName(res?.bankName);
    setAccountNumber(res?.accountNumber);
    setAccountHolder(res?.accountHolder);
    setSurveyLink(res?.surveyLink);
    setSurveyDeadline(res?.surveyDeadline || ""); // ISO
    setOtLink(res?.otLink);
    setOtPassword(res?.otPassword);
    setOtDeadline(res?.otDeadline || ""); // ISO
  }, [data]);

  const updateFinalPassSetting = () => {
    mutate({
      totalFee: Number(totalFee),
      clubFee: Number(clubFee),
      mtFee: Number(mtFee),
      feeDeadline,
      bankName,
      accountNumber,
      accountHolder,
      surveyLink,
      surveyDeadline,
      otLink,
      otPassword,
      otDeadline,
    });
  };

  return {
    isLoading,
    isPending,
    isSuccess,
    isError,
    mutationData,
    error,
    totalFee,
    setTotalFee,
    clubFee,
    setClubFee,
    mtFee,
    setMtFee,
    feeDeadline,
    setFeeDeadline,
    bankName,
    setBankName,
    accountNumber,
    setAccountNumber,
    accountHolder,
    setAccountHolder,
    surveyLink,
    setSurveyLink,
    surveyDeadline,
    setSurveyDeadline,
    otLink,
    setOtLink,
    otPassword,
    setOtPassword,
    otDeadline,
    setOtDeadline,
    updateFinalPassSetting,
    toastMessage,
  };
};
