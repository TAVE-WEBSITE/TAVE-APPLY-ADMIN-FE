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

// localStorage 키
const FILTER_STORAGE_KEY = "evaluation_document_filter_role";
const PAGE_STORAGE_KEY = "evaluation_document_page";


const Document = () => {
  const navigate = useNavigate();
  
  // localStorage에서 페이지 번호 복원
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const saved = localStorage.getItem(PAGE_STORAGE_KEY);
      if (saved) {
        const page = parseInt(saved, 10);
        if (!isNaN(page) && page > 0) {
          return page;
        }
      }
    } catch (error) {
      // localStorage 읽기 실패 시 기본값 사용
    }
    return 1;
  });
  
  // 페이지 번호 변경 시 localStorage에 저장
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // localStorage에 즉시 저장
    try {
      localStorage.setItem(PAGE_STORAGE_KEY, page.toString());
    } catch (error) {
      // localStorage 저장 실패 시 무시
    }
  };

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
  
  // localStorage에서 필터 상태 복원
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(() => {
    try {
      const saved = localStorage.getItem(FILTER_STORAGE_KEY);
      if (saved) {
        const role = saved as RoleType;
        return role;
      }
    } catch (error) {
      // localStorage 읽기 실패 시 기본값 사용
    }
    return null;
  });

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
    // 탭 변경 시 페이지를 1로 리셋하고 localStorage에도 저장
    setCurrentPage(1);
    try {
      localStorage.setItem(PAGE_STORAGE_KEY, "1");
    } catch (error) {
      // localStorage 저장 실패 시 무시
    }
  };



  const handleFilter = (role: RoleType | null) => {
    // 상태 업데이트
    setSelectedRole(role);
    
    // localStorage에 즉시 저장
    try {
      if (role) {
        localStorage.setItem(FILTER_STORAGE_KEY, role);
      } else {
        localStorage.removeItem(FILTER_STORAGE_KEY);
      }
    } catch (error) {
      // localStorage 저장 실패 시 무시
    }
  };




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
                  setSearchInput(searchValue);
                  // 검색 시 1페이지로 이동하고 localStorage에도 저장
                  setCurrentPage(1);
                  try {
                    localStorage.setItem(PAGE_STORAGE_KEY, "1");
                  } catch (error) {
                    // localStorage 저장 실패 시 무시
                  }
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
            setCurrentPage={handlePageChange}
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
