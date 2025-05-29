import React, { useState } from 'react';
import Pagination from '../Pagination/Pagination';

interface ApplicationTableProps {
  filterStatus?: '전체' | '대기중' | '완료';
}

const ApplicationTable = ({ filterStatus = '전체' }: ApplicationTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const mockData = [
    {
      id: '1',
      field: '프론트엔드',
      name: '홍길동',
      gender: 'MALE',
      school: '서울대학교',
      appliedAt: '2024.03.20 14:30',
      isEvaluated: true,
    },
    {
      id: '2',
      field: '백엔드',
      name: '김철수',
      gender: 'MALE',
      school: '연세대학교',
      appliedAt: '2024.03.20 15:00',
      isEvaluated: false,
    },
    {
      id: '3',
      field: '디자인',
      name: '이영희',
      gender: 'FEMALE',
      school: '고려대학교',
      appliedAt: '2024.03.20 15:30',
      isEvaluated: true,
    },
    {
      id: '4',
      field: '데이터분석',
      name: '박지민',
      gender: 'FEMALE',
      school: '성균관대학교',
      appliedAt: '2024.03.21 09:00',
      isEvaluated: true,
    },
    {
      id: '5',
      field: '딥러닝',
      name: '최현우',
      gender: 'MALE',
      school: '한양대학교',
      appliedAt: '2024.03.21 09:30',
      isEvaluated: false,
    },
    {
      id: '6',
      field: '프론트엔드',
      name: '서지수',
      gender: 'FEMALE',
      school: '서울여자대학교',
      appliedAt: '2024.03.21 10:00',
      isEvaluated: true,
    },
    {
      id: '7',
      field: '백엔드',
      name: '정민호',
      gender: 'MALE',
      school: '중앙대학교',
      appliedAt: '2024.03.21 10:30',
      isEvaluated: false,
    },
    {
      id: '8',
      field: '디자인',
      name: '한소희',
      gender: 'FEMALE',
      school: '홍익대학교',
      appliedAt: '2024.03.21 11:00',
      isEvaluated: true,
    },
    {
      id: '9',
      field: '데이터분석',
      name: '이승기',
      gender: 'MALE',
      school: '경희대학교',
      appliedAt: '2024.03.21 11:30',
      isEvaluated: false,
    },
    {
      id: '10',
      field: '딥러닝',
      name: '김보라',
      gender: 'FEMALE',
      school: '부산대학교',
      appliedAt: '2024.03.21 12:00',
      isEvaluated: true,
    },
    {
      id: '11',
      field: '프론트엔드',
      name: '장우진',
      gender: 'MALE',
      school: '인하대학교',
      appliedAt: '2024.03.21 12:30',
      isEvaluated: false,
    },
    {
      id: '12',
      field: '백엔드',
      name: '오지현',
      gender: 'FEMALE',
      school: '동국대학교',
      appliedAt: '2024.03.21 13:00',
      isEvaluated: true,
    },
    {
      id: '13',
      field: '디자인',
      name: '강다연',
      gender: 'FEMALE',
      school: '이화여자대학교',
      appliedAt: '2024.03.21 13:30',
      isEvaluated: false,
    },
    {
      id: '14',
      field: '데이터분석',
      name: '류진우',
      gender: 'MALE',
      school: '건국대학교',
      appliedAt: '2024.03.21 14:00',
      isEvaluated: true,
    },
    {
      id: '15',
      field: '딥러닝',
      name: '배수지',
      gender: 'FEMALE',
      school: '경북대학교',
      appliedAt: '2024.03.21 14:30',
      isEvaluated: false,
    },
  ];
  

  const getFieldColor = (field: string) => {
    switch (field) {
      case '프론트엔드':
        return 'bg-blue-600';
      case '백엔드':
        return 'bg-orange-400';
      case '디자인':
        return 'bg-pink-500';
      case '데이터분석':
        return 'bg-orange-300';
      case '딥러닝':
        return 'bg-green-400';
      default:
        return 'bg-gray-300';
    }
  };

  const getGenderText = (gender: string) => {
    return gender === 'MALE' ? '남' : '여';
  };

  // 필터링된 데이터 생성
  const filteredData = mockData.filter((item) => {
    if (filterStatus === '전체') return true;
    if (filterStatus === '완료') return item.isEvaluated;
    if (filterStatus === '대기중') return !item.isEvaluated;
    return true;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full overflow-x-auto px-20">
      <div className="max-w-8xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
  <table className="w-full border-separate border-spacing-0">
    <thead className="bg-white">
      <tr className="rounded-t-xl overflow-hidden">
        <th className="px-6 py-6 text-left text-gray-600 text-sm font-bold border-b border-gray-200">
          지원 분야
        </th>
        <th className="px-6 py-6 text-left text-gray-600 text-sm font-bold border-b border-gray-200 min-w-32">
          이름
        </th>
        <th className="px-6 py-6 text-left text-gray-600 text-sm font-bold border-b border-gray-200 min-w-32">
          성별
        </th>
        <th className="px-6 py-6 text-left text-gray-600 text-sm font-bold border-b border-gray-200">
          학교
        </th>
        <th className="px-6 py-6 text-left text-gray-600 text-sm font-bold border-b border-gray-200">
          지원 날짜
        </th>
        <th className="px-6 py-6 text-left text-gray-600 text-sm font-bold border-b border-gray-200 max-w-16">
          평가 여부
        </th>
      </tr>
    </thead>
    <tbody className="bg-white">
      {currentItems.map((application, index) => (
        <tr
          key={application.id}
          className={`hover:bg-slate-600/5 border-b border-gray-200  ${
            index === currentItems.length - 1 ? 'rounded-b-xl' : ''
          }`}
        >
          <td className="flex items-center gap-2 px-6 py-6 whitespace-nowrap border-b border-gray-200 justify-start text-gray-700 text-base font-medium min-w-[120px]">
  <div className={`w-2 h-2 rounded-full ${getFieldColor(application.field)}`} />
  {application.field}
</td>
          <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 justify-start text-gray-700 text-base font-medium min-w-32">
            {application.name}
          </td>
          <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 justify-start text-gray-700 text-base font-medium min-w-32">
            {getGenderText(application.gender)}
          </td>
          <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 justify-start text-gray-700 text-base font-medium">
            {application.school}
          </td>
          <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 opacity-60 justify-start text-gray-700 text-base font-medium">
            {application.appliedAt}
          </td>
          <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 text-sm max-w-16">
            <span
              className={`px-2 justify-start text-base leading-5 font-semibold rounded-full ${
                application.isEvaluated
                  ? 'text-blue-600 font-bold'
                  : 'text-gray-700 font-medium'
              }`}
            >
              {application.isEvaluated ? '완료' : '대기'}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ApplicationTable;
