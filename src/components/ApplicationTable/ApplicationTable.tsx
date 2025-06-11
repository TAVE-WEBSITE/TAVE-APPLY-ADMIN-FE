import { useState } from "react";
import Pagination from "../Pagination/Pagination";
import Icon from "../Icon/Icon";
import InterviewersLoading from "@/pages/Setting/Loading/InterviewersLoading";
import Button from "../Button/Button";
import type { NavigateFunction } from "react-router-dom";

interface ApplicationTableProps {
  filterStatus?: "전체" | "대기중" | "완료";
  rows: string[];
  applications: any[] | undefined;
  isLoading: boolean;
  baseUrl?: string;
  navigate?: NavigateFunction;
}

const ApplicationTable = ({
  filterStatus = "전체",
  rows,
  applications,
  isLoading,
  baseUrl,
  navigate,
}: ApplicationTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const getFieldColor = (field: string) => {
    switch (field) {
      case "웹 프론트":
        return "bg-blue-600";
      case "앱 프론트":
        return "bg-blue-400";
      case "백엔드":
        return "bg-orange-400";
      case "디자인":
        return "bg-pink-500";
      case "데이터 분석":
        return "bg-orange-300";
      case "딥러닝":
        return "bg-green-400";
      default:
        return "bg-gray-300";
    }
  };

  const getGenderText = (gender: string) => {
    return gender === "MALE" ? "남" : "여";
  };

  // 필터링된 데이터 생성
  const filteredData =
    applications &&
    applications.filter((item) => {
      if (filterStatus === "전체") return true;
      if (filterStatus === "완료") return item.isEvaluated;
      if (filterStatus === "대기중") return !item.isEvaluated;
      return true;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    filteredData && filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages =
    filteredData && Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden h-[580px]">
        <table className="border-separate border-spacing-0 table-auto w-full">
          <thead className="bg-white">
            <tr className="rounded-t-xl overflow-hidden">
              {rows.map((e) => (
                <th
                  key={e}
                  className="px-6 py-6 text-left text-gray-600 text-sm font-bold border-b border-gray-200"
                >
                  {e}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {isLoading && <InterviewersLoading />}
            {currentItems && currentItems.length > 0 ? (
              currentItems.map((application, index) => (
                <tr
                  key={application.id}
                  className={`hover:bg-slate-600/5 border-b border-gray-200 cursor-pointer ${
                    index === currentItems.length - 1 ? "rounded-b-xl" : ""
                  }`}
                  onClick={() => {
                    navigate &&
                      baseUrl &&
                      navigate(`${baseUrl}/${application.id}`, {
                        state: { application },
                      });
                  }}
                >
                  <td className="flex items-center gap-2 px-6 py-6 whitespace-nowrap border-b border-gray-200 justify-start text-gray-700 text-base font-medium min-w-[120px]">
                    <div
                      className={`w-2 h-2 rounded-full ${getFieldColor(
                        application.fieldType
                      )}`}
                    />
                    {application.fieldType}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 justify-start text-gray-700 text-base font-medium min-w-32">
                    {application.name}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 justify-start text-gray-700 text-base font-medium min-w-32">
                    {getGenderText(application.sex)}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 justify-start text-gray-700 text-base font-medium">
                    {application.school}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 opacity-60 justify-start text-gray-700 text-base font-medium">
                    {application.recruitTime}
                  </td>
                  {application.isEvaluated && (
                    <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 text-sm max-w-16">
                      <span
                        className={`px-2 justify-start text-base leading-5 font-semibold rounded-full ${
                          application.isEvaluated
                            ? "text-blue-600 font-bold"
                            : "text-gray-700 font-medium"
                        }`}
                      >
                        {application.isEvaluated ? "완료" : "대기"}
                      </span>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr className="h-[500px]">
                <td colSpan={6}>
                  <div className="flex flex-col justify-center items-center gap-4 p-4 text-gray-700 w-full h-full">
                    <Icon type="Alert" size={28} />
                    서류 평가가 완료되지 않았습니다
                    <Button onClick={() => {}}>서류 평가 바로가기</Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages ? totalPages : 0}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ApplicationTable;
