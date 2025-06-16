import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icon/Icon";
import CheckBox from "@/components/Input/CheckBox";
import SearchInput from "@/components/Input/SearchInput";
import FlexBox from "@/components/Layout/FlexBox";
import type { RoleType } from "@/types/role";
import ApplicationTable from "@/components/ApplicationTable/ApplicationTable";

const filters: RoleType[] = [
  "디자인",
  "웹 프론트",
  "앱 프론트",
  "백엔드",
  "데이터 분석",
  "딥러닝",
];

import { type Status } from "@/types/application";

const statusPool: Status[] = ["HOLD", "COMPLETE"];
const statusFinalPool: Status[] = [
  "FAIL",
  "PASS",
  "HOLD",
  "NOTCHECKED",
  "COMPLETE",
];

const fields = [
  "웹 프론트",
  "백엔드",
  "디자인",
  "데이터 분석",
  "딥러닝",
  "앱 프론트",
];
const names = [
  "홍길동",
  "김철수",
  "이영희",
  "박지민",
  "최현우",
  "서지수",
  "정민호",
  "한소희",
  "이승기",
  "김보라",
  "장우진",
  "오지현",
  "강다연",
  "류진우",
  "배수지",
  "이도현",
  "유재석",
  "장나라",
  "신동엽",
  "아이유",
  "정우성",
  "수지",
  "나연",
  "제니",
  "지수",
  "채원",
  "태연",
  "슬기",
  "지민",
  "뷔",
];

const schools = [
  "서울대학교",
  "연세대학교",
  "고려대학교",
  "성균관대학교",
  "한양대학교",
  "서울여자대학교",
  "중앙대학교",
  "홍익대학교",
  "경희대학교",
  "부산대학교",
  "인하대학교",
  "동국대학교",
  "이화여자대학교",
  "건국대학교",
  "경북대학교",
];

const generateMockData = (type: "final" | "document", count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const common = {
      id: `${i + 1}`,
      name: names[i % names.length],
      fieldType: fields[i % fields.length],
      sex: i % 2 === 0 ? "MALE" : "FEMALE",
      school: schools[i % schools.length],
    };

    if (type === "final") {
      return {
        ...common,
        count: (i % 5) + 1,
        status: statusFinalPool[i % statusPool.length],
      };
    } else {
      return {
        ...common,
        recruitTime: new Date().toISOString(),
        status: statusPool[i % statusPool.length],
      };
    }
  });
};

const applicationMockData = generateMockData("document", 7);

const ApplyMock = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [originalList, setOrigianlList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [filteredList, setFilteredList] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [checkedRoles, setCheckedRoles] = useState<Set<RoleType>>(new Set());

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);
      setOrigianlList(applicationMockData);
      // setFilteredList(applicationMockData);
      setIsLoading(false);
    };
    fetcher();
  }, []);

  const handleFilter = (role: RoleType) => {
    setCheckedRoles((prev) => {
      const newSet = new Set(prev);
      newSet.has(role) ? newSet.delete(role) : newSet.add(role);
      return newSet;
    });
  };

  const filteredList = useMemo<any[]>(() => {
    return originalList.filter((item: any) => {
      const matchRole =
        checkedRoles.size === 0 || checkedRoles.has(item.fieldType as RoleType);
      const matchName = item.name.includes(searchInput);

      return matchRole && matchName;
    });
  }, [originalList, searchInput, checkedRoles]);

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
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={undefined}
        />
      </div>
    </>
  );
};

export default ApplyMock;
