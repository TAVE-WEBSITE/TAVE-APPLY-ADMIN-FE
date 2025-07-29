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

      const pageNum = index ;
      const queryParams =
        status === "ALL"
          ? { page: pageNum, size}
          : { page: pageNum, size, status: status };


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
      if (query.isSuccess && query.data?.result?.resumeResDtos?.content) {
        const transformedData = query.data.result.resumeResDtos.content.map((item: any) => ({
          ...item,
          id: String(item.id), 
          recruitTime: item.recruitTime || new Date().toISOString(), 
          isEvaluated: item.isEvaluated || false,
          memberId: item.memberId, 
          resumeId: item.resumeId,
        }));
        
        allData.push(...transformedData);
        totalPagesRef.current = query?.data?.result?.resumeResDtos?.page?.totalPages;
      }
    });
    return allData;

  }, [pageQueries.map(q => q.dataUpdatedAt).join(',')]); // dataUpdatedAt을 사용하여 더 안정적인 의존성

  // API 응답에서 count 데이터 추출
  const countData = useMemo(() => {
    const firstQuery = pageQueries[0];
    if (firstQuery?.isSuccess && firstQuery.data?.result) {
      return {
        totalRecruiter: firstQuery.data.result.totalRecruiter || 0,
        notCompletedRecruiter: firstQuery.data.result.notCompletedRecruiter || 0,
        completedRecruiter: firstQuery.data.result.completedRecruiter || 0,
      };
    }
    return {
      totalRecruiter: 0,
      notCompletedRecruiter: 0,
      completedRecruiter: 0,
    };
  }, [pageQueries[0]?.dataUpdatedAt]); // 첫 번째 쿼리의 dataUpdatedAt만 사용

  const isLoading = pageQueries.some((query) => query.isLoading);
  return {
    entireList,
    isLoading,
    totalPages: totalPagesRef.current,
    countData,
  };
};
