import Icon from "@/components/Icon/Icon";
import { useState, useMemo, useEffect } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [pageGroup, setPageGroup] = useState(0);
  
  // 현재 페이지 그룹 계산
  const currentPageGroup = useMemo(() => {
    return Math.floor((currentPage - 1) / 10);
  }, [currentPage]);
  
  // 페이지 그룹이 변경되면 상태 업데이트
  useEffect(() => {
    if (currentPageGroup !== pageGroup) {
      setPageGroup(currentPageGroup);
    }
  }, [currentPageGroup, pageGroup]);
  
  // 표시할 페이지 번호들 계산
  const visiblePages = useMemo(() => {
    const startPage = pageGroup * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [pageGroup, totalPages]);
  
  // 이전 페이지 그룹으로 이동
  const goToPreviousGroup = () => {
    if (pageGroup > 0) {
      setPageGroup(pageGroup - 1);
      onPageChange(pageGroup * 10);
    }
  };
  
  // 다음 페이지 그룹으로 이동
  const goToNextGroup = () => {
    if ((pageGroup + 1) * 10 < totalPages) {
      setPageGroup(pageGroup + 1);
      onPageChange((pageGroup + 1) * 10 + 1);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      {/* 이전 페이지 그룹 (10페이지 이상일 때만 표시) */}
      {totalPages > 10 && pageGroup > 0 && (
        <button
          onClick={goToPreviousGroup}
          className="p-2 rounded-md flex items-center cursor-pointer"
          aria-label="이전 페이지 그룹"
        >
          <Icon type="ChevronUp" size={16} className="rotate-270" />
          <Icon type="ChevronUp" size={16} className="rotate-270 ml-[-8px]" />
        </button>
      )}

      {/* 페이지 번호 */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 justify-start rounded-lg text-sm font-bold cursor-pointer ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "text-gray-600 text-sm font-bold"
          }`}
        >
          {page}
        </button>
      ))}

      {/* 다음 페이지 그룹 (10페이지 이상일 때만 표시) */}
      {totalPages > 10 && (pageGroup + 1) * 10 < totalPages && (
        <button
          onClick={goToNextGroup}
          className="p-2 rounded-md flex items-center cursor-pointer"
          aria-label="다음 페이지 그룹"
        >
          <Icon type="ChevronUp" size={16} className="rotate-90" />
          <Icon type="ChevronUp" size={16} className="rotate-90 ml-[-8px]" />
        </button>
      )}
    </div>
  );
};

export default Pagination;
