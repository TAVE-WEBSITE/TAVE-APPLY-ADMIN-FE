import Chip from "@/components/Chip/Chip";
import type { TimeTableList } from "@/types/interview";
import { formatKorDate } from "@/utils/formatDate";
import { useNavigate } from "react-router-dom";

interface TimeTableProps {
  timeTable: TimeTableList[];
  onCellClick?: (date: string, time: string) => void;
}

const TimeTable = ({ timeTable, onCellClick }: TimeTableProps) => {
  const navigate = useNavigate();

  // timeTable이 없거나 빈 배열인 경우 처리
  if (!timeTable || timeTable.length === 0) {
    return (
      <div className="w-full h-full rounded-xl bg-[#F3F4F6] flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <p>면접 일정이 없습니다.</p>
        </div>
      </div>
    );
  }

  // 모든 시간대를 추출하여 정렬
  const getAllTimeSlots = () => {
    const timeSlots = new Set<string>();
    timeTable.forEach((day) => {
      day.groupByTimeDtoList.forEach((timeGroup) => {
        timeSlots.add(timeGroup.groupByTime);
      });
    });
    return Array.from(timeSlots).sort();
  };

  // 특정 날짜와 시간에 해당하는 멤버 리스트 찾기
  const getMembersForDateTime = (date: string, time: string) => {
    const dayData = timeTable.find((day) => day.groupByDay === date);
    if (!dayData) return [];

    const timeGroup = dayData.groupByTimeDtoList.find(
      (group) => group.groupByTime === time
    );
    return timeGroup?.memberDtoList || [];
  };

  const timeSlots = getAllTimeSlots();

  return (
    <table className="w-full h-full rounded-xl bg-[#F3F4F6] table-fixed">
      <thead>
        <tr className="border-b border-gray-300">
          <th className="p-4 text-left font-medium border-r border-r-gray-300 text-gray-700 w-24">
            시간
          </th>
          {timeTable.map((day) => (
            <th
              key={day.groupByDay}
              className="text-center font-semibold text-gray-700 border-r border-gray-300 last:border-r-0"
            >
              {formatKorDate(day.groupByDay)} ({day.dayName[0]})
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map((timeSlot) => {
          // 현재 시간이 timeSlot과 같은지 체크
          const now = new Date();
          const nowHour = now.getHours();
          const nowMinute = now.getMinutes();
          const [slotHour, slotMinute] = timeSlot.split(":").map(Number);
          const isCurrent = nowHour === slotHour && nowMinute >= 0 && nowMinute < 60;
          // 이미 지난 시간인지 체크
          // day.groupByDay는 yyyy-mm-dd 형식, now는 Date 객체
          // 각 day에 대해 아래에서 처리
          return (
          <tr
            key={timeSlot}
            className="border-b border-gray-300 last:border-b-0 text-gray-900 font-semibold"
          >
              <td
                className={`p-4 text-center border-r border-gray-300 align-top hover:bg-blue-100 hover:text-blue-600 cursor-pointer w-24
                  ${isCurrent ? 'bg-blue-100 border-l-4 border-l-blue-600 text-blue-600' : ''}`}
              >
              {timeSlot}
            </td>
            {timeTable.map((day) => {
              const members = getMembersForDateTime(day.groupByDay, timeSlot);
                // day.groupByDay: yyyy-mm-dd
                const [year, month, dayNum] = day.groupByDay.split('-').map(Number);
                const slotDate = new Date(year, month - 1, dayNum, slotHour, slotMinute);
                const isPast = now > slotDate;
              return (
                <td
                  key={`${day.groupByDay}-${timeSlot}`}
                    onClick={() => {
                      if (onCellClick) onCellClick(day.groupByDay, timeSlot);
                      navigate(`/evaluation/interview/${day.groupByDay}`);
                    }}
                    className={`border-r border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer ${isPast ? 'bg-gray-100' : ''}`}
                >
                  <div className="p-2 h-full min-h-[160px] max-h-[200px] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-1">
                      {members.map((member) => (
                        <div
                          key={member.memberId}
                            className="flex flex-col items-start gap-1 border border-gray-300 rounded-lg p-2 hover:border-t-2 hover:border-blue-500 hover:border-t-blue-500 hover:bg-white hover:shadow-sm text-sm"
                        >
                          <span className="font-semibold text-xs truncate w-full">
                            {member.username}
                          </span>
                          <Chip title={member.field} />
                        </div>
                      ))}
                    </div>
                  </div>
                </td>
              );
            })}
          </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TimeTable;
