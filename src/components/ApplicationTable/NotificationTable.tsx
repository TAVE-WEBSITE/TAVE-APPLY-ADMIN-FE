import Pagination from "../Pagination/Pagination";
import Icon from "@/components/Icon/Icon";
import InterviewersLoading from "@/pages/Setting/Loading/InterviewersLoading";
import type { NotificationItem } from "@/types/applylist";
import { formatDateTime } from "@/utils/formatDate";

interface NotificationTableProps {
  rows: string[];
  applications: NotificationItem[] | null;
  isLoading?: boolean;
  totalPages: number | undefined;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onClick: (id: string | number) => Promise<any>;
}

const NotificationTable = ({
  rows,
  applications,
  isLoading = false,
  totalPages,
  currentPage,
  setCurrentPage,
  onClick,
}: NotificationTableProps) => {
  const itemsPerPage = 7;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    applications && applications.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
  };

  console.log(applications);

  return (
    <div className="w-full overflow-x-auto pb-8">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden h-[670px]">
        <table className="border-separate border-spacing-0 table-auto w-full">
          <thead className="bg-white">
            <tr className="rounded-t-xl overflow-hidden">
              {rows.map((e) => (
                <th
                  key={e}
                  className="w-1/3 px-6 py-6 text-left text-gray-600 text-sm font-bold border-b border-gray-200"
                >
                  {e}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {isLoading && <InterviewersLoading />}
            {currentItems ? (
              currentItems.map((applicant) => (
                <tr key={applicant.id} className={`border-b border-gray-200`}>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 justify-start text-gray-700 text-base font-medium">
                    {applicant.email}
                  </td>
                  <td className="px-6 p-4 whitespace-nowrap border-b border-gray-200 justify-start text-gray-700 text-base font-medium">
                    {formatDateTime(applicant.date)}
                  </td>
                  <td className="px-6 p-4 whitespace-nowrap border-b border-gray-200 justify-start text-gray-700 text-base font-medium">
                    <button
                      className="py-2 px-3 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-100 flex items-center cursor-pointer"
                      onClick={() => onClick(applicant.id)}
                    >
                      오픈 메일 전송
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="h-[500px]">
                <td colSpan={6}>
                  <div className="flex flex-col justify-center items-center gap-4 p-4 text-gray-700 w-full h-full">
                    <Icon type="Alert" size={28} />
                    데이터를 불러오는데 실패했습니다
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

export default NotificationTable;
