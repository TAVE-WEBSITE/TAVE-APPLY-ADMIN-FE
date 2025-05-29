import { useState } from "react";
import FlexBox from "@/components/Layout/FlexBox";
import CountCard from "@/components/CountCard";
import Tab from "@/components/Tab/Tab";
import ApplicationTable from "@/components/ApplicationTable/ApplicationTable";
import SearchInput from "@/components/Input/SearchInput";

// interface InputProps {
//   categories: string[];
//   active?: string;
//   onChange: (value: "전체" | "대기중" | "완료") => void; 
//   className?: string;
//   fitWidth?: boolean;
//   centerType?: boolean;
// }

export const Page = () => {
  const [activeTab, setActiveTab] = useState<"전체" | "대기중" | "완료">("전체");
  const [searchValue, setSearchValue] = useState("");
  const categories = ["전체", "대기중", "완료"];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <h1 className="font-bold text-4xl">16기 서류 평가 현황</h1>
        <FlexBox className="w-full justify-between">
          <p className="text-gray-500">2025.08.11 14:00 기준</p>
          <div className="opacity-80 justify-center text-white text-xl font-semibold underline">서류 최종 평가하기</div>
        </FlexBox>
      </FlexBox>
      <section className="min-h-[calc(100vh-244px)] bg-gray-100 flex flex-col gap-8">
        <FlexBox className="w-full pt-8 justify-center gap-4">
          <CountCard text="현재 지원자수" boxColor="blue" count={200} />
          <CountCard text="전 기수 대비" boxColor="green" count="+10%" />
          <CountCard text="현재 지원자수" boxColor="orange" count={100} />
        </FlexBox>
        <div className="px-16 flex justify-between items-center">
        <Tab 
            categories={categories}
            active={activeTab}
            onChange={() => setActiveTab(activeTab)}
            className="text-white"
          />
          <div className="w-1/4">
            <SearchInput 
              placeholder="지원자 검색"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
        </div>
       
        <ApplicationTable filterStatus={activeTab} />
      </section>
    </div>
  );
};