import { useEffect, useState } from "react";
import Icon from "@/components/Icon/Icon";
import CheckBox from "@/components/Input/CheckBox";
import SearchInput from "@/components/Input/SearchInput";
import FlexBox from "@/components/Layout/FlexBox";
import { fetchAllInterviewers } from "@/api/Setting/Interview";
import type { Application, RoleType } from "@/types/role";
import ApplicationTable from "@/components/ApplicationTable/ApplicationTable";

const filters: RoleType[] = [
  "디자인",
  "웹 프론트",
  "앱 프론트",
  "백엔드",
  "데이터 분석",
  "딥러닝",
];

const ApplyMock = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [filteredList, setFilteredList] = useState<Application[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [checkedRoles, setCheckedRoles] = useState<Set<RoleType>>(new Set());

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);
      const data = await fetchAllInterviewers();
      setFilteredList(data);
      setIsLoading(false);
    };
    fetcher();
  }, []);

  const getFilteredApplications = (
    base: Application[],
    roles: Set<RoleType>,
    keyword: string
  ) => {
    return base.filter((app) => {
      const matchRole =
        roles.size === 0 || roles.has(app.fieldType as RoleType);
      const matchName = app.name.includes(keyword);
      return matchRole && matchName;
    });
  };

  const searchByName = () => {
    const filtered = getFilteredApplications(
      filteredList,
      checkedRoles,
      searchInput
    );
    setFilteredList(filtered);
  };

  const handleFilter = (role: RoleType) => {
    setCheckedRoles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(role)) {
        newSet.delete(role);
      } else {
        newSet.add(role);
      }

      const filtered = getFilteredApplications(
        filteredList,
        newSet,
        searchInput
      );
      setFilteredList(filtered);

      return newSet;
    });
  };

  return (
    <>
      <div
        className="flex flex-col items-center px-16 justify-between"
        onKeyDown={(e) => e.key === "Enter" && searchByName()}
      >
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
        />
      </div>
    </>
  );
};

export default ApplyMock;
