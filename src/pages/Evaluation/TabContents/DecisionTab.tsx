import { useState } from "react";
import Button from "@/components/Button/Button";
import FlexBox from "@/components/Layout/FlexBox";
import ToastMessage from "@/components/Modal/ToastMessage";

interface DecisionTabProps {
  message: string;
  finalEvaluation?: any; // 운영진 평가 데이터
  activeTab: string; // 현재 활성 탭
}

const DecisionTab = ({ message, finalEvaluation, activeTab }: DecisionTabProps) => {
  const [isPassed, setIsPassed] = useState<boolean | null>(null);
  const isDisabled = typeof isPassed !== "boolean";
  const [isPending, setIsPending] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);

  const postDecision = async () => {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      setIsToastOpen(true);
    }, 800);
  };

  return (
    <FlexBox direction="col" className="gap-4 text-gray-900 w-full">
      {activeTab === "서류평가분석" && (
        <div className="w-full flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <div className="px-3 py-1 bg-gray-200 rounded-md flex items-center justify-center font-bold text-xl text-gray-500">1</div>
            <div className="w-full"><span className="font-bold text-blue-700">장진영</span>님의 점수를 <span className="font-bold text-blue-700">10점 만점</span>으로 입력해주세요</div>
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
              <div className="space-y-3">
                {finalEvaluation.evaluations.map((evaluation: any, index: number) => (
                    <div key={index} className="grid grid-cols-2 gap-4 items-center mb-1 font-medium text-gray-700">
                      <div className="flex flex-col gap-4">
                        <span className="text-gray-500 font-medium">{evaluation.username}</span>
                        <span className="text-gray-700">{evaluation.opinion}점</span>
                      </div>
                    </div>
                  
                ))}
              </div>
            </div>
          )}

          
        </div>
        </div>
        
      )}

      {activeTab === "합격여부결정" && (
        <FlexBox
          direction="col"
          className="border border-gray-300 rounded-lg p-4 bg-white w-full gap-16"
        >
          
          <p className="font-semibold">
            <span className="font-bold text-blue-700">장진영</span>님의 {message}
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
            onClick={postDecision}
            isPending={isPending}
          >
            완료
          </Button>
        </FlexBox>
      )}

      <ToastMessage
        message="합격 여부 결정이 완료되었습니다"
        isOpen={isToastOpen}
        setIsOpen={setIsToastOpen}
      />
    </FlexBox>
  );
};

export default DecisionTab;
