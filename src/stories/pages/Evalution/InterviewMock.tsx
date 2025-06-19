import { useEffect, useState } from "react";
import Body from "@/components/Layout/Body";
import FlexBox from "@/components/Layout/FlexBox";
import { formatDateTime } from "@/utils/formatDate";
import {
  getInterviewTimeTable,
  getTimeTableForm,
  getSheet,
} from "@/api/Evaluation";
import type { TimeTableList } from "@/types/interview";
import TimeTable from "@/components/TimeTable";
import Button from "@/components/Button/Button";
import Icon from "@/components/Icon/Icon";

const InterviewMock = () => {
  const [timeTable, setTimeTable] = useState<TimeTableList[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isPending2, setIsPending2] = useState(false);

  useEffect(() => {
    const fetcher = async () => {
      const res = await getInterviewTimeTable(16);
      setTimeTable(res.result.timetableList);
    };
    fetcher();
  }, []);

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

  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <h1 className="font-bold text-4xl">16기 면접 현황</h1>
        <FlexBox className="w-full justify-between">
          <p className="text-gray-500">
            {formatDateTime(new Date().toISOString()) + " 기준"}
          </p>
          <div
            className="text-xl text-gray-300 underline cursor-pointer"
            onClick={() => {}}
          >
            최종 면접 평가하기
          </div>
        </FlexBox>
      </FlexBox>
      <Body className="pt-8 gap-8">
        <FlexBox className="justify-between w-[1320px] rounded-xl border border-gray-300 mx-auto">
          <TimeTable timeTable={timeTable} />
        </FlexBox>
        <FlexBox className="w-[1320px] mx-auto gap-4 justify-center pb-12">
          <Button
            isPending={isPending2}
            onClick={() => downloadSheet()}
            className="bg-gray-300 w-[220px]"
          >
            <Icon type={"DownLoad"} size={18} />
            <span className="text-gray-900">면접 평가 시트 다운로드</span>
          </Button>
          <Button
            className="w-[200px]"
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

export default InterviewMock;
