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

  // currentMaxPage는 최소 1 이상이 되도록 보정
  const safePage = Math.max(0, page); // 실제 page는 0도 허용
  const currentMaxPage = Math.max(safePage + 1, maxPageRef.current); // +1로 최소 쿼리 1개 보장
  maxPageRef.current = currentMaxPage;

  const pageQueries = useQueries({
    queries: Array.from({ length: currentMaxPage }, (_, index) => {
      const pageNum = index; // 이제 0-based 페이지로 호출
      const queryParams =
        status === "ALL"
          ? { page: pageNum, size }
          : { page: pageNum, size, status };

      return {
        queryKey: [type, "list", queryParams],
        queryFn: () => fetchList(type as ApplicationType, queryParams),
        staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
      };
    }),
  });

  //
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
  ]);

  const isLoading = pageQueries.some((query) => query.isLoading);
  return {
    entireList,
    isLoading,
    totalPages: totalPagesRef.current,
  };
};
