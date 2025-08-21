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
import { fetchResumeQuestions, downloadPortfolio } from "./api";

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
                return (
                  <ResumeCard 
                    key={resume.resumeId} 
                    resume={resume} 
                    memberInfo={memberInfo}
                  />
                );
              })}
            </article>
          ));
        })()}
      </Body>
    </div>
  );
};

// 지원서 카드 컴포넌트
const ResumeCard = ({ resume, memberInfo }: any) => {
  const [questions, setQuestions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("파트별 질문");

  // 지원서 질문 정보 조회
  const { data: resumeQuestions, isLoading: questionsLoading } = useQuery({
    queryKey: ["resume-questions", resume.resumeId],
    queryFn: () => fetchResumeQuestions(resume.resumeId),
    enabled: !!resume.resumeId,
  });

  useEffect(() => {
    if (resumeQuestions?.result) {
      setQuestions(resumeQuestions.result);
    }
  }, [resumeQuestions]);

  const commonQuestions = questions?.commonQuestions || [];
  const partQuestions = questions?.partQuestions || [];

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-300 bg-white w-1/2 px-6 py-4">
      <FlexBox className="gap-2">
        <h2 className="font-bold text-xl">{memberInfo?.username ?? '-'}</h2>
        <Chip title={memberInfo?.field as any ?? '-'} />
      </FlexBox>
      <div className="grid grid-cols-2 gap-4">
        <FlexBox className="gap-4">
          <label htmlFor="gender" className="text-gray-500">성별</label>
          <p id="gender">{memberInfo?.sex === "MALE" ? "남자" : memberInfo?.sex === "FEMALE" ? "여자" : memberInfo?.sex ?? '-'}</p>
        </FlexBox>
        <FlexBox className="gap-4">
          <label htmlFor="school" className="text-gray-500">학교</label>
          <p id="school">{memberInfo?.univ ?? memberInfo?.school ?? '-'}</p>
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
        {activeTab === "공통 질문" && (
          <>
            {questionsLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <SkeletonAccordion key={index} />
              ))
            ) : commonQuestions.length > 0 ? (
              <>
                {commonQuestions
                  .sort((a: any, b: any) => a.id - b.id)
                  .map((q: any) => (
                    <Accordion key={q.id} title={q.question} className="w-full">
                      <TextArea
                        value={q.answer ?? "미답변"}
                        readOnly={true}
                        className="w-full h-full"
                      />
                    </Accordion>
                  ))}
                <Accordion
                  title="아래의 목록 중 소유하신 것이 있다면 자유롭게 첨부해주세요 :)"
                  className="w-full"
                >
                  <div className="space-y-4">
                    {questions?.githubUrl && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">GitHub</h4>
                        <a 
                          href={questions.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          {questions.githubUrl}
                        </a>
                      </div>
                    )}
                    {questions?.blogUrl && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">블로그</h4>
                        <a 
                          href={questions.blogUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          {questions.blogUrl}
                        </a>
                      </div>
                    )}
                    {questions?.portfolioUrl && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">포트폴리오</h4>
                        <button 
                          onClick={async () => {
                            try {
                              const blob = await downloadPortfolio(resume.resumeId);
                              
                              // 지원자 이름으로 파일명 생성
                              const applicantName = memberInfo?.username || memberInfo?.name || '지원자';
                              const fileName = `portfolio_${applicantName}.pdf`;
                              
                              // blob을 다운로드 가능한 형태로 변환
                              const blobUrl = window.URL.createObjectURL(blob);
                              const downloadLink = document.createElement('a');
                              downloadLink.href = blobUrl;
                              downloadLink.download = fileName;
                              downloadLink.style.display = 'none';
                              
                              // DOM에 추가하고 클릭
                              document.body.appendChild(downloadLink);
                              downloadLink.click();
                              
                              // 정리
                              setTimeout(() => {
                                document.body.removeChild(downloadLink);
                                window.URL.revokeObjectURL(blobUrl);
                              }, 100);
                            } catch (error: any) {
                              console.error('포트폴리오 다운로드 실패:', error);
                            }
                          }}
                          className="text-blue-600 hover:text-blue-800 underline break-all cursor-pointer bg-transparent border-none p-0"
                        >
                          포트폴리오 다운로드
                        </button>
                      </div>
                    )}
                    {!questions?.githubUrl && !questions?.blogUrl && !questions?.portfolioUrl && (
                      <p className="text-gray-500">첨부된 링크가 없습니다.</p>
                    )}
                  </div>
                </Accordion>
              </>
            ) : (
              <div className="flex flex-col justify-center items-center gap-4 p-4 text-gray-700 w-full h-full text-center">
                <Icon type="Alert" size={28} />
                <p>공통 질문이 없습니다.</p>
              </div>
            )}
          </>
        )}
        {activeTab === "파트별 질문" && (
          <>
            {questionsLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <SkeletonAccordion key={index} />
              ))
            ) : partQuestions.length > 0 ? (
              partQuestions
                .sort((a: any, b: any) => a.id - b.id)
                .map((q: any, index: number) => (
                  <Accordion
                    key={q.id}
                    title={q.question}
                    className="w-full"
                  >
                    {index === 0 && questions?.languageLevels && questions.languageLevels.length > 0 ? (
                      <div className="space-y-4">
                        {/* 언어 레벨 정보 */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">언어 레벨</h4>
                          <div className="space-y-4">
                            {questions.languageLevels.map((lang: any, langIndex: number) => (
                              <StepCounter
                                key={langIndex}
                                title={lang.language}
                                currentStep={lang.level}
                                setCurrentStep={() => {}}
                                maxStep={5}
                                stepLabels={["입문", "초급", "중급", "고급", "전문가"]}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <TextArea
                        value={q.answer ?? "미답변"}
                        readOnly={true}
                        className="w-full min-h-[250px] h-full"
                      />
                    )}
                  </Accordion>
                ))
            ) : (
              <div className="flex flex-col justify-center items-center gap-4 p-4 text-gray-700 w-full h-full text-center">
                <Icon type="Alert" size={28} />
                <p>파트별 질문이 없습니다.</p>
              </div>
            )}
          </>
        )}
      </FlexBox>
    </div>
  );
};

export default InterviewDetail;
