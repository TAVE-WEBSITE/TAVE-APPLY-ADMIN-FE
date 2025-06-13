import Pagination from "../Pagination/Pagination";
import Icon from "../Icon/Icon";
import InterviewersLoading from "@/pages/Setting/Loading/InterviewersLoading";
import type { NavigateFunction } from "react-router-dom";
import { formatDateTime } from "@/utils/formatDate";

interface ApplicationTableProps {
  filterStatus?: string;
  rows: string[];
  applications: any[] | undefined;
  isLoading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number | undefined;
  baseUrl?: string;
  navigate?: NavigateFunction;
}

const ApplicationTable = ({
  rows,
  applications,
  isLoading,
  currentPage,
  setCurrentPage,
  totalPages,
  baseUrl,
  navigate,
}: ApplicationTableProps) => {
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    applications && applications.slice(indexOfFirstItem, indexOfLastItem);

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
            {currentItems && !isLoading ? (
              currentItems?.map((application, index) => (
                <tr
                  key={application.id + index}
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
                  {application.count && (
                    <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 justify-start text-gray-700 text-base font-medium">
                      {application.count}
                    </td>
                  )}
                  {application.interviewTime && (
                    <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 opacity-60 justify-start text-gray-700 text-base font-medium">
                      {formatDateTime(application.interviewTime)}
                    </td>
                  )}
                  {application.recruitTime && (
                    <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 opacity-60 justify-start text-gray-700 text-base font-medium">
                      {formatDateTime(application.recruitTime)}
                    </td>
                  )}
                  {application.status && (
                    <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 text-sm max-w-16">
                      <span
                        className={`px-2 justify-start text-base leading-5 font-semibold rounded-full
                          ${
                            application.status === "COMPLETE"
                              ? "text-blue-600 font-semibold"
                              : application.status === "FAIL"
                              ? "text-red-600 font-semibold"
                              : application.status === "PASS"
                              ? "text-green-600 font-semibold"
                              : application.status === "HOLD"
                              ? "text-gray-900 font-semibold"
                              : application.status === "NOTCHECKED"
                              ? "text-gray-600 font-semibold"
                              : ""
                          }
                          `}
                      >
                        {application.status === "COMPLETE"
                          ? "완료"
                          : application.status === "FAIL"
                          ? "불합격"
                          : application.status === "PASS"
                          ? "합격"
                          : application.status === "HOLD"
                          ? "대기"
                          : application.status === "NOTCHECKED"
                          ? "평가 진행 전"
                          : ""}
                      </span>
                    </td>
                  )}
                </tr>
              ))
            ) : isLoading ? (
              <InterviewersLoading />
            ) : (
              <tr className="h-[500px]">
                <td colSpan={6}>
                  <div className="flex flex-col justify-center items-center gap-4 p-4 text-gray-700 w-full h-full text-center">
                    <Icon type="Alert" size={28} />
                    데이터를 불러오는데 실패했습니다 <br />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages ? totalPages : 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ApplicationTable;
