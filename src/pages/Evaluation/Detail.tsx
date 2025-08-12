import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FlexBox from "@/components/Layout/FlexBox";
import Body from "@/components/Layout/Body";
import Tab from "@/components/Tab/Tab";
import Accordion from "@/components/Accordion/Accordion";
import { fetchDocumentDetail, getDocumentDetail, fetchResumeQuestions, fetchMemberInfo } from "./api";
import type { Resume, Question } from "@/types/interview";
import TextArea from "@/components/Input/TextArea";
import StepCounter from "@/components/StepCounter/StepCounter";
import SkeletonAccordion from "@/components/Accordion/Skeleton";
import ToastMessage from "@/components/Modal/ToastMessage";
import Icon from "@/components/Icon/Icon";
import Input from "@/components/Input/Input";
import { postApplication } from "@/pages/Evaluation/api";
import Button from "@/components/Button/Button";

const tabCategories = ["파트별 질문", "공통 질문"];

/** 개별 지원서 조회 페이지 */
const Detail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const application = state?.application;
  
  // 지원자 정보 조회
  const { data: memberInfo, isLoading: memberInfoLoading } = useQuery({
    queryKey: ["evaluation", "member-info", id],
    queryFn: () => fetchMemberInfo(id || "1"),
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
  
  // 지원서 질문 정보 조회만 유지
  const { data: resumeQuestions, isLoading: questionsLoading } = useQuery({
    queryKey: ["evaluation", "resume-questions", id],
    queryFn: () => {
      // application에서 resumeId를 가져와서 사용
      const resumeId = application?.resumeId ;
      return fetchResumeQuestions(resumeId);
    },
    enabled: !!id && !!application?.resumeId, // id와 resumeId가 있을 때만 쿼리 실행
  });

  // 기존 평가 데이터 조회
  const { data: existingEvaluation, isLoading: evaluationLoading } = useQuery({
    queryKey: ["evaluation", "existing", application?.resumeId],
    queryFn: () => {
      const resumeId = application?.resumeId;
      return getDocumentDetail(resumeId);
    },
    enabled: !!application?.resumeId, // resumeId가 있을 때만 쿼리 실행
  });

  const [activeTab, setActiveTab] = useState("공통 질문");
  const [postMessage, setPostMessage] = useState("");
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [isScoreError, setIsScoreError] = useState(false);

  const [score, setScore] = useState("");
  const [opinion, setOpinion] = useState("");

  const isLoading = memberInfoLoading || questionsLoading || evaluationLoading;


  // 기존 평가 데이터가 있으면 input에 설정
  useEffect(() => {
    if (existingEvaluation?.result) {
      
      const { score: existingScore, opinion: existingOpinion } = existingEvaluation.result;
      if (existingScore !== undefined) {
        setScore(existingScore.toString());
      }
      if (existingOpinion) {
        setOpinion(existingOpinion);
      }
    }
  }, [existingEvaluation]);

  const questions = resumeQuestions?.result;
  const commonQuestions = questions?.commonQuestions || [];
  const partQuestions = questions?.partQuestions || [];

  // 지원자 기본 정보는 API에서 가져온 데이터 우선 사용, 없으면 state에서 가져오기
  const applicant = memberInfo?.result || application;

  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["evaluation", "detail"],
    mutationFn: () => {
      // score를 0.0 형식으로 변환
      const numericScore = parseFloat(score) || 0.0;
      const requestBody = {
        score: numericScore,
        opinion: opinion
      };
      return fetchDocumentDetail(application?.resumeId || id!, requestBody);
    },
    onSuccess: (response) => {
      const applicantName = applicant?.name || applicant?.username || "지원자";
      setPostMessage(`${applicantName}님의 서류 평가가 완료되었습니다`);
      setIsToastOpen(true);
      
      // 2초 후 서류 평가 페이지로 리다이렉트
      setTimeout(() => {
        navigate("/evaluation/document");
      }, 2000);
    },
    onError: (error: any) => {
      setPostMessage(error.response?.data?.message || "평가 제출에 실패했습니다.");
      setIsToastOpen(true);
    },
  });

  const renderLabels = (label: string) => {
    switch (label) {
      case "성별":
        return applicant?.sex === "MALE" ? "남자" : "여자";
      case "학교":
        return applicant?.school;
      case "연락처":
        return applicant?.phoneNumber;
      case "생년월일":
        return applicant?.birthday;
      case "전공/부전공":
        const major = applicant?.major;
        const minor = applicant?.minor;
        return minor ? `${major} / ${minor}` : major;
      case "이메일 주소":
        return applicant?.email;
        break;
      default:
        return "";
    }
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
            onClick={() => navigate("/evaluation/document")}
          />
          <h1 className="font-bold text-4xl">
            {applicant?.username} ({applicant?.field})
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
            {isLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <SkeletonAccordion key={index} />
              ))}
            {applicant &&
              !isLoading &&
              activeTab === "공통 질문" &&
              commonQuestions.length > 0 &&
              commonQuestions.map((q: Question) => (
                <Accordion
                  key={q.question}
                  title={q.question}
                  className="w-full"
                >
                  <TextArea
                    value={q.answer}
                    readOnly={true}
                    className="w-full min-h-[120px]"
                  />
                </Accordion>
              ))}
            {applicant &&
              !isLoading &&
              activeTab === "공통 질문" && (
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
                          onClick={() => {
                            const url = questions.portfolioUrl;
                            // S3 URL에서 파일명 추출 (UUID 형식)
                            const fileName = url.split('/').pop() || 'portfolio.pdf';
                            
                            // fetch로 파일을 가져와서 강제 다운로드
                            fetch(url, {
                              method: 'GET',
                              headers: {
                                'Accept': 'application/pdf',
                              },
                            })
                              .then(response => {
                                if (!response.ok) throw new Error('Network response was not ok');
                                return response.blob();
                              })
                              .then(blob => {
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
                              })
                              .catch(error => {
                                console.error('다운로드 실패:', error);
                                // fallback: 새 창에서 다운로드 시도
                                const newWindow = window.open(url, '_blank');
                                if (newWindow) {
                                  newWindow.document.write(`
                                    <html>
                                      <head><title>다운로드 중...</title></head>
                                      <body>
                                        <p>파일이 다운로드되지 않았습니다. 
                                        <a href="${url}" download="${fileName}">여기를 클릭하여 다운로드</a></p>
                                      </body>
                                    </html>
                                  `);
                                }
                              });
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
              )}
              {}
            {applicant &&
              !isLoading &&
              activeTab === "공통 질문" &&
              commonQuestions.length === 0 && (
                <div className="flex flex-col justify-center items-center gap-4 p-4 text-gray-700 w-full h-full text-center">
                  <Icon type="Alert" size={28} />
                  <p>공통 질문이 없습니다.</p>
                </div>
              )}
            {applicant &&
              !isLoading &&
              activeTab === "파트별 질문" &&
              partQuestions.length > 0 &&
              partQuestions.map((q: Question, index: number) => (
                <Accordion
                  key={q.question}
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
                      value={q.answer}
                      readOnly={true}
                      className="w-full min-h-[250px] h-full"
                    />
                  )}
                </Accordion>
              ))}
            {applicant &&
              !isLoading &&
              activeTab === "파트별 질문" &&
              partQuestions.length === 0 && (
                <div className="flex flex-col justify-center items-center gap-4 p-4 text-gray-700 w-full h-full text-center">
                  <Icon type="Alert" size={28} />
                  <p>파트별 질문이 없습니다.</p>
                </div>
              )}
          </FlexBox>
          <div className="border border-gray-300 bg-white flex-1 rounded-xl min-h-[650px] px-6 py-5">
            <p className="text-gray-900 font-semibold text-lg">서류 평가</p>
            <FlexBox direction="col" className="gap-8">
              <div className="w-full border-t border-gray-300 mt-6"></div>
              <div
                className={`flex items-start gap-4 text-gray-900 font-semibold w-full mb-2`}
              >
                <div className="bg-gray-200 py-2 px-4 rounded-full text-gray-400">
                  1
                </div>
                <FlexBox direction="col" className="w-full items-start">
                  <div className="flex flex-col items-start gap-4 w-full">
                    <label>
                      <span className="text-blue-500">{sessionStorage.getItem("username") || "사용자"}</span>님의 점수를{" "}
                      <span className="text-blue-500">10점 만점</span>으로
                      입력해주세요
                    </label>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="점수를 입력해주세요"
                      value={score}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value > 10) {
                          setPostMessage("10점이하로 평가해주세요");
                          setIsToastOpen(true);
                          setIsScoreError(true);
                          return;
                        }
                        setScore(e.target.value);
                        setIsScoreError(false);
                      }}
                    />
                  </div>
                </FlexBox>
              </div>

              <div
                className={`flex items-start gap-4 text-gray-900 font-semibold w-full mb-2`}
              >
                <div className="bg-gray-200 py-2 px-4 rounded-full text-gray-400">
                  2
                </div>
                <FlexBox direction="col" className="w-full items-start">
                  <div className="flex flex-col items-start gap-4 w-full">
                    <label>
                      <span className="text-blue-500">
                        점수를 뒷받침하는 의견을
                      </span>{" "}
                      간략하게 작성해주세요
                    </label>

                    <TextArea
                      className="w-full h-36"
                      maxLength={100}
                      placeholder="100자 이내로 입력해주세요"
                      value={opinion}
                      onChange={(e) => setOpinion(e.target.value)}
                    />
                  </div>
                </FlexBox>
              </div>
              <Button
                isPending={isPending}
                onClick={() => mutate()}
                className="w-24"
              >
                평가 제출
              </Button>
            </FlexBox>
          </div>
        </div>
        <ToastMessage
          isOpen={isToastOpen}
          message={postMessage}
          setIsOpen={setIsToastOpen}
          isError={isError || isScoreError}
        />
      </Body>
    </div>
  );
};

export default Detail;
