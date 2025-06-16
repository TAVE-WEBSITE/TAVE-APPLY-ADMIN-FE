import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
import FlexBox from "@/components/Layout/FlexBox";
import Body from "@/components/Layout/Body";
import Tab from "@/components/Tab/Tab";
import { fetchInterviewer } from "@/api/Setting/Interview";
import type { Resume } from "@/types/interview";
import SkeletonAccordion from "@/components/Accordion/Skeleton";
import Icon from "@/components/Icon/Icon";
import CommonQuestions from "@/pages/Evaluation/TabContents/CommonQuestions";
import PartQuestions from "@/pages/Evaluation/TabContents/PartQuestions";
import AnalysisTab from "@/pages/Evaluation/TabContents/AnalysisTab";
import DecisionTab from "@/pages/Evaluation/TabContents/DecisionTab";

const tabCategories = ["파트별 질문", "공통 질문"];

const application = {
  name: "홍길동",
};

const FinalDetailMock = () => {
  const id = "1";
  const { data: applicant, isLoading } = useQuery<Resume>({
    queryKey: ["evaluation", "detail"],
    queryFn: () => fetchInterviewer(id!),
  });
  const [activeLeftTab, setActiveLeftTab] = useState("공통 질문");
  const [activeRightTab, setActiveRightTab] = useState("서류 평가 분석");

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
      {" "}
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <FlexBox className="gap-2">
          <Icon
            type="ChevronDown"
            size={40}
            className="rotate-90 cursor-pointer"
            onClick={() => {}}
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
        <FlexBox className="w-2/3 justify-between">
          <Tab
            categories={tabCategories}
            active={activeLeftTab}
            onChange={setActiveLeftTab}
          />
          <Tab
            categories={["서류 평가 분석", "합격 여부 결정"]}
            active={activeRightTab}
            onChange={setActiveRightTab}
            className="mb-8"
          />
        </FlexBox>
        <div className="flex gap-4">
          <FlexBox
            direction="col"
            className="gap-8 w-1/2 h-[650px] overflow-y-scroll px-4 py-6"
          >
            {isLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <SkeletonAccordion key={index} />
              ))}

            {applicant && !isLoading && activeLeftTab === "공통 질문" && (
              <CommonQuestions applicant={applicant} />
            )}
            {applicant && !isLoading && activeLeftTab === "파트별 질문" && (
              <PartQuestions applicant={applicant} application={application} />
            )}
          </FlexBox>
          <div className="rounded-xl flex-1 rounded-xl min-h-[650px] px-6 py-5">
            <FlexBox direction="col" className="gap-8">
              {activeRightTab === "서류 평가 분석" && <AnalysisTab />}
              {activeRightTab === "합격 여부 결정" && <DecisionTab />}
            </FlexBox>
          </div>
        </div>
      </Body>
    </div>
  );
};

export default FinalDetailMock;
