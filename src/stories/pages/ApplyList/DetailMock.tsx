import { useState } from "react";
import FlexBox from "@/components/Layout/FlexBox";
import Body from "@/components/Layout/Body";
import Tab from "@/components/Tab/Tab";
import Accordion from "@/components/Accordion/Accordion";
import TextArea from "@/components/Input/TextArea";
import TimePicker from "@/components/DatePicker/TimePicker";
import StepCounter from "@/components/StepCounter/StepCounter";
import Icon from "@/components/Icon/Icon";
import { formatMMDD, formatHHMin } from "@/utils/formatDate";

const mockApplicant = {
  id: "1",
  name: "홍길동",
  fieldType: "웹 프론트",
  sex: "MALE",
  school: "서울대학교",
  contact: "010-1234-5678",
  birthDate: "1998-01-01",
  major: "컴퓨터공학",
  subMajor: "경영학",
  email: "hong@example.com",
  commonQuestions: [
    {
      question: "지원 동기가 무엇인가요?",
      answer:
        "새로운 도전을 위해 지원하게 되었습니다. TAVE에서 제공하는 다양한 학습 기회와 프로젝트 경험을 통해 성장하고 싶습니다.",
    },
    {
      question: "본인의 장점은 무엇인가요?",
      answer:
        "문제 해결 능력이 뛰어나다고 생각합니다. 어려운 상황에서도 긍정적인 마인드로 해결책을 찾아내는 것이 저의 강점입니다.",
    },
  ],
  partQuestions: [
    {
      question: "의 기술 수준을 선택해주세요",
      answer: "",
    },
    {
      question: "프론트엔드 개발 경험을 설명해주세요",
      answer:
        "React를 사용하여 여러 프로젝트를 진행했습니다. 특히 상태 관리와 컴포넌트 설계에 중점을 두고 개발해왔습니다.",
    },
  ],
};

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
const ApplyListDetailMock = () => {
  const [activeTab, setActiveTab] = useState("공통 질문");

  const renderLabels = (label: string) => {
    switch (label) {
      case "성별":
        return "남자";
      case "학교":
        return "서울대학교";
      case "연락처":
        return "010-1234-5678";
      case "생년월일":
        return "2025-01-01";
      case "전공/부전공":
        return `컴퓨터공학과 / 경영학과`;
      case "이메일 주소":
        return "tave@gmail.com";
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
          />
          <h1 className="font-bold text-4xl">홍길동 (백엔드)</h1>
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
              {activeTab === "공통 질문" &&
                mockApplicant.commonQuestions.map((q) => (
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
              {activeTab === "파트별 질문" &&
                mockApplicant.partQuestions.map((q: any, index: number) => (
                  <Accordion
                    key={q.question}
                    title={
                      index === 0
                        ? mockApplicant?.name + q.question
                        : q.question
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

export default ApplyListDetailMock;
