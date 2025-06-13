import { useMemo, useState } from "react";
import type { RoleType } from "@/types/role";
import type { Status } from "@/types/application";

const statusMap: Record<string, Status> = {
  전체: "ALL",
  대기중: "HOLD",
  완료: "COMPLETE",
  "평가 진행 전": "HOLD",
  불합격: "FAIL",
  합격: "PASS",
};

export const useFilter = <T>(list: T[]) => {
  const [searchInput, setSearchInput] = useState("");
  const [checkedRoles, setCheckedRoles] = useState<Set<RoleType>>(new Set());
  const [activeTab, setActiveTab] = useState("전체");

  const handleFilter = (role: RoleType) => {
    setCheckedRoles((prev) => {
      const newSet = new Set(prev);
      newSet.has(role) ? newSet.delete(role) : newSet.add(role);
      return newSet;
    });
  };

  const filteredList = useMemo<T[]>(() => {
    return list.filter((item: any) => {
      const matchRole =
        checkedRoles.size === 0 || checkedRoles.has(item.fieldType as RoleType);
      const matchName = item.name.includes(searchInput);
      const matchTab =
        statusMap[activeTab] === "ALL"
          ? true
          : item.status === statusMap[activeTab];
      return matchRole && matchName && matchTab;
    }) as T[];
  }, [list, searchInput, checkedRoles, activeTab]);

  return {
    filteredList,
    checkedRoles,
    searchInput,
    activeTab,
    setActiveTab,
    setSearchInput,
    handleFilter,
  };
};
