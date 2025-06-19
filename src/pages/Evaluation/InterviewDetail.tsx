import { useNavigate } from "react-router-dom";
import FlexBox from "@/components/Layout/FlexBox";
import Icon from "@/components/Icon/Icon";
import Body from "@/components/Layout/Body";

const InterviewDetail = () => {
  const navigate = useNavigate();
  //const { id: date } = useParams();

  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 items-start">
        <FlexBox className="gap-2">
          <Icon
            type="ChevronDown"
            size={40}
            className="rotate-90 cursor-pointer"
            onClick={() => navigate("/evaluation/document/final")}
          />
          <h1 className="font-bold text-2xl">면접 현황</h1>
        </FlexBox>
      </FlexBox>
      <FlexBox className="justify-center gap-4 pb-8">
        <div className="bg-gray-800 p-2 rounded-full">
          <Icon type={"ChevronDown"} size={18} className="rotate-90" />
        </div>
        <FlexBox direction="col">
          <h2 className="font-bold text-xl">8월 10일 목요일</h2>
          <p>12:00 ~ 13:00</p>
        </FlexBox>
        <div className="bg-gray-800 p-2 rounded-full">
          <Icon type={"ChevronDown"} size={18} className="rotate-270" />
        </div>
      </FlexBox>
      <Body>
        <div className="w-[1344px] mx-auto flex flex-col gap-4">
          <p className="text-gray-500 pt-8">총 면접자 4명</p>
          <FlexBox className="gap-2">
            <label
              className={`w-[78px] h-[28px] text-sm flex items-center justify-center rounded-2xl font-semibold text-gray-500 bg-gray-200 cursor-pointer`}
            >
              장진영
            </label>
            <label
              className={`w-[78px] h-[28px] text-sm flex items-center justify-center rounded-2xl font-semibold text-gray-500 bg-gray-200`}
            >
              심우선
            </label>
            <label
              className={`w-[78px] h-[28px] text-sm flex items-center justify-center rounded-2xl font-semibold text-gray-500 bg-gray-200`}
            >
              양현지
            </label>
            <label
              className={`w-[78px] h-[28px] text-sm flex items-center justify-center rounded-2xl font-semibold text-gray-500 bg-gray-200`}
            >
              서현빈
            </label>
          </FlexBox>
          <div className="w-full h-px border-t border-t-gray-300" />
        </div>
      </Body>
    </div>
  );
};

export default InterviewDetail;
