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
  pageType?: "document" | "final"; // 페이지 타입 구분
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
  pageType,
}: ApplicationTableProps) => {
  const itemsPerPage = 7;

  const getFieldColor = (field: string | number) => {
    const fieldStr = String(field);
    switch (fieldStr) {
      case "웹 프론트":
      case "WEBFRONTEND":
        return "bg-blue-600";
      case "앱 프론트":
      case "APPFRONTEND":
        return "bg-blue-400";
      case "백엔드":
      case "BACKEND":
        return "bg-orange-400";
      case "디자인":
      case "DESIGN":
        return "bg-pink-500";
      case "데이터 분석":
      case "DATAANALYSIS":
        return "bg-orange-300";
      case "딥러닝":
      case "DEEPLEARNING":
        return "bg-green-400";
      default:
        return "bg-gray-300";
    }
  };

  const getFieldDisplayName = (field: string | number) => {
    const fieldStr = String(field);
    switch (fieldStr) {
      case "WEBFRONTEND":
        return "웹 프론트";
      case "APPFRONTEND":
        return "앱 프론트";
      case "BACKEND":
        return "백엔드";
      case "DESIGN":
        return "디자인";
      case "DATAANALYSIS":
        return "데이터 분석";
      case "DEEPLEARNING":
        return "딥러닝";
      default:
        return fieldStr || "기타";
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
              currentItems?.map((application, index) => {
              
                return (
                <tr
                  key={application.id + index}
                  className={`hover:bg-slate-600/5 border-b border-gray-200 ${
                    navigate && "cursor-pointer"
                  } ${index === currentItems.length - 1 ? "rounded-b-xl" : ""}`}
                  onClick={() => {
                    navigate &&
                      baseUrl &&
                      navigate(`${baseUrl}/${application.memberId}`, {
                        state: { 
                          application,
                          // 지원서 질문 정보도 함께 전달
                          resumeQuestions: null // 실제로는 API에서 불러올 예정
                        },
                      });
                  }}
                >
                  <td className="flex items-center gap-2 px-6 py-6 whitespace-nowrap border-b border-gray-200 justify-start text-gray-700 text-base font-medium min-w-[120px]">
                    <div
                      className={`w-2 h-2 rounded-full ${getFieldColor(
                        application.fieldType
                      )}`}
                    />
                    <span>{getFieldDisplayName(application.fieldType)}</span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 justify-start text-gray-700 text-base font-medium min-w-32">
                    <span>{application.name || ''}</span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 justify-start text-gray-700 text-base font-medium min-w-32">
                    <span>{getGenderText(application.sex) || ''}</span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 justify-start text-gray-700 text-base font-medium">
                    <span>{application.school || ''}</span>
                  </td>
                  {/* Document 페이지: 지원 날짜 */}
                  {pageType === "document" && application.recruitTime && (
                    <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 opacity-60 justify-start text-gray-700 text-base font-medium">
                      <span>{formatDateTime(application.recruitTime)}</span>
                    </td>
                  )}
                  {/* Final 페이지: 평가 완료 인원 */}
                  {pageType === "final" && application.count !== undefined && (
                    <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 justify-start text-gray-700 text-base font-medium">
                      <span>{String(application.count)}명</span>
                    </td>
                  )}
                  {application.interviewTime && (
                    <td className="px-6 py-6 whitespace-nowrap border-b border-gray-200 opacity-60 justify-start text-gray-700 text-base font-medium">
                      <span>{formatDateTime(application.interviewTime)}</span>
                    </td>
                  )}
                  {application.status !== undefined && application.status !== null && (
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
                              ? "text-orange-500 font-semibold"
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
                          ? "보류"
                          : application.status === "NOTCHECKED"
                          ? "평가 진행 전"
                          : ""}
                      </span>
                    </td>
                  )}
                </tr>
              );
              })
            ) : isLoading ? (
              <InterviewersLoading /> 
            )  : (
<tr className="h-[500px]">
  <td colSpan={rows.length}>
    <div className="flex flex-col justify-center items-center gap-4 p-4 text-gray-700 w-full h-full text-center">
      <Icon type="Alert" size={28} />
      <p>데이터를 불러오는데 실패했습니다</p>
      <p>잠시 후 다시 시도해주세요</p>
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
