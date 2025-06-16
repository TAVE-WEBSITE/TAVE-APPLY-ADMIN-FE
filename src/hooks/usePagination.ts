import { useMemo, useRef } from "react";
import { fetchList, type Pagination } from "@/api/fetchList";
import { type ApplicationType } from "@/types/application";
import { useQueries } from "@tanstack/react-query";

type UseFilterProps = { type: ApplicationType } & Pagination;

export const usePagination = <T>({
  type,
  page,
  size,
  status,
}: UseFilterProps) => {
  const totalPagesRef = useRef<number>(undefined);
  const maxPageRef = useRef<number>(0);
  // 현재 페이지가 이전 최대 페이지보다 클 때만 새로운 쿼리 생성
  const currentMaxPage = Math.max(page, maxPageRef.current);
  maxPageRef.current = currentMaxPage;

  const pageQueries = useQueries({
    queries: Array.from({ length: currentMaxPage }, (_, index) => {
      const pageNum = index + 1;
      const queryParams =
        status === "ALL"
          ? { page: pageNum, size }
          : { page: pageNum, size, status: status };

      return {
        queryKey: [type, "list", queryParams],
        queryFn: () => fetchList(type as ApplicationType, queryParams),
        staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
      };
    }),
  });

  const entireList = useMemo(() => {
    const allData: T[] = [];

    pageQueries.forEach((query) => {
      if (query.isSuccess && query.data?.content) {
        allData.push(...query.data.content);
        totalPagesRef.current = query?.data?.page?.totalPages;
      }
    });
    return allData;
  }, [
    pageQueries.map((q) => q.isSuccess && q.data?.content?.length).join(","),
  ]); // 실제 변화만 감지

  const isLoading = pageQueries.some((query) => query.isLoading);

  return {
    entireList,
    isLoading,
    totalPages: totalPagesRef.current,
  };
};
