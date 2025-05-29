import React from 'react';
import ArrowLeft from '../../assets/icons/arrow-left.svg';
import ArrowRight from '../../assets/Icons/arrow-right.svg';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      {/* 이전 페이지 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md flex items-center cursor-pointer ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="이전 페이지"
      >
        <img src={ArrowLeft} alt="이전" className="w-6 h-6" />
      </button>

      {/* 페이지 번호 */}
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`w-9 h-9 justify-start rounded-lg text-sm font-bold cursor-pointer ${
            currentPage === i + 1
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 text-sm font-bold'
          }`}
        >
          {i + 1}
        </button>
      ))}

      {/* 다음 페이지 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md flex items-center cursor-pointer ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="다음 페이지"
      >
        <img src={ArrowRight} alt="다음" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Pagination;