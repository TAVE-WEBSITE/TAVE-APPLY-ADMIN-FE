import { useNavigate } from "react-router-dom";
import FlexBox from "@/components/Layout/FlexBox";
import Icon from "@/components/Icon/Icon";
import SearchInput from "@/components/Input/SearchInput";
import ApplicationTable from "@/components/ApplicationTable/ApplicationTable";
import type { RoleType } from "@/types/role";
import CheckBox from "@/components/Input/CheckBox";
import { useFilter } from "@/hooks/Setting/Interview/useFilter";

const tableRows = ["지원 분야", "이름", "성별", "학교", "면접 일자"];

const filters: RoleType[] = [
  "디자인",
  "웹 프론트",
  "앱 프론트",
  "백엔드",
  "데이터 분석",
  "딥러닝",
];

const TimeTable = () => {
  const navigate = useNavigate();
  const {
    filteredList,
    isLoading,
    checkedRoles,
    searchInput,
    setSearchInput,
    handleFilter,
    searchByName,
  } = useFilter();

  return (
    <div
      className="flex flex-col gap-4"
      onKeyDown={(e) => e.key === "Enter" && searchByName()}
    >
      <FlexBox className="justify-between">
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
      <ApplicationTable
        applications={filteredList}
        rows={tableRows}
        isLoading={isLoading}
        baseUrl="/setting/interview"
        navigate={navigate}
      />
    </div>
  );
};

export default TimeTable;
