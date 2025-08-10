import { useState, useEffect } from "react";
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
import { type RoleType } from "@/types/role.d";


const Document = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusFromTab = (tab: string) => {
    switch (tab) {
      case "전체":
        return "ALL";
      case "대기중":
        return "NOTCHECKED";
      case "완료":
        return "COMPLETE";
      default:
        return "NOTCHECKED";
    }
  };

  const [activeTab, setActiveTab] = useState("전체");
  const currentStatus = getStatusFromTab(activeTab);

  const [searchInput, setSearchInput] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);

  const { entireList, isLoading, totalPages, countData } = usePagination<EvaluationItem>({
    pageType: "서류 평가",
    page: currentPage - 1,
    size: 7,
    status: currentStatus,
    name: searchInput,
    type: selectedRole || undefined,
  });

  const handleTabChange = (tab: string) => { 
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleFilter = (role: RoleType | null) => {
    setSelectedRole(role);
  };

  // 검색어 변경 시 로그 출력
  useEffect(() => {
    console.log("=== Document.tsx 검색어 변경 ===");
    console.log("searchInput:", searchInput);
    console.log("searchValue:", searchValue);
    console.log("전달되는 name 파라미터:", searchInput);
    console.log("name 파라미터 길이:", searchInput.length);
  }, [searchInput, searchValue]);

  // usePagination 호출 시 파라미터 확인
  useEffect(() => {
    console.log("=== Document.tsx usePagination 파라미터 ===");
    console.log("전달되는 name:", searchInput);
    console.log("전달되는 type:", selectedRole);
    console.log("전달되는 pageType:", "서류 평가");
  }, [searchInput, selectedRole]);


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
          <CountCard text="현재 지원자 수" boxColor={"blue"} count={countData.totalRecruiter} />
          <CountCard text="남은 평가 서류 수" boxColor={"green"} count={countData.notCompletedRecruiter} />
          <CountCard text="평가 완료 수" boxColor={"orange"} count={countData.completedRecruiter} />
        </FlexBox>
        <FlexBox className="justify-between w-[1320px] mx-auto">
          <Tab
            categories={["전체", "대기중", "완료"]}
            active={activeTab}
            onChange={handleTabChange}
          />

          <FlexBox className="gap-4">
            <FilterButton selectedRole={selectedRole} onChange={handleFilter} />
            <SearchInput
              placeholder="이름을 입력해주세요"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  console.log("Enter 키 입력됨, searchValue:", searchValue);
                  setSearchInput(searchValue);
                }
              }}
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
            applications={entireList}
            totalPages={totalPages}
            isLoading={isLoading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            baseUrl="/evaluation/document"
            navigate={navigate}
            pageType="document"
          />
        </div>
      </Body>
    </div>
  );
};

export default Document;
