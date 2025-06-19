/** 면접 설정 페이지에서 사용되는 타입 */

import type { RoleType } from "./role";

// 질문/답변 구조
export interface Question {
  question: string;
  answer: string;
}

// 인터뷰 개별 시간 슬롯
export interface TimeSlot {
  time: string; // 예: "13:00"
  available: boolean; // 선택 가능 여부
  selected?: boolean; // 실제 선택한 경우만 true
}

// 인터뷰 날짜별 슬롯 묶음
export interface InterviewSlot {
  date: string;
  slots: TimeSlot[];
}

// 지원서 전체 구조
export interface Resume {
  resumeId: string;
  name: string;
  field: string; // 분야
  gender: string; // 성별
  birthDate: string;
  school: string;
  contact: string;
  email: string;
  major: string;
  subMajor: string;
  partQuestions: Question[];
  commonQuestions: Question[];
}

type TotalDateTimeDto = {
  dateList: string[];
  timeList: string[];
  dateListSize: number;
  timeListSize: number;
};

type MemberDto = {
  interviewFinalId: number;
  field: RoleType;
  username: string;
  interviewDate: string;
  interviewTime: string;
  memberId: number;
  resumeId: number;
};

type GroupByTimeDto = {
  groupByTime: string;
  memberDtoList: MemberDto[];
};
export type TimeTableList = {
  groupByDay: string;
  dayName: string;
  groupByTimeDtoList: GroupByTimeDto[];
};

interface TimeTable {
  totalDateTimeDto: TotalDateTimeDto;
  timetableList: TimeTableList[];
}
