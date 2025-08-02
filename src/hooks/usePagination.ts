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
  
  // 페이지가 변경되면 새로운 쿼리를 생성하기 위해 maxPageRef 업데이트
  if (safePage + 1 > maxPageRef.current) {
    maxPageRef.current = safePage + 1;
  }

  const pageQueries = useQueries({
    
    queries: Array.from({ length: currentMaxPage }, (_, index) => {

      const pageNum = index ;
      const queryParams =
        status === "ALL"
          ? { page: pageNum, size}
          : { page: pageNum, size, status: status };


      return {
        queryKey: [type, "list", pageNum, status, size, page],
        queryFn: () => fetchList(type as ApplicationType, queryParams),
        staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
      };
    }),
  });

  //
  const entireList = useMemo(() => {
    const allData: T[] = [];

    // 현재 페이지의 쿼리만 처리
    const currentPageQuery = pageQueries[page];
    
    if (currentPageQuery?.isSuccess && currentPageQuery.data?.result) {
      if (currentPageQuery.data.result.dataList) {
        const transformedData = currentPageQuery.data.result.dataList.map((item: any) => ({
          ...item,
          id: String(item.id),
        }));
        
        allData.push(...transformedData);
        totalPagesRef.current = currentPageQuery.data.result.totalPage;
      }
      else if (currentPageQuery.data.result.resumeResDtos?.content) {
        const transformedData = currentPageQuery.data.result.resumeResDtos.content.map((item: any) => ({
          ...item,
          id: String(item.id), 
          recruitTime: item.recruitTime || new Date().toISOString(), 
          isEvaluated: item.isEvaluated || false,
          memberId: item.memberId, 
          resumeId: item.resumeId,
        }));
        
        allData.push(...transformedData);
        totalPagesRef.current = currentPageQuery?.data?.result?.resumeResDtos?.page?.totalPages;
      }else if (currentPageQuery.data.result.dtos?.content) {
        const transformedData = currentPageQuery.data.result.dtos.content.map((item: any) => ({
          ...item,
          id: String(item.id),
        }));
        
        allData.push(...transformedData);
        totalPagesRef.current = currentPageQuery.data.result.dtos.page?.totalPages;
      }
    }
    return allData;

  }, [pageQueries, page, status]); // pageQueries, page, status 변경 시 재계산

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

  // totalPages를 totalRecruiter와 size를 기반으로 계산
  const totalPages = useMemo(() => {
    // 첫 번째 페이지 쿼리에서 totalRecruiter 정보 가져오기
    const firstQuery = pageQueries[0];
    
    if (firstQuery?.isSuccess && firstQuery.data?.result) {
      const totalRecruiter = firstQuery.data.result.totalRecruiter;
      
      if (totalRecruiter !== undefined && totalRecruiter !== null) {
        // totalRecruiter를 size로 나누어 올림하여 totalPages 계산
        const calculatedTotalPages = Math.ceil(totalRecruiter / size);
        console.log("=== totalPages 계산 ===");
        console.log("totalRecruiter:", totalRecruiter);
        console.log("size:", size);
        console.log("계산된 totalPages:", calculatedTotalPages);
        return calculatedTotalPages;
      }
    }
    
    // fallback: 기존 구조들 확인
    if (firstQuery?.isSuccess && firstQuery.data?.result) {
      if (firstQuery.data.result.resumeResDtos?.page?.totalPages) {
        return firstQuery.data.result.resumeResDtos.page.totalPages;
      } else if (firstQuery.data.result.totalPage) {
        return firstQuery.data.result.totalPage;
      } else if (firstQuery.data.result.dtos?.page?.totalPages) {
        return firstQuery.data.result.dtos.page.totalPages;
      }
    }
    
    return totalPagesRef.current || 1;
  }, [pageQueries[0]?.dataUpdatedAt, size]); // size도 의존성에 추가

  const isLoading = pageQueries.some((query) => query.isLoading);
  return {
    entireList,
    isLoading,
    totalPages: totalPages,
    countData,
  };
};
