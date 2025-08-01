import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FlexBox from "@/components/Layout/FlexBox";
import Body from "@/components/Layout/Body";
import Tab from "@/components/Tab/Tab";
import Accordion from "@/components/Accordion/Accordion";
import { fetchMemberInfo, fetchResumeQuestions } from "@/pages/Evaluation/api";
import { postInterviewDate } from "@/pages/Setting/api/Interview";
import { axiosInstance } from "@/api/axiosInstance";
import type { Resume } from "@/types/interview";
import TextArea from "@/components/Input/TextArea";
import TimePicker from "@/components/DatePicker/TimePicker";
import Button from "@/components/Button/Button";
import ToastMessage from "@/components/Modal/ToastMessage";
import Icon from "@/components/Icon/Icon";
import { formatMMDD, formatHHMin } from "@/utils/formatDate";

// 이 페이지에서만 사용할 날짜 포맷 함수 (요일 포함, 괄호 없음)
const formatDateWithDay = (isoString: string) => {
  const date = new Date(isoString);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const day = dayNames[date.getDay()];
  return `${mm}.${dd} ${day}`;
};
import { useMutation } from "@tanstack/react-query";

const tabCategories = ["파트별 질문", "공통 질문"];

/** 개별 지원서 조회 페이지 */
const InterviewSettingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const application = state?.application;

  // 지원자 정보 조회
  const { data: memberInfo, isLoading: memberInfoLoading } = useQuery({
    queryKey: ["member-info", application?.memberId],
    queryFn: () => fetchMemberInfo(application?.memberId?.toString() || ""),
    enabled: !!application?.memberId,
  });

  // 지원서 질문 정보 조회
  const { data: resumeQuestions, isLoading: questionsLoading } = useQuery({
    queryKey: ["resume-questions", application?.resumeId],
    queryFn: () => fetchResumeQuestions(application?.resumeId?.toString() || ""),
    enabled: !!application?.resumeId,
  });

  const [activeTab, setActiveTab] = useState("공통 질문");
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [isToastOpen, setIsToastOpen] = useState(false);

  // 전체 면접 날짜+시간 조회
  const { data: interviewTimeConfig, isLoading: interviewTimeLoading } = useQuery({
    queryKey: ["interview-time-config"],
    queryFn: async () => {
      const res = await axiosInstance.get("/v1/member/config/interview-time");
      return res.data;
    },
  });

  // 면접 일자 선택을 위한 데이터 - API에서 가져온 데이터 사용
  const schedules = useMemo(() => {
    if (!interviewTimeConfig?.result) return [];
    
    return interviewTimeConfig.result.map((item: any) => item.time);
  }, [interviewTimeConfig]);

  // 날짜별로 그룹화된 시간 데이터
  const groupedSchedules = useMemo(() => {
    if (!schedules.length) return [];
    
    const grouped: Record<string, string[]> = {};
    
    schedules.forEach((timeStr: string) => {
      const date = new Date(timeStr);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(timeStr);
    });
    
    return Object.entries(grouped).map(([date, times]) => ({
      date,
      times: times.sort() // 시간순 정렬
    }));
  }, [schedules]);

  // 면접 일자 업데이트 mutation
  const {
    mutate,
    data: postInterviewDataResult,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["setting", "interviewData"],
    mutationFn: (date: { selectedDate: string }) => postInterviewDate(date),
    onSuccess: () => {
      setIsToastOpen(true);
    },
    onError: () => {
      setIsToastOpen(true);
    },
  });

  const handleUpdateInterviewData = () => {
    mutate({ selectedDate: selectedDateTime });
  };

  // 지원자 기본 정보는 API에서 가져온 데이터 우선 사용, 없으면 state에서 가져오기
  const applicant = memberInfo?.result || application;
  const questions = resumeQuestions?.result;
  const commonQuestions = questions?.commonQuestions || [];
  const partQuestions = questions?.partQuestions || [];

  const renderLabels = (label: string) => {
    switch (label) {
      case "성별":
        return applicant?.sex === "MALE" || applicant?.sex === "남자" ? "남자" : "여자";
      case "학교":
        return applicant?.university || applicant?.school || "";
      case "연락처":
        return applicant?.phoneNumber || "";
      case "생년월일":
        return applicant?.birthday || "";
      case "전공/부전공":
        const major = applicant?.major || "";
        const minor = applicant?.minor || "";
        return minor ? `${major} / ${minor}` : major;
      case "이메일 주소":
        return applicant?.email || "";
      default:
        return "";
    }
  };

  const isLoading = memberInfoLoading || questionsLoading || interviewTimeLoading;
  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <FlexBox className="gap-2">
          <Icon
            type="ChevronDown"
            size={40}
            className="rotate-90 cursor-pointer"
            onClick={() => navigate("/setting/interview")}
          />
          <h1 className="font-bold text-4xl">
            {applicant?.username || applicant?.name} ({applicant?.field || applicant?.fieldType})
          </h1>
        </FlexBox>
      </FlexBox>
      <div className="px-16 pb-8 grid grid-cols-3 gap-4">
        {[
          "성별",
          "학교",
          "연락처",
          "생년월일",
          "전공/부전공",
          "이메일 주소",
        ].map((label) => (
          <FlexBox key={label} className="gap-8">
            <label className="text-gray-400">{label}</label>
            <span>{renderLabels(label)}</span>
          </FlexBox>
        ))}
      </div>
      <Body className="py-8 px-12">
        <Tab
          categories={tabCategories}
          active={activeTab}
          onChange={setActiveTab}
        />
        <div className="flex gap-4">
          <FlexBox
            direction="col"
            className="gap-8 w-1/2 h-[650px] overflow-y-scroll px-4 py-6"
          >
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">로딩 중...</div>
              </div>
            )}
            {!isLoading && activeTab === "공통 질문" && (
              <div>
                {commonQuestions.length > 0 ? (
                  commonQuestions.map((q: any, index: number) => (
                    <Accordion key={index} title={q.question} className="mb-2">
                  <TextArea
                        value={q.answer || "답변이 없습니다."}
                    readOnly={true}
                        className="w-full"
                  />
                </Accordion>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    공통 질문이 없습니다.
                  </div>
                )}
              </div>
            )}
            {!isLoading && activeTab === "파트별 질문" && (
              <div>
                {partQuestions.length > 0 ? (
                  partQuestions.map((q: any, index: number) => (
                    <Accordion key={index} title={q.question} className="mb-2">
                    <TextArea
                        value={q.answer || "답변이 없습니다."}
                      readOnly={true}
                        className="w-full"
                    />
                </Accordion>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    파트별 질문이 없습니다.
                  </div>
                )}
              </div>
            )}
          </FlexBox>
          <div className="border border-gray-300 bg-white rounded-xl flex-1 rounded-xl min-h-[650px] px-6 py-5">
            <p className="text-gray-900 font-semibold text-lg">
              면접 일자 정보
            </p>
            <p className="text-gray-500 flex items-center gap-1">
              {applicant?.username || applicant?.name}님의 면접 시간을 선택해주세요
            </p>
            <FlexBox direction="col" className="gap-4">
              <div className="w-full border-t border-gray-300 mt-6"></div>
              <TimePicker>
                {groupedSchedules.map((group, index) => (
                  <TimePicker.DateRow
                    key={group.date}
                    date={formatDateWithDay(group.date)}
                  >
                    {group.times.map((timeSlot: string, timeIndex: number) => (
                      <TimePicker.TimeSlotButton
                        key={timeSlot + timeIndex}
                        time={formatHHMin(timeSlot)}
                        isSelected={selectedDateTime === timeSlot}
                        onClick={() => setSelectedDateTime(timeSlot)}
                      />
                    ))}
                  </TimePicker.DateRow>
                ))}
              </TimePicker>
              <Button isPending={isPending} onClick={handleUpdateInterviewData}>
                완료
              </Button>
              {postInterviewDataResult && (
                <ToastMessage
                  message={postInterviewDataResult.message}
                  isOpen={isToastOpen}
                  isError={isError}
                  setIsOpen={setIsToastOpen}
                />
              )}
            </FlexBox>
          </div>
        </div>
      </Body>
    </div>
  );
};

export default InterviewSettingDetail;
