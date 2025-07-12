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

const Document = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { entireList, isLoading, totalPages } = usePagination<EvaluationItem>({
    type: "서류 평가",
    page: currentPage,
    size: 7,
    status: "NOTCHECKED",
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

  // API 조회 결과 콘솔 로그
  console.log("=== 서류 평가 API 조회 결과 ===");
  console.log("로딩 상태:", isLoading);
  console.log("전체 리스트 길이:", entireList.length);
  console.log("전체 리스트:", entireList);
  console.log("필터링된 리스트 길이:", filteredList.length);
  console.log("필터링된 리스트:", filteredList);
  console.log("현재 페이지:", currentPage);
  console.log("전체 페이지 수:", totalPages);
  console.log("활성 탭:", activeTab);
  console.log("검색어:", searchInput);
  console.log("선택된 역할:", checkedRoles);

  // 개별 항목 상세 정보
  if (entireList.length > 0) {
    console.log("=== 첫 번째 항목 상세 정보 ===");
    console.log(entireList[0]);
    
    console.log("=== 모든 항목 요약 ===");
    entireList.forEach((item, index) => {
      console.log(`항목 ${index + 1}:`, {
        id: item.id,
        name: item.name,
        fieldType: item.fieldType,
        sex: item.sex,
        school: item.school,
        recruitTime: item.recruitTime,
        isEvaluated: item.isEvaluated
      });
    });
  } else {
    console.log("조회된 서류가 없습니다.");
  }

  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <h1 className="font-bold text-4xl">16기 서류 평가 현황</h1>
        <FlexBox className="w-full justify-between">
          <p className="text-gray-500">
            {formatDateTime(new Date().toISOString()) + " 기준"}
          </p>
          <div
            className="text-xl text-gray-300 underline cursor-pointer"
            onClick={() => navigate("/evaluation/document/final")}
          >
            서류 최종 평가하기
          </div>
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

export default Document;
