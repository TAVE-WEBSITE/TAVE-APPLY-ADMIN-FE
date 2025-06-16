import { useState } from "react";
import Button from "@/components/Button/Button";
import FlexBox from "@/components/Layout/FlexBox";
import ToastMessage from "@/components/Modal/ToastMessage";

const DecisionTab = () => {
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
      <div className="w-full border border-gray-300 rounded-lg font-normal bg-blue-50 p-4">
        최종 평점: <span className="text-blue-700 font-bold">6.5점</span>
        <span className="text-gray-500">(5명)</span>
      </div>

      <FlexBox
        direction="col"
        className="border border-gray-300 rounded-lg p-4 bg-white w-full gap-16"
      >
        <p className="font-semibold">
          <span className="font-bold text-blue-700">장진영</span>님의 서류 전형
          결과를 선택해주세요
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
      <ToastMessage
        message="합격 여부 결정이 완료되었습니다"
        isOpen={isToastOpen}
        setIsOpen={setIsToastOpen}
      />
    </FlexBox>
  );
};

export default DecisionTab;
