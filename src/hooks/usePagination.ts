import { useMemo, useRef } from "react";
import { fetchList, type Pagination } from "@/api/fetchList";
import { type ApplicationType } from "@/types/application";
import { useQueries } from "@tanstack/react-query";

type UseFilterProps = { 
  pageType: ApplicationType;
  type?: string; // 지원 분야 필터
} & Pagination;

export const usePagination = <T>({
  pageType,
  type,
  page,
  size,
  status,
  name,
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
          ? { page: pageNum, size, ...(name && { name }), ...(type && { type }) }
          : { page: pageNum, size, status: status, ...(name && { name }), ...(type && { type }) };



      return {
        queryKey: [pageType, "list", pageNum, status, size, page, name, type],
        queryFn: () => fetchList(pageType as ApplicationType, { ...queryParams, pageType }),
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

  }, [pageQueries, page, status, name, type]); // pageQueries, page, status, name, type 변경 시 재계산

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

  // totalPages 계산 - 필터링된 결과의 실제 페이지 수를 우선 사용
  const totalPages = useMemo(() => {
    // 현재 페이지 쿼리에서 필터링된 결과의 페이지 수를 우선 확인
    const currentPageQuery = pageQueries[page];
    
    if (currentPageQuery?.isSuccess && currentPageQuery.data?.result) {
      // 필터링된 결과의 실제 페이지 수를 우선 사용
      if (currentPageQuery.data.result.resumeResDtos?.page?.totalPages !== undefined) {
        return currentPageQuery.data.result.resumeResDtos.page.totalPages;
      } else if (currentPageQuery.data.result.dtos?.page?.totalPages !== undefined) {
        return currentPageQuery.data.result.dtos.page.totalPages;
      } else if (currentPageQuery.data.result.totalPage !== undefined) {
        return currentPageQuery.data.result.totalPage;
      }
    }
    
    // 첫 번째 페이지 쿼리에서도 확인
    const firstQuery = pageQueries[0];
    if (firstQuery?.isSuccess && firstQuery.data?.result) {
      if (firstQuery.data.result.resumeResDtos?.page?.totalPages !== undefined) {
        return firstQuery.data.result.resumeResDtos.page.totalPages;
      } else if (firstQuery.data.result.dtos?.page?.totalPages !== undefined) {
        return firstQuery.data.result.dtos.page.totalPages;
      } else if (firstQuery.data.result.totalPage !== undefined) {
        return firstQuery.data.result.totalPage;
      }
    }
    
    // totalPagesRef에 저장된 값 사용 (entireList에서 설정됨)
    if (totalPagesRef.current !== undefined) {
      return totalPagesRef.current;
    }
    
    // 마지막 fallback: totalRecruiter를 사용 (필터링이 없을 때만)
    if (firstQuery?.isSuccess && firstQuery.data?.result) {
      const totalRecruiter = firstQuery.data.result.totalRecruiter;
      if (totalRecruiter !== undefined && totalRecruiter !== null) {
        return Math.ceil(totalRecruiter / size);
      }
    }
    
    return 1;
  }, [pageQueries, page, size]); // pageQueries, page, size 변경 시 재계산

  const isLoading = pageQueries.some((query) => query.isLoading);
  return {
    entireList,
    isLoading,
    totalPages: totalPages,
    countData,
  };
};
