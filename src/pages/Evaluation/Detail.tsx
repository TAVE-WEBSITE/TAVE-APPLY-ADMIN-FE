import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FlexBox from "@/components/Layout/FlexBox";
import Body from "@/components/Layout/Body";
import Tab from "@/components/Tab/Tab";
import Accordion from "@/components/Accordion/Accordion";
import { fetchInterviewer } from "@/api/Setting/Interview";
import type { Resume } from "@/types/interview";
import TextArea from "@/components/Input/TextArea";
import StepCounter from "@/components/StepCounter/StepCounter";
import SkeletonAccordion from "@/components/Accordion/Skeleton";
import ToastMessage from "@/components/Modal/ToastMessage";
import Icon from "@/components/Icon/Icon";
import Input from "@/components/Input/Input";
import { postApplication } from "@/api/Evaluation";
import Button from "@/components/Button/Button";

const tabCategories = ["파트별 질문", "공통 질문"];

/** 개별 지원서 조회 페이지 */
const Detail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: applicant, isLoading } = useQuery<Resume>({
    queryKey: ["evaluation", "detail"],
    queryFn: () => fetchInterviewer(id!),
  });
  const { state } = useLocation();
  const application = state?.application;
  const [activeTab, setActiveTab] = useState("공통 질문");
  const [postMessage, setPostMessage] = useState("");
  const [isToastOpen, setIsToastOpen] = useState(false);

  const [score, setScore] = useState("");
  const [opinion, setOpinion] = useState("");

  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["evaluation", "detail"],
    mutationFn: () => postApplication(id!, { score, opinion }),
    onSuccess: (response) => {
      setPostMessage(response.message);
      setIsToastOpen(true);
    },
    onError: (response) => {
      setPostMessage(response.message);
      setIsToastOpen(true);
    },
  });

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
            onClick={() => navigate("/evaluation/document")}
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
                      <span className="text-blue-500">장진영</span>님의 점수를{" "}
                      <span className="text-blue-500">10점 만점</span>으로
                      입력해주세요
                    </label>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="점수를 입력해주세요"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
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
                      maxLength={50}
                      placeholder="50자 이내로 입력해주세요"
                      value={opinion}
                      onChange={(e) => setOpinion(e.target.value)}
                    />
                  </div>
                </FlexBox>
              </div>
              <Button
                isPending={isPending}
                onClick={() => mutate()}
                className="w-[100px]"
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
          isError={isError}
        />
      </Body>
    </div>
  );
};

export default Detail;
