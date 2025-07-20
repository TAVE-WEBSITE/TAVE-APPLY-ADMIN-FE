import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FlexBox from "@/components/Layout/FlexBox";
import Body from "@/components/Layout/Body";
import Tab from "@/components/Tab/Tab";
import Accordion from "@/components/Accordion/Accordion";
import { fetchDocumentDetail, fetchResumeQuestions, fetchMemberInfo, fetchFinalEvaluation } from "./api";
import type { Resume, Question } from "@/types/interview";
import TextArea from "@/components/Input/TextArea";
import SkeletonAccordion from "@/components/Accordion/Skeleton";
import Icon from "@/components/Icon/Icon";
import DecisionTab from "./TabContents/DecisionTab";

const tabCategories = ["파트별 질문", "공통 질문"];

const FinalDetail = () => {
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
  
  // 지원서 질문 정보 조회
  const { data: resumeQuestions, isLoading: questionsLoading } = useQuery({
    queryKey: ["evaluation", "resume-questions", id],
    queryFn: () => {
      // application에서 resumeId를 가져와서 사용
      const resumeId = application?.resumeId;
      return fetchResumeQuestions(resumeId);
    },
    enabled: !!id && !!application?.resumeId, // id와 resumeId가 있을 때만 쿼리 실행
  });

  // 운영진 평가 조회
  const { data: finalEvaluation, isLoading: evaluationLoading } = useQuery({
    queryKey: ["evaluation", "final-evaluation", id],
    queryFn: () => {
      const resumeId = application?.resumeId;
      return fetchFinalEvaluation(resumeId);
    },
    enabled: !!id && !!application?.resumeId, // id와 resumeId가 있을 때만 쿼리 실행
  });

  const [activeLeftTab, setActiveLeftTab] = useState("공통 질문");
  const [activeRightTab, setActiveRightTab] = useState("서류 평가 분석");

  const isLoading = memberInfoLoading || questionsLoading || evaluationLoading;

  const questions = resumeQuestions?.result;
  const commonQuestions = questions?.commonQuestions || [];
  const partQuestions = questions?.partQuestions || [];

  // 지원자 기본 정보는 API에서 가져온 데이터 우선 사용, 없으면 state에서 가져오기
  const applicant = memberInfo?.result || application;

  // 운영진 평가 데이터 처리
  const evaluations = finalEvaluation?.result || [];
  const averageScore = evaluations.length > 0 
    ? (evaluations.reduce((sum: number, evaluation: any) => sum + evaluation.score, 0) / evaluations.length).toFixed(1)
    : "0.0";


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
            onClick={() => navigate("/evaluation/document/final")}
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
        <div className="flex gap-4">
          <div className="flex flex-col w-1/2">
            <Tab
              categories={tabCategories}
              active={activeLeftTab}
              onChange={setActiveLeftTab}
            />
            <FlexBox
              direction="col"
              className="gap-8 w-full h-[650px] overflow-y-scroll px-4 py-6"
            >
              {isLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonAccordion key={index} />
                ))}

              {applicant &&
                !isLoading &&
                activeLeftTab === "공통 질문" &&
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
                      className="w-full h-full"
                    />
                  </Accordion>
                ))}
              {applicant &&
                !isLoading &&
                activeLeftTab === "공통 질문" &&
                commonQuestions.length === 0 && (
                  <div className="flex flex-col justify-center items-center gap-4 p-4 text-gray-700 w-full h-full text-center">
                    <Icon type="Alert" size={28} />
                    <p>공통 질문이 없습니다.</p>
                  </div>
                )}
              {applicant &&
                !isLoading &&
                activeLeftTab === "파트별 질문" &&
                partQuestions.length > 0 &&
                partQuestions.map((q: Question, index: number) => (
                  <Accordion
                    key={q.question}
                    title={
                      index === 0 ? (application?.name || '') + q.question : q.question
                    }
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
                activeLeftTab === "파트별 질문" &&
                partQuestions.length === 0 && (
                  <div className="flex flex-col justify-center items-center gap-4 p-4 text-gray-700 w-full h-full text-center">
                    <Icon type="Alert" size={28} />
                    <p>파트별 질문이 없습니다.</p>
                  </div>
                )}
            </FlexBox>
          </div>
          <div className="flex flex-col gap-6 flex-1 rounded-xl min-h-[650px] px-6">
            <Tab
              categories={["서류 평가 분석", "합격 여부 결정"]}
              active={activeRightTab}
              onChange={setActiveRightTab}
            />
            <DecisionTab
              message="면접 전형
          결과를 선택해주세요"
              finalEvaluation={{
                averageScore,
                evaluatorCount: evaluations.length,
                evaluations
              }}
              activeTab={activeRightTab}
              resumeId={application?.resumeId}
            />
          </div>
        </div>
      </Body>
    </div>
  );
};

export default FinalDetail;
