import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button/Button";
import FlexBox from "@/components/Layout/FlexBox";
import ToastMessage from "@/components/Modal/ToastMessage";
import { submitFinalEvaluation } from "../api";
import { useFinalInterviewEvaluation } from "../api/hooks";

interface DecisionTabProps {
  message: string;
  finalEvaluation?: any; // 운영진 평가 데이터
  activeTab: string; // 현재 활성 탭
  resumeId?: string; // resumeId
  userName?:string;
  type:"document" | "interview";
}

const DecisionTab = ({ message, finalEvaluation, activeTab, resumeId, userName,type }: DecisionTabProps) => {
  const navigate = useNavigate();
  const [isPassed, setIsPassed] = useState<boolean | null>(null);
  const isDisabled = typeof isPassed !== "boolean";
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [postMessage, setPostMessage] = useState("");

  // 면접 평가 데이터 콘솔 출력
  useEffect(() => {
  }, [type, resumeId, userName, finalEvaluation, activeTab]);

  //최종 서류 평가?
  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["final-evaluation", "submit"],
    mutationFn: (status: "PASS" | "FAIL") => {
      if (!resumeId) {
        throw new Error("resumeId가 없습니다.");
      }

      return submitFinalEvaluation(resumeId, status);
    },
    onSuccess: (response) => {
      setPostMessage(response.message || "최종 평가가 성공적으로 제출되었습니다.");
      setIsToastOpen(true);
      
      setTimeout(() => {
        navigate("/evaluation/document/final");
      }, 1000);
    },
    onError: (error: any) => {
      console.log("에러 객체:", error);
      console.log("에러 메시지:", error.response?.data?.message);
      setPostMessage(error.response?.data?.message || "최종 평가 제출에 실패했습니다.");
      setIsToastOpen(true);
    },
  });

  const postDecision = async () => {
    if (isPassed === null) return;
    
    const status = isPassed ? "PASS" : "FAIL";
    console.log("서류 평가 제출 - status:", status);
    mutate(status);
  };

  //최종 면접 평가
  const {
    interviewFinalMutate,
    isInterviewFinalPending,
    isInterviewFinalError,
    interviewFinalPostMessage,
    isInterviewFinalToastOpen,
    setIsInterviewFinalToastOpen,
  } = useFinalInterviewEvaluation(resumeId);

  const postInterviewDecision = () => {
    if (isPassed === null) return;
    const status = isPassed ? "FINAL_PASS" : "FINAL_FAIL";
    console.log("면접 평가 제출 - status:", status);
    console.log("면접 평가 제출 - resumeId:", resumeId);
    interviewFinalMutate(status);
  };

  return (
    <FlexBox direction="col" className="gap-4 text-gray-900 w-full">
      {activeTab === "서류 평가 분석" && (
        <div className="w-full flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <div className="px-3 py-1 bg-gray-200 rounded-md flex items-center justify-center font-bold text-xl text-gray-500">1</div>
            <div className="w-full"><span className="font-bold text-blue-700">{userName}</span>님의 점수를 <span className="font-bold text-blue-700">10점 만점</span>으로 입력해주세요</div>
          </div>
       
        <div className="w-full border border-gray-300 rounded-lg font-normal bg-blue-50 p-4">
          <div className="border-b border-blue-200 p-4 flex items-center gap-1">
            최종 평점: <span className="text-blue-700 font-bold">
              {finalEvaluation?.averageScore || "0.0"}점
            </span>
            <span className="text-gray-500">({finalEvaluation?.evaluatorCount || 0}명)</span>
          </div>
         
          
          {/* 개별 점수*/}
         
          {finalEvaluation?.evaluations && finalEvaluation.evaluations.length > 0 && (
            <div className="w-full p-4">
              <div className="space-y-3">
                {finalEvaluation.evaluations.map((evaluation: any, index: number) => (
                    <div key={index} className="grid grid-cols-2 gap-4 items-center mb-1 font-medium text-gray-700">
                      <div className="flex gap-2">
                        <span className="">{evaluation.username}:</span>
                        <span className="">{evaluation.score}점</span>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          
        </div>
        <div className="flex gap-4 items-center mt-4">
            <div className="px-3 py-1 bg-gray-200 rounded-md flex items-center justify-center font-bold text-xl text-gray-500">2</div>
            <div className="w-full"><span className="text-blue-700">점수를 뒷받침하는 의견</span>을 간략하게 작성해주세요.</div>
          </div>
          <div className="w-full border border-gray-300 rounded-lg font-normal bg-white p-4">
           
          {/* 개별 평가*/}
          {finalEvaluation?.evaluations && finalEvaluation.evaluations.length > 0 && (
            <div className="w-full p-4">
              <div className="flex flex-col gap-4">
                {finalEvaluation.evaluations.map((evaluation: any, index: number) => (
                    <div key={index} className="grid grid-cols-2 gap-4 items-center mb-1 font-medium text-gray-700">
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-500 font-medium">{evaluation.username}</span>
                        <span className="text-gray-700">{evaluation.opinion}</span>
                      </div>
                    </div>
                  
                ))}
              </div>
            </div>
          )}

          
        </div>
        </div>
        
      )}

      {activeTab === "합격 여부 결정" && (
        <FlexBox
          direction="col"
          className="border border-gray-300 rounded-lg p-4 bg-white w-full gap-16"
        >
          
          <p className="font-semibold">
            <span className="font-bold text-blue-700">{userName}</span>님의 {message}
          </p>
          <FlexBox className="gap-4 font-semibold">
            <button
              className={`border border-gray-300 rounded-lg cursor-pointer ${
                isPassed === false
                  ? "outline-solid outline-red-100 text-red-500 bg-red-100"
                  : "text-gray-300 bg-gray-100"
              } cursor-pointer text-xl px-3 py-2`}
              onClick={() => setIsPassed(false)}
            >
              탈락
            </button>
            <button
              className={`border border-gray-300 rounded-lg cursor-pointer ${
                isPassed === true
                  ? "outline-solid outline-[#C0EEC6] bg-[#D7F7DB] text-[#00B817]"
                  : "text-gray-300"
              } bg-gray-100 cursor-pointer text-xl px-3 py-2`}
              onClick={() => setIsPassed(true)}
            >
              통과
            </button>
          </FlexBox>
          <Button
            disabled={isDisabled}
            className="w-full"
            onClick={type === "document" ? postDecision : postInterviewDecision}
            isPending={type === "document" ? isPending : isInterviewFinalPending}
          >
            완료
          </Button>
        </FlexBox>
      )}

      <ToastMessage
        message={type === "document" ? postMessage : interviewFinalPostMessage}
        isOpen={type === "document" ? isToastOpen : isInterviewFinalToastOpen}
        setIsOpen={type === "document" ? setIsToastOpen : setIsInterviewFinalToastOpen}
        isError={type === "document" ? isError : isInterviewFinalError}
      />
    </FlexBox>
  );
};

export default DecisionTab;
