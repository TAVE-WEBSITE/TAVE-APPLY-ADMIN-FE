import { useEffect, useState } from "react";
import { fetchAllInterviewers } from "@/api/Setting/Interview";
import type { Application, RoleType } from "@/types/role";
import { useQuery } from "@tanstack/react-query";

export const useApplyFilter = () => {
  const { data: applications, isLoading } = useQuery<Application[]>({
    queryKey: ["setting", "applications"],
    queryFn: fetchAllInterviewers,
  });
  const [filteredList, setFilteredList] = useState<Application[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [checkedRoles, setCheckedRoles] = useState<Set<RoleType>>(new Set());

  useEffect(() => {
    if (applications) setFilteredList(applications);
  }, [applications]);

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
    if (!applications) return;
    const filtered = getFilteredApplications(
      applications,
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

      if (applications) {
        const filtered = getFilteredApplications(
          applications,
          newSet,
          searchInput
        );
        setFilteredList(filtered);
      }

      return newSet;
    });
  };

  return {
    isLoading,
    filteredList,
    checkedRoles,
    searchInput,
    setSearchInput,
    handleFilter,
    searchByName,
  };
};
