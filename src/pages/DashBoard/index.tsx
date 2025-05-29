import { useState } from "react";
import FlexBox from "@/components/Layout/FlexBox";
import CountCard from "@/components/CountCard";
import DonutChart from "@/components/Chart/DonutChart";
import Modal from "@/components/Modal/Modal";
import type { ChartData, ChartDataWithCount } from "@/types/chart";

// 차트 샘플 데이터
const genderData: ChartDataWithCount[] = [
  { label: "남성", ratio: 75, count: 34 },
  { label: "여성", ratio: 25, count: 11 },
];

const skillData: ChartData[] = [
  { label: "프론트", ratio: 35 },
  { label: "백엔드", ratio: 25 },
  { label: "디자인", ratio: 20 },
  { label: "데브옵스", ratio: 13 },
  { label: "AI", ratio: 7 },
];

export const Page = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <h1 className="font-bold text-4xl">DashBoard</h1>
        <FlexBox className="w-full justify-between">
          <h2 className="font-semibold text-xl">16기 지원 현황</h2>
          <p className="text-gray-500">2025.08.11 14:00 기준</p>
        </FlexBox>
      </FlexBox>

      <section className="min-h-[calc(100vh-244px)] bg-gray-100 flex flex-col gap-8">
        <FlexBox className="w-full pt-8 justify-center gap-4">
          <CountCard text="현재 지원자수" boxColor="blue" count={200} />
          <CountCard text="전 기수 대비" boxColor="green" count="+10%" />
          <CountCard text="현재 지원자수" boxColor="orange" count={100} />
        </FlexBox>

        <FlexBox className="justify-center gap-4">
          <div className="bg-white rounded-xl px-4 py-5 justify-between w-[640px] border border-gray-200">
            <DonutChart
              data={genderData}
              title="남녀 비율"
              colors={["#4F46E5", "#EC4899"]}
            />
          </div>
          <div className="bg-white rounded-xl px-4 py-5 justify-between w-[640px] border border-gray-200">
            <DonutChart
              data={skillData}
              title="파트별 비율"
              colors={["#4F46E5", "#EC4899", "#F97316", "#EAB308", "#10B981"]}
            />
          </div>
        </FlexBox>
        <Modal
          isOpen={isOpen}
          title="신규 지원 초기 설정"
          onClose={() => setIsOpen(!isOpen)}
          buttonCount={1}
          confirmText="설정하러 가기"
          onConfirm={() => setIsOpen(!isOpen)}
        >
          <p className="text-center text-gray-500">
            안녕하세요, 홍길동 회장님! <br /> 기수 지원 관리 페이지에 오신 것을
            환영합니다. <br /> <br /> 15기 모집이 종료된 지, 147일이 지났습니다.{" "}
            <br /> 다음 기수 모집을 시작하기 전, 초기 설정 부탁드립니다.
          </p>
        </Modal>
      </section>
    </div>
  );
};