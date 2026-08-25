import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Body from "@/components/Layout/Body";
import FlexBox from "@/components/Layout/FlexBox";
import { formatDateTime } from "@/utils/formatDate";
import { getInterviewTimeTable, getTimeTableForm, getSheet } from "./api";
import type { TimeTableList } from "@/types/interview";
import TimeTable from "@/components/TimeTable";
import Button from "@/components/Button/Button";
import Icon from "@/components/Icon/Icon";
import { fetchList } from "@/api/fetchList";
import { fetchSettingDefault } from "@/pages/Setting/api/Default";

const Interview = () => {
  const navigate = useNavigate();
  const [timeTable, setTimeTable] = useState<TimeTableList[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isPending2, setIsPending2] = useState(false);
  const { data: defaultSettingData } = useQuery({
    queryKey: ["setting", "default"],
    queryFn: fetchSettingDefault,
    staleTime: 1000 * 60 * 60 * 24,
  });
  const generation = defaultSettingData?.result?.generation;

  useEffect(() => {
    const fetcher = async () => {
      if (!generation) return;
      const res = await getInterviewTimeTable(generation);
      setTimeTable(res?.result?.timetableList);
    };
    fetcher();
  }, [generation]);

  const downloadTimeTableForm = async () => {
    setIsPending(true);
    await getTimeTableForm();
    setIsPending(false);
  };

  const downloadSheet = async () => {
    setIsPending2(true);
    await getSheet();
    setIsPending2(false);
  };

  const handleCellClick = async (date: string, time: string) => {
    const data = await fetchList("면접 현황", { date, time });
    const count = data?.result?.resumeList?.length ?? 0;
    navigate(`/evaluation/interview/${date}`, {
      state: { date, time, count }
    });
    console.log(date, time, count);
  };

  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <h1 className="font-bold text-4xl">
          {generation ? `${generation}기 ` : ""}면접 현황
        </h1>
        <FlexBox className="w-full justify-between">
          <p className="text-gray-500">
            {formatDateTime(new Date().toISOString()) + " 기준"}
          </p>
          <div
            className="text-lg text-gray-300 bg-blue-600 px-4 py-2 rounded-lg font-semibold cursor-pointer"
            onClick={() => navigate("/evaluation/interview/final")}
          >
            최종 면접 평가하기
          </div>
        </FlexBox>
      </FlexBox>
      <Body className="pt-8 gap-8">
        <FlexBox className="justify-between w-full max-w-[1400px] rounded-xl border border-gray-300 mx-auto overflow-hidden">
          <TimeTable timeTable={timeTable} onCellClick={handleCellClick} />
        </FlexBox>
        <FlexBox className="mx-auto gap-4 justify-center pb-12">
          <Button
           isPending={isPending2}
            onClick={() => downloadSheet()}
            className="bg-gray-300 w-64"


          >
            <Icon type={"DownLoad"} size={18} />
            <span className="text-gray-900">면접 평가 시트 다운로드</span>
          </Button>
          <Button
            className="w-64"
            isPending={isPending}
            onClick={() => downloadTimeTableForm()}
          >
            <Icon type={"DownLoad2"} size={18} />
            면접 시간표 다운로드
          </Button>
        </FlexBox>
      </Body>
    </div>
  );
};

export default Interview;
