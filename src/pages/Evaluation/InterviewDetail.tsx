import { useNavigate, useLocation } from "react-router-dom";
import FlexBox from "@/components/Layout/FlexBox";
import Icon from "@/components/Icon/Icon";
import Body from "@/components/Layout/Body";
import Chip from "@/components/Chip/Chip";
import Tab from "@/components/Tab/Tab";
import StepCounter from "@/components/StepCounter/StepCounter";
import { fetchInterviewer } from "@/pages/Setting/api/Interview";
import { useQuery } from "@tanstack/react-query";
import TextArea from "@/components/Input/TextArea";
import Accordion from "@/components/Accordion/Accordion";
import type { Resume } from "@/types/interview";
import { useEffect, useState } from "react";
import SkeletonAccordion from "@/components/Accordion/Skeleton";
import { formatKorDate, formatTimeRange } from "@/utils/formatDate";
import { fetchList } from "@/api/fetchList";

const InterviewDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, time, count } = location.state || {};
  //const { id: date } = useParams();
  const { data: applicant, isLoading } = useQuery<Resume>({
    queryKey: ["setting", "interviewer"],
    queryFn: () => fetchInterviewer("1"),
  });
  const [activeLabels, setActiveLabels] = useState(new Set());
  const [activeTab, setActiveTab] = useState("파트별 질문");

  // 면접 현황 지원서 목록 데이터 패칭
  const { data: interviewData, isLoading: loadingResumeList } = useQuery({
    queryKey: ["interview-detail", date, time],
    queryFn: () => fetchList("면접 현황", { date, time }),
    enabled: Boolean(date) && Boolean(time)
  });

  // 콘솔에 데이터 출력
  if (interviewData) {
    console.log("면접 현황 상세 데이터:", interviewData);
  }
  useEffect(() => {
    console.log("질문 유형", activeTab);
  }, [activeTab]);

  // 공통 질문 데이터 추출
  const commonQuestions = interviewData?.result?.resumeList?.[0]?.common?.[0]?.commonQuestions ?? [];
  console.log("공통 질문 데이터:", commonQuestions);
  const handleActiveNames = (name: string) => {
    setActiveLabels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 items-start">
        <FlexBox className="gap-2">
          <Icon
            type="ChevronDown"
            size={40}
            className="rotate-90 cursor-pointer"
            onClick={() => navigate("/evaluation/interview")}
          />
          <h1 className="font-bold text-2xl">면접 현황</h1>
        </FlexBox>
      </FlexBox>
      <FlexBox className="justify-center gap-4 pb-8">
        <div className="bg-gray-800 p-2 rounded-full">
          <Icon type={"ChevronDown"} size={18} className="rotate-90" />
        </div>
        <FlexBox direction="col">
          <h2 className="font-bold text-xl">{date ? formatKorDate(date) : "날짜"}</h2>
          <p>{time ? formatTimeRange(time) : "시간"}</p>
        </FlexBox>
        <div className="bg-gray-800 p-2 rounded-full">
          <Icon type={"ChevronDown"} size={18} className="rotate-270" />
        </div>
      </FlexBox>
      <Body>
        <div className="w-[1344px] mx-auto flex flex-col gap-4">
          <p className="text-gray-500 pt-8">총 면접자 {count ?? 0}명</p>
          <FlexBox className="gap-2">
            <label
              onClick={() => handleActiveNames("장진영")}
              className={`w-[78px] h-[28px] text-sm flex items-center justify-center rounded-2xl font-semibold cursor-pointer ${
                activeLabels.has("장진영")
                  ? "bg-blue-200 text-blue-700"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              장진영
            </label>
            <label
              onClick={() => handleActiveNames("심우선")}
              className={`w-[78px] h-[28px] text-sm flex items-center justify-center rounded-2xl font-semibold cursor-pointer ${
                activeLabels.has("심우선")
                  ? "bg-blue-200 text-blue-700"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              심우선
            </label>
            <label
              onClick={() => handleActiveNames("양현지")}
              className={`w-[78px] h-[28px] text-sm flex items-center justify-center rounded-2xl font-semibold cursor-pointer ${
                activeLabels.has("양현지")
                  ? "bg-blue-200 text-blue-700"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              양현지
            </label>
            <label
              onClick={() => handleActiveNames("서현빈")}
              className={`w-[78px] h-[28px] text-sm flex items-center justify-center rounded-2xl font-semibold cursor-pointer ${
                activeLabels.has("서현빈")
                  ? "bg-blue-200 text-blue-700"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              서현빈
            </label>
          </FlexBox>
          <div className="w-full h-px border-t border-t-gray-300 mb-8" />
        </div>
        <article className="w-[1344px] mx-auto flex gap-4 text-gray-900 pb-12">
          {Array.from({ length: 2 }, () => (
            <div className="flex flex-col gap-4 rounded-lg border border-gray-300 bg-white w-1/2 px-6 py-4">
              <FlexBox className="gap-2">
                <h2 className="font-bold text-xl">장진영</h2>
                <Chip title="웹 프론트" />
              </FlexBox>
              <div className="grid grid-cols-2 gap-4">
                <FlexBox className="gap-4">
                  <label htmlFor="gender" className="text-gray-500">
                    성별
                  </label>
                  <p id="gender">여자</p>
                </FlexBox>
                <FlexBox className="gap-4">
                  <label htmlFor="school" className="text-gray-500">
                    학교
                  </label>
                  <p id="school">홍익대학교</p>
                </FlexBox>
                <FlexBox className="gap-4">
                  <label htmlFor="birth" className="text-gray-500">
                    생년월일
                  </label>
                  <p id="gender">2000.05.19</p>
                </FlexBox>
                <FlexBox className="gap-4">
                  <label htmlFor="major" className="text-gray-500">
                    전공
                  </label>
                  <p id="major">컴퓨터공학과, 통계학과</p>
                </FlexBox>
              </div>
              <Tab
                categories={["파트별 질문", "공통 질문"]}
                active={activeTab}
                onChange={setActiveTab}
                className="pt-8"
              />
              <FlexBox direction="col" className="gap-8 overflow-y-scroll py-6">
                {isLoading &&
                  Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonAccordion key={index} />
                  ))}
                  // 지원자 정보 API 수정 후 연결
                  //
                {applicant &&
                  !isLoading &&
                  activeTab === "공통 질문" &&
                  commonQuestions.map((q: any, idx: number) => (
                    <Accordion key={q.id ?? idx} title={q.question} className="w-full">
                      <TextArea
                        value={q.answer ?? "미답변"}
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
                        index === 0 ? applicant.name + q.question : q.question
                      }
                      className="w-full"
                    >
                      {index === 0 ? (
                        <StepCounter
                          title="Javascript"
                          currentStep={2}
                          setCurrentStep={() => {}}
                          maxStep={5}
                          stepLabels={[
                            "입문",
                            "초급",
                            "중급",
                            "고급",
                            "전문가",
                          ]}
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
            </div>
          ))}
        </article>
      </Body>
    </div>
  );
};

export default InterviewDetail;
