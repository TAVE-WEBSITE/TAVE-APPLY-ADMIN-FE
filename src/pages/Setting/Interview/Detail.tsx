import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FlexBox from "@/components/Layout/FlexBox";
import Body from "@/components/Layout/Body";
import Tab from "@/components/Tab/Tab";
import Accordion from "@/components/Accordion/Accordion";
import { fetchInterviewer, postInterviewDate } from "@/api/Setting/Interview";
import type { Resume } from "@/types/interview";
import TextArea from "@/components/Input/TextArea";
import TimePicker from "@/components/DatePicker/TimePicker";
import Button from "@/components/Button/Button";
import StepCounter from "@/components/StepCounter/StepCounter";
import SkeletonAccordion from "@/components/Accordion/Skeleton";
import ToastMessage from "@/components/Modal/ToastMessage";
import Icon from "@/components/Icon/Icon";
import { formatMMDD, formatHHMin } from "@/utils/formatDate";

const tabCategories = ["파트별 질문", "공통 질문"];
// 샘플 데이터
const schedules = [
  "2025-11-20T13:00:00.96078",
  "2025-11-20T13:30:00.96078",
  "2025-11-20T14:00:00.96078",
  "2025-11-20T14:30:00.96078",
  "2025-11-20T15:00:00.96078",
  "2025-11-20T15:30:00.96078",
  "2025-11-20T16:00:00.96078",
  "2025-11-20T16:30:00.96078",
];

/** 개별 지원서 조회 페이지 */
const InterviewSettingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: applicant, isLoading } = useQuery<Resume>({
    queryKey: ["setting", "interviewer"],
    queryFn: () => fetchInterviewer(id!),
  });
  const { state } = useLocation();
  const application = state?.application;

  const [activeTab, setActiveTab] = useState("공통 질문");
  const [selectedDate, setSelectedDate] = useState("");
  const [isToastOpen, setIsToastOpen] = useState(false);

  const renderLabels = (label: string) => {
    switch (label) {
      case "성별":
        return applicant?.gender === "MALE" ? "남자" : "여자";
      case "학교":
        return applicant?.school;
      case "연락처":
        return applicant?.contact;
      case "생년월일":
        return applicant?.birthDate;
      case "전공/부전공":
        return `${applicant?.major} / ${applicant?.subMajor}`;
      case "이메일 주소":
        return applicant?.email;
        break;
      default:
        return "";
    }
  };

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
    mutate({ selectedDate });
  };

  return (
    <div className="text-white">
      {" "}
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <FlexBox className="gap-2">
          <Icon
            type="ChevronDown"
            size={40}
            className="rotate-90 cursor-pointer"
            onClick={() => navigate("/setting/interview")}
          />
          <h1 className="font-bold text-4xl">
            {applicant?.name} ({applicant?.field})
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
          <FlexBox className="gap-8">
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
            {isLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <SkeletonAccordion key={index} />
              ))}
            {applicant &&
              !isLoading &&
              activeTab === "공통 질문" &&
              applicant.commonQuestions.map((q) => (
                <Accordion
                  key={q.question}
                  title={q.question}
                  className="w-full"
                >
                  <TextArea
                    value={q.answer}
                    readOnly={true}
                    className="w-full h-full"
                  />
                </Accordion>
              ))}
            {applicant &&
              !isLoading &&
              activeTab === "파트별 질문" &&
              applicant.partQuestions.map((q, index) => (
                <Accordion
                  key={q.question}
                  title={
                    index === 0 ? application.name + q.question : q.question
                  }
                  className="w-full"
                >
                  {index === 0 ? (
                    <StepCounter
                      title="Javascript"
                      currentStep={2}
                      setCurrentStep={() => {}}
                      maxStep={5}
                      stepLabels={["입문", "초급", "중급", "고급", "전문가"]}
                    />
                  ) : (
                    <TextArea
                      value={q.answer}
                      readOnly={true}
                      className="w-full h-full"
                    />
                  )}
                </Accordion>
              ))}
          </FlexBox>
          <div className="border border-gray-300 bg-white rounded-xl flex-1 rounded-xl min-h-[650px] px-6 py-5">
            <p className="text-gray-900 font-semibold text-lg">
              면접 일자 선택
            </p>
            <p className="text-gray-500 flex items-center gap-1">
              {applicant?.name}
              님의 면접 시간을 선택해주세요
            </p>
            <FlexBox direction="col" className="gap-4">
              <div className="w-full border-t border-gray-300 mt-6"></div>
              <TimePicker>
                {Array.from({ length: 4 }, (_, index) => (
                  <TimePicker.DateRow
                    key={index}
                    date={formatMMDD(schedules[0])}
                  >
                    {schedules.map((timeSlot, index) => (
                      <TimePicker.TimeSlotButton
                        key={timeSlot + index}
                        time={formatHHMin(timeSlot)}
                        isSelected={selectedDate === formatHHMin(timeSlot)}
                        onClick={() => setSelectedDate(formatHHMin(timeSlot))}
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
