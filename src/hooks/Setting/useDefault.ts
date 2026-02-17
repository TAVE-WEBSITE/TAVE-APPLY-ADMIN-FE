import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { SettingDefaultResponse } from "@/pages/Setting/api/types";
import { fetchSettingDefault } from "@/pages/Setting/api/Default";
import { postSettingDefault } from "@/pages/Setting/api/Default";
import { formatDateOnly, formatDateTime } from "@/utils/formatDate";

export const useDefaultSetting = () => {
  const { data, isLoading, error } = useQuery<SettingDefaultResponse>({
    queryKey: ["setting", "default"],
    queryFn: fetchSettingDefault,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const {
    mutate,
    isPending,
    data: mutationData,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: postSettingDefault,
  });

  const [nextGeneration, setNextGeneration] = useState("");
  const [documentStartDate, setDocumentStartDate] = useState("");
  const [documentEndDate, setDocumentEndDate] = useState("");
  const [documentResultDateTime, setDocumentResultDateTime] = useState("");
  const [interviewStartDate, setInterviewStartDate] = useState("");
  const [interviewEndDate, setInterviewEndDate] = useState("");
  const [finalResultDateTime, setFinalResultDateTime] = useState("");
  const [homepageOpenStartDate, setHomepageOpenStartDate] = useState("");
  const [homepageOpenEndDate, setHomepageOpenEndDate] = useState("");

  useEffect(() => {
    if (!data) return;
    setNextGeneration(data?.result?.generation || "");
    setDocumentStartDate(formatDateOnly(data?.result?.documentRecruitStartDate));
    setDocumentEndDate(formatDateOnly(data?.result?.documentRecruitEndDate));
    setDocumentResultDateTime(
      formatDateTime(data?.result?.documentAnnouncementDate)
    );
    setInterviewStartDate(formatDateOnly(data?.result?.interviewStartDate));
    setInterviewEndDate(formatDateOnly(data?.result?.interviewEndDate));
    setFinalResultDateTime(formatDateTime(data?.result?.lastAnnouncementDate));
    setHomepageOpenStartDate(formatDateOnly(data?.result?.accessStartDate));
    setHomepageOpenEndDate(formatDateOnly(data?.result?.accessEndDate));
  }, [data]);

  const updateDefaultSetting = () => {
    const toLocalDateTime = (date: string, time: string) =>
      date.replace(/\./g, "-") + "T" + time;

    // documentResultDateTime과 finalResultDateTime에서 시간 추출
    const extractTimeFromDateTime = (dateTime: string) => {
      const timeMatch = dateTime.match(/(\d{2}):(\d{2})$/);
      if (timeMatch) {
        return `${timeMatch[1]}:${timeMatch[2]}:00`;
      }
      return "10:00:00"; // 기본값
    };

    mutate({
      generation: nextGeneration,
      documentRecruitStartDate: toLocalDateTime(documentStartDate, "00:00:00"),
      documentRecruitEndDate: toLocalDateTime(documentEndDate, "23:59:59"),
      documentAnnouncementDate: toLocalDateTime(
        documentResultDateTime.split(" ")[0].replace(/\./g, "-"),
        extractTimeFromDateTime(documentResultDateTime)
      ),
      interviewStartDate: toLocalDateTime(interviewStartDate, "09:00:00"),
      interviewEndDate: toLocalDateTime(interviewEndDate, "18:00:00"),
      lastAnnouncementDate: toLocalDateTime(
        finalResultDateTime.split(" ")[0].replace(/\./g, "-"),
        extractTimeFromDateTime(finalResultDateTime)
      ),
      accessStartDate: toLocalDateTime(homepageOpenStartDate, "00:00:00"),
      accessEndDate: toLocalDateTime(homepageOpenEndDate, "23:59:59"),
    });
  };

  return {
    isLoading,
    isPending,
    isSuccess,
    mutationData,
    data,
    nextGeneration,
    setNextGeneration,
    documentStartDate,
    setDocumentStartDate,
    documentEndDate,
    setDocumentEndDate,
    documentResultDateTime,
    setDocumentResultDateTime,
    interviewStartDate,
    setInterviewStartDate,
    interviewEndDate,
    setInterviewEndDate,
    finalResultDateTime,
    setFinalResultDateTime,
    homepageOpenStartDate,
    setHomepageOpenStartDate,
    homepageOpenEndDate,
    setHomepageOpenEndDate,
    error,
    isError,
    updateDefaultSetting,
  };
};
