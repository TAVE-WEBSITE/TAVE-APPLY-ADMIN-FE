import { useNavigate } from "react-router-dom";
import Icon from "@/components/Icon/Icon";
import CheckBox from "@/components/Input/CheckBox";
import SearchInput from "@/components/Input/SearchInput";
import FlexBox from "@/components/Layout/FlexBox";
import { usePagination } from "@/hooks/usePagination";
import { useFilter } from "@/hooks/useFilter";
import type { RoleType } from "@/types/role";
import ApplicationTable from "@/components/ApplicationTable/ApplicationTable";
import { useState } from "react";

const filters: RoleType[] = [
  "디자인",
  "웹 프론트",
  "앱 프론트",
  "백엔드",
  "데이터 분석",
  "딥러닝",
];

const Apply = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { entireList, isLoading, totalPages } = usePagination({
    type: "지원서",
    page: currentPage,
    size: 7,
  });

  const {
    filteredList,
    checkedRoles,
    searchInput,
    setSearchInput,
    handleFilter,
  } = useFilter(entireList);

  return (
    <>
      <div className="flex flex-col items-center px-16 justify-between">
        <FlexBox className="w-full justify-between pt-8">
          <details className="relative">
            <summary className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white text-gray-700 focus:outline outline-gray-300 font-medium cursor-pointer">
              <Icon type="Filter" size={18} />
              지원분야
            </summary>
            <div
              className={`absolute top-full left-0 mt-2 px-4 py-3 bg-white border border-gray-300 rounded-lg min-w-48 z-10`}
            >
              {filters.map((role) => (
                <CheckBox
                  key={role}
                  text={role}
                  isChecked={checkedRoles.has(role)}
                  onChange={() => handleFilter(role)}
                />
              ))}
            </div>
          </details>
          <SearchInput
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="이름을 입력해주세요"
          />
        </FlexBox>
      </div>
      <div className="px-16">
        <ApplicationTable
          rows={["지원 분야", "이름", "성별", "학교", "지원 일자"]}
          applications={filteredList}
          isLoading={isLoading}
          baseUrl="/applies"
          navigate={navigate}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </>
  );
};

export default Apply;
