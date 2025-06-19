import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Body from "@/components/Layout/Body";
import FlexBox from "@/components/Layout/FlexBox";
import { formatDateTime } from "@/utils/formatDate";
import CountCard from "@/components/Card/CountCard";
import Tab from "@/components/Tab/Tab";
import SearchInput from "@/components/Input/SearchInput";
import FilterButton from "@/components/Button/FilterButton";
import ApplicationTable from "@/components/ApplicationTable/ApplicationTable";
import { type EvaluationItem } from "@/types/application";
import { usePagination } from "@/hooks/usePagination";
import { useFilter } from "@/hooks/useFilter";
import Button from "@/components/Button/Button";

const FinalInterview = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { entireList, isLoading, totalPages } = usePagination<EvaluationItem>({
    type: "서류 평가",
    page: currentPage,
    size: 7,
  });

  const {
    filteredList,
    checkedRoles,
    searchInput,
    activeTab,
    setActiveTab,
    setSearchInput,
    handleFilter,
  } = useFilter<EvaluationItem>(entireList);

  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <h1 className="font-bold text-4xl">16기 최종 면접 평가</h1>
        <FlexBox className="w-full justify-between">
          <p className="text-gray-500">
            {formatDateTime(new Date().toISOString()) + " 기준"}
          </p>
          <Button onClick={() => {}}>면접 평가 완료</Button>
        </FlexBox>
      </FlexBox>
      <Body className="pt-4 gap-8">
        <FlexBox className="gap-4 mx-auto">
          <CountCard text="현재 지원자 수" boxColor={"blue"} count={200} />
          <CountCard text="남은 평가 서류 수" boxColor={"green"} count={37} />
          <CountCard text="합격자 수" boxColor={"orange"} count={80} />
        </FlexBox>
        <FlexBox className="justify-between w-[1320px] mx-auto">
          <Tab
            categories={["전체", "대기중", "완료"]}
            active={activeTab}
            onChange={setActiveTab}
          />

          <FlexBox className="gap-4">
            <FilterButton checkedList={checkedRoles} onChange={handleFilter} />
            <SearchInput
              placeholder="이름을 입력해주세요"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </FlexBox>
        </FlexBox>
        <div className="w-[1320px] mx-auto">
          <ApplicationTable
            rows={[
              "지원 분야",
              "이름",
              "성별",
              "학교",
              "지원 날짜",
              "평가 여부",
            ]}
            applications={filteredList}
            totalPages={totalPages}
            isLoading={isLoading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            baseUrl="/evaluation/document"
            navigate={navigate}
          />
        </div>
      </Body>
    </div>
  );
};

export default FinalInterview;
