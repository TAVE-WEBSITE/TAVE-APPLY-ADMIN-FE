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
import { useEffect, useState, useMemo } from "react";
import SkeletonAccordion from "@/components/Accordion/Skeleton";
import { formatKorDate, formatTimeRange } from "@/utils/formatDate";
import { fetchList } from "@/api/fetchList";

const InterviewDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, time, count } = location.state || {};
  // 시간 슬롯 배열 (예시: 09:00, 10:00, ...)
  const timeSlots = useMemo(() => [
    "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ], []);

  const goToTimeSlot = (direction: "prev" | "next") => {
    if (!time) return;
    const idx = timeSlots.indexOf(time);
    if (idx === -1) return;
    const newIdx = direction === "prev" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= timeSlots.length) return;
    navigate(`/evaluation/interview/${date}`, {
      state: { date, time: timeSlots[newIdx], count }
    });
  };
  //const { id: date } = useParams();
  const { data: applicant } = useQuery<Resume>({
    queryKey: ["setting", "interviewer"],
    queryFn: () => fetchInterviewer("1"),
  });
  const [activeLabels, setActiveLabels] = useState(new Set());
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState("파트별 질문");

  // 면접 현황 지원서 목록 데이터 패칭
  const { data: interviewData, isLoading: loadingResumeList } = useQuery({
    queryKey: ["interview-detail", date, time],
    queryFn: () => fetchList("면접 현황", { date, time }),
    enabled: Boolean(date) && Boolean(time)
  });

  // 공통 질문 데이터 추출
  const commonQuestions = interviewData?.result?.resumeList?.[0]?.common?.[0]?.commonQuestions ?? [];
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
  // 파트별 질문 데이터 추출
  const partQuestions = interviewData?.result?.resumeList?.[0]?.specific?.[0]?.specificQuestions ?? [];


  // 지원자 정보 추출
  const memberInfo = interviewData?.result?.resumeList?.[0]?.resumeMemberInfoDto;

  // 지원서 목록 추출
  const resumeList = interviewData?.result?.resumeList ?? [];
  
  // 지원자 이름 목록 추출
  const applicantNames = resumeList.map((resume: any) => resume.resumeMemberInfoDto?.username).filter(Boolean);

  // 1번 버튼이 처음부터 활성화되도록 초기값 설정
  useEffect(() => {
    if (applicantNames.length > 0 && !isInitialized) {
      const firstHalf = applicantNames.slice(0, Math.ceil(applicantNames.length / 2));
      setActiveLabels(new Set(firstHalf));
      setIsInitialized(true);
    }
  }, [applicantNames, isInitialized]);

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
          <Icon type={"ChevronDown"} size={18} className="rotate-90 cursor-pointer" onClick={() => goToTimeSlot("prev")} />
        </div>
        <FlexBox direction="col">
          <h2 className="font-bold text-xl">{date ? formatKorDate(date) : "날짜"}</h2>
          <p>{time ? formatTimeRange(time) : "시간"}</p>
        </FlexBox>
        <div className="bg-gray-800 p-2 rounded-full">
          <Icon type={"ChevronDown"} size={18} className="rotate-270 cursor-pointer" onClick={() => goToTimeSlot("next")} />
        </div>
      </FlexBox>
      <Body>
        <div className="w-[1344px] mx-auto flex flex-col gap-4">
          <p className="text-gray-500 pt-8">총 면접자 {count ?? 0}명</p>
          <FlexBox className="gap-2">
            {applicantNames.map((name: string) => (
              <label
                key={name}
               
                className={`w-[78px] h-[28px] text-sm flex items-center justify-center rounded-2xl font-semibold  ${
                  activeLabels.has(name)
                    ? "bg-blue-200 text-blue-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {name}
              </label>
            ))}
          </FlexBox>
          <FlexBox className="gap-2 mt-2">
                        <button
              onClick={() => {
                const firstHalf = applicantNames.slice(0, Math.ceil(applicantNames.length / 2));
                setActiveLabels(new Set(firstHalf));
              }}
              className={`py-2 px-4 text-sm flex items-center justify-center rounded-lg font-regular cursor-pointer ${
                activeLabels.size > 0 && 
                applicantNames.slice(0, Math.ceil(applicantNames.length / 2)).every((name: string) => activeLabels.has(name)) &&
                applicantNames.slice(Math.ceil(applicantNames.length / 2)).every((name: string) => !activeLabels.has(name))
                  ? "bg-blue-600 text-white"
                  : "bg-blue-200 text-gray-700 hover:bg-blue-300"
              }`}
            >
              1~2번째 지원자 조회
            </button>
            <button
              onClick={() => {
                const secondHalf = applicantNames.slice(Math.ceil(applicantNames.length / 2));
                setActiveLabels(new Set(secondHalf));
              }}
              className={`py-2 px-4 text-sm flex items-center justify-center rounded-lg font-regular cursor-pointer ${
                activeLabels.size > 0 && 
                applicantNames.slice(Math.ceil(applicantNames.length / 2)).every((name: string) => activeLabels.has(name)) &&
                applicantNames.slice(0, Math.ceil(applicantNames.length / 2)).every((name: string) => !activeLabels.has(name))
                  ? "bg-blue-600 text-white"
                  : "bg-blue-200 text-gray-700 hover:bg-blue-300"
              }`}
            >
              3~4번째 지원자 조회
            </button>
            <div className="text-gray-500 text-sm">버튼을 누르면 지원서가 조회됩니다!</div>
          </FlexBox>
          <div className="w-full h-px border-t border-t-gray-300 mb-8" />
        </div>
        {/* 선택된 지원자들의 지원서만 렌더링 */}
        {(() => {
          const selectedResumes = resumeList.filter((resume: any) => 
            activeLabels.has(resume.resumeMemberInfoDto?.username)
          );
          
          return Array.from({ length: Math.ceil(selectedResumes.length / 2) }).map((_, articleIdx) => (
            <article key={articleIdx} className="w-[1344px] mx-auto flex gap-4 text-gray-900 pb-12">
              {selectedResumes.slice(articleIdx * 2, articleIdx * 2 + 2).map((resume: any, idx: number) => {
                const memberInfo = resume.resumeMemberInfoDto;
                const partQuestions = resume.specific?.[0]?.specificQuestions ?? [];
                const commonQuestions = resume.common?.[0]?.commonQuestions ?? [];
                return (
                  <div key={resume.resumeId} className="flex flex-col gap-4 rounded-lg border border-gray-300 bg-white w-1/2 px-6 py-4">
                    <FlexBox className="gap-2">
                      <h2 className="font-bold text-xl">{memberInfo?.username ?? '-'}</h2>
                      <Chip title={memberInfo?.field as any ?? '-'} />
                    </FlexBox>
                    <div className="grid grid-cols-2 gap-4">
                      <FlexBox className="gap-4">
                        <label htmlFor="gender" className="text-gray-500">성별</label>
                        <p id="gender">{memberInfo?.sex ?? '-'}</p>
                      </FlexBox>
                      <FlexBox className="gap-4">
                        <label htmlFor="school" className="text-gray-500">학교</label>
                        <p id="school">{memberInfo?.univ ?? '-'}</p>
                      </FlexBox>
                      <FlexBox className="gap-4">
                        <label htmlFor="birth" className="text-gray-500">생년월일</label>
                        <p id="birth">{memberInfo?.birthday ?? '-'}</p>
                      </FlexBox>
                      <FlexBox className="gap-4">
                        <label htmlFor="major" className="text-gray-500">전공</label>
                        <p id="major">{memberInfo?.major ?? '-'}</p>
                      </FlexBox>
                    </div>
                    <Tab
                      categories={["파트별 질문", "공통 질문"]}
                      active={activeTab}
                      onChange={setActiveTab}
                      className="pt-8"
                    />
                    <FlexBox direction="col" className="gap-8 overflow-y-scroll py-6">
                      {activeTab === "공통 질문" &&
                        commonQuestions.map((q: any) => (
                          <Accordion key={q.id} title={q.question} className="w-full">
                            <TextArea
                              value={q.answer ?? "미답변"}
                              readOnly={true}
                              className="w-full h-full"
                            />
                          </Accordion>
                        ))}
                      {activeTab === "파트별 질문" &&
                        partQuestions.map((q: any, index: number) => (
                          <Accordion
                            key={q.id}
                            title={q.question}
                            className="w-full"
                          >
                            <TextArea
                              value={q.answer ?? "미답변"}
                              readOnly={true}
                              className="w-full h-full"
                            />
                          </Accordion>
                        ))}
                    </FlexBox>
                  </div>
                );
              })}
            </article>
          ));
        })()}
      </Body>
    </div>
  );
};

export default InterviewDetail;
