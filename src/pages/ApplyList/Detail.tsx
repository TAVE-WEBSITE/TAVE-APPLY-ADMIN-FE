import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FlexBox from "@/components/Layout/FlexBox";
import Body from "@/components/Layout/Body";
import Tab from "@/components/Tab/Tab";
import Accordion from "@/components/Accordion/Accordion";
import { fetchInterviewer } from "@/api/Setting/Interview";
import type { Resume } from "@/types/interview";
import TextArea from "@/components/Input/TextArea";
import TimePicker from "@/components/DatePicker/TimePicker";
import StepCounter from "@/components/StepCounter/StepCounter";
import SkeletonAccordion from "@/components/Accordion/Skeleton";
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
const ApplyListDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: applicant, isLoading } = useQuery<Resume>({
    queryKey: ["setting", "interviewer"],
    queryFn: () => fetchInterviewer(id!),
  });
  const { state } = useLocation();
  const application = state?.application;

  const [activeTab, setActiveTab] = useState("공통 질문");

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

  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <FlexBox className="gap-2">
          <Icon
            type="ChevronDown"
            size={40}
            className="rotate-90 cursor-pointer"
            onClick={() => navigate("/applies")}
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
          <FlexBox key={label} className="gap-8">
            <label className="text-gray-400">{label}</label>
            <span>{renderLabels(label)}</span>
          </FlexBox>
        ))}
      </div>
      <Body className="py-8 px-12">
        <div className="w-[1000px] mx-auto">
          <Tab
            categories={tabCategories}
            active={activeTab}
            onChange={setActiveTab}
          />
          <div className="flex flex-col gap-4">
            <FlexBox direction="col" className="gap-8 overflow-y-scroll py-6">
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
            <div className="border border-gray-300 bg-white rounded-xl px-6 py-5">
              <p className="text-gray-900 font-semibold text-lg">
                가능한 오프라인 면접 시간
              </p>
              <FlexBox direction="col" className="gap-4">
                <div className="w-full border-t border-gray-300 mt-6"></div>
                <TimePicker>
                  {Array.from({ length: 2 }, (_, index) => (
                    <TimePicker.DateRow
                      key={index}
                      date={formatMMDD(schedules[0])}
                    >
                      {schedules.map((timeSlot, index) => (
                        <TimePicker.TimeSlotButton
                          key={timeSlot + index}
                          time={formatHHMin(timeSlot)}
                          isSelected={true}
                          disabled={true}
                        />
                      ))}
                    </TimePicker.DateRow>
                  ))}
                </TimePicker>
              </FlexBox>
            </div>
          </div>
        </div>
      </Body>
    </div>
  );
};

export default ApplyListDetail;
