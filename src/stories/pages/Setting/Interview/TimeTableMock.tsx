import { useEffect, useState } from "react";
import FlexBox from "@/components/Layout/FlexBox";
import Icon from "@/components/Icon/Icon";
import Button from "@/components/Button/Button";
import SearchInput from "@/components/Input/SearchInput";
import ApplicationTable from "@/components/ApplicationTable/ApplicationTable";
import type { RoleType } from "@/types/role";
import CheckBox from "@/components/Input/CheckBox";

const tableRows = ["지원 분야", "이름", "성별", "학교", "면접 일자"];

const filters: RoleType[] = [
  "디자인",
  "웹 프론트",
  "앱 프론트",
  "백엔드",
  "데이터 분석",
  "딥러닝",
];

const mockApplications = [
  {
    id: "1",
    fieldType: "웹 프론트",
    name: "홍길동",
    sex: "MALE",
    school: "서울대학교",
    recruitTime: "2024.03.20 14:30",
  },
  {
    id: "2",
    fieldType: "백엔드",
    name: "김철수",
    sex: "MALE",
    school: "연세대학교",
    recruitTime: "2024.03.20 15:00",
  },
  {
    id: "3",
    fieldType: "디자인",
    name: "이영희",
    sex: "FEMALE",
    school: "고려대학교",
    recruitTime: "2024.03.20 15:30",
  },
  {
    id: "4",
    fieldType: "데이터 분석",
    name: "박지민",
    sex: "FEMALE",
    school: "성균관대학교",
    recruitTime: "2024.03.21 09:00",
  },
  {
    id: "5",
    fieldType: "딥러닝",
    name: "최현우",
    sex: "MALE",
    school: "한양대학교",
    recruitTime: "2024.03.21 09:30",
  },
  {
    id: "6",
    fieldType: "앱 프론트",
    name: "서지수",
    sex: "FEMALE",
    school: "서울여자대학교",
    recruitTime: "2024.03.21 10:00",
  },
  {
    id: "7",
    fieldType: "백엔드",
    name: "정민호",
    sex: "MALE",
    school: "중앙대학교",

    recruitTime: "2024.03.21 10:30",
  },
  {
    id: "8",

    fieldType: "디자인",
    name: "한소희",
    sex: "FEMALE",
    school: "홍익대학교",
    recruitTime: "2024.03.21 11:00",
  },
  {
    id: "9",
    fieldType: "데이터 분석",
    name: "이승기",
    sex: "MALE",
    school: "경희대학교",
    recruitTime: "2024.03.21 11:30",
  },
  {
    id: "10",
    fieldType: "딥러닝",
    name: "김보라",
    sex: "FEMALE",
    school: "부산대학교",
    recruitTime: "2024.03.21 12:00",
  },
  {
    id: "11",
    fieldType: "웹 프론트",
    name: "장우진",
    sex: "MALE",
    school: "인하대학교",
    recruitTime: "2024.03.21 12:30",
  },
  {
    id: "12",
    fieldType: "백엔드",
    name: "오지현",
    sex: "FEMALE",
    school: "동국대학교",
    recruitTime: "2024.03.21 13:00",
  },
  {
    id: "13",
    fieldType: "디자인",
    name: "강다연",
    sex: "FEMALE",
    school: "이화여자대학교",
    recruitTime: "2024.03.21 13:30",
  },
  {
    id: "14",
    fieldType: "데이터 분석",
    name: "류진우",
    sex: "MALE",
    school: "건국대학교",
    recruitTime: "2024.03.21 14:00",
  },
  {
    id: "15",
    fieldType: "딥러닝",
    name: "배수지",
    sex: "FEMALE",
    school: "경북대학교",
    recruitTime: "2024.03.21 14:30",
  },
];

const TimeTableMock = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [checkedRoles, setCheckedRoles] = useState<Set<RoleType>>(new Set());
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setFilteredList(mockApplications);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleFilter = (role: RoleType) => {
    const newCheckedRoles = new Set(checkedRoles);
    if (newCheckedRoles.has(role)) {
      newCheckedRoles.delete(role);
    } else {
      newCheckedRoles.add(role);
    }
    setCheckedRoles(newCheckedRoles);

    // 필터 적용
    if (newCheckedRoles.size === 0) {
      setFilteredList(mockApplications);
    } else {
      setFilteredList(
        mockApplications.filter((app) =>
          newCheckedRoles.has(app.fieldType as RoleType)
        )
      );
    }
  };

  const searchByName = () => {
    if (!searchInput) {
      setFilteredList(mockApplications);
      return;
    }
    setFilteredList(
      mockApplications.filter((app) =>
        app.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  };

  return (
    <div
      className="flex flex-col gap-4"
      onKeyDown={(e) => e.key === "Enter" && searchByName()}
    >
      <FlexBox className="justify-between">
        <Button
          className="bg-white border-gray-300 text-gray-700! relative"
          onClick={() => setShowFilter(!showFilter)}
        >
          <Icon type="Filter" size={18} />
          지원분야
        </Button>
        {showFilter && (
          <div className="w-[222px] h-[296px] bg-white rounded-xl p-4 absolute bottom-35 border border-gray-100 z-99">
            {filters.map((role) => (
              <CheckBox
                key={role}
                text={role}
                isChecked={checkedRoles.has(role)}
                onChange={() => handleFilter(role)}
              />
            ))}
          </div>
        )}
        <SearchInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="이름을 입력해주세요"
          onKeyDown={(e) => e.key === "Enter" && searchByName()}
        />
      </FlexBox>
      <ApplicationTable
        applications={filteredList}
        rows={tableRows}
        isLoading={isLoading}
        navigate={() => {}}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={1}
      />
    </div>
  );
};

export { TimeTableMock };
