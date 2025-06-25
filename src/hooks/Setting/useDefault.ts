import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { SettingDefaultResponse } from "@/api/Setting/types";
import { fetchSettingDefault } from "@/api/Setting/Default";
import { postSettingDefault } from "@/api/Setting/Default";
import { formatDateOnly } from "@/utils/formatDate";

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
    setNextGeneration(data.result.generation || "");
    setDocumentStartDate(formatDateOnly(data.result.documentRecruitStartDate));
    setDocumentEndDate(formatDateOnly(data.result.documentRecruitEndDate));
    setDocumentResultDateTime(
      formatDateOnly(data.result.documentAnnouncementDate)
    );
    setInterviewStartDate(formatDateOnly(data.result.interviewStartDate));
    setInterviewEndDate(formatDateOnly(data.result.interviewEndDate));
    setFinalResultDateTime(formatDateOnly(data.result.lastAnnouncementDate));
    setHomepageOpenStartDate(formatDateOnly(data.result.accessStartDate));
    setHomepageOpenEndDate(formatDateOnly(data.result.accessEndDate));
  }, [data]);

  const updateDefaultSetting = () => {
    const toLocalDateTime = (date: string, time: string) =>
      date.replace(/\./g, "-") + "T" + time;

    mutate({
      generation: nextGeneration,
      documentRecruitStartDate: toLocalDateTime(documentStartDate, "00:00:00"),
      documentRecruitEndDate: toLocalDateTime(documentEndDate, "23:59:59"),
      documentAnnouncementDate: toLocalDateTime(
        documentResultDateTime,
        "10:00:00"
      ),
      interviewStartDate: toLocalDateTime(interviewStartDate, "09:00:00"),
      interviewEndDate: toLocalDateTime(interviewEndDate, "18:00:00"),
      lastAnnouncementDate: toLocalDateTime(finalResultDateTime, "10:00:00"),
      accessStartDate: toLocalDateTime(homepageOpenStartDate, "00:00:00"),
      accessEndDate: toLocalDateTime(homepageOpenEndDate, "23:59:59"),
    });
  };

  return {
    isLoading,
    isPending,
    isSuccess,
    mutationData,
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
