import Chip from "@/components/Chip/Chip";
import type { TimeTableList } from "@/types/interview";
import { formatKorDate } from "@/utils/formatDate";
import { useNavigate } from "react-router-dom";

interface TimeTableProps {
  timeTable: TimeTableList[];
}

const TimeTable = ({ timeTable }: TimeTableProps) => {
  const navigate = useNavigate();

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
    <table className="w-full h-full rounded-xl bg-[#F3F4F6]">
      <thead>
        <tr className="border-b border-gray-300">
          <th className="w-20 p-4 text-left font-medium border-r border-r-gray-300 text-gray-700">
            시간
          </th>
          {timeTable.map((day) => (
            <th
              key={day.groupByDay}
              className="p-4 text-center font-semibold text-gray-700 border-r border-gray-300 last:border-r-0"
            >
              {formatKorDate(day.groupByDay)} ({day.dayName[0]})
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map((timeSlot) => (
          <tr
            key={timeSlot}
            className="border-b border-gray-300 last:border-b-0 text-gray-900 font-semibold"
          >
            <td className="w-20 p-4 text-center border-r border-gray-300 align-top">
              {timeSlot}
            </td>
            {timeTable.map((day) => {
              const members = getMembersForDateTime(day.groupByDay, timeSlot);
              return (
                <td
                  key={`${day.groupByDay}-${timeSlot}`}
                  onClick={() =>
                    navigate(`/evaluation/interview/${day.groupByDay}`)
                  }
                  className="border-r border-gray-300 w-1/4 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="p-2 h-full min-h-[120px]">
                    <div className="grid grid-cols-2 gap-2 p-2">
                      {members.map((member) => (
                        <div
                          key={member.memberId}
                          className="flex flex-col items-start gap-2 border border-gray-300 rounded-xl p-3"
                        >
                          <span className="font-semibold">
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
        ))}
      </tbody>
    </table>
  );
};

export default TimeTable;
