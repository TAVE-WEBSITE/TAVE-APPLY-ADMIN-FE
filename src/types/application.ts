export type ApplicationType =
  | "알림 신청"
  | "지원서"
  | "서류 평가"
  | "면접 설정"
  | "최종 서류 평가";

export type Status =
  | "ALL"
  | "FAIL"
  | "PASS"
  | "HOLD"
  | "NOTCHECKED"
  | "COMPLETE";

type Application = {
  id: string;
  name: string;
  fieldType: string;
  sex: string;
  school: string;
};

export type NotificationItem = {
  id: string;
  email: string;
  date: string;
};

export type EvaluationItem = Application & {
  recruitTime: string;
  isEvaluated: boolean;
};

export type FinalEvaluationItem = Application & {
  recruitTime: string;
  count: number;
  status: ApplicationType;
};

export type InterviewItem = Application & {
  interviewTime: string;
};

export type PageData = {
  page: {
    size: number;
    number: any;
    totalElements: number;
    totalPages: number;
  };
};

const isNotificationItem = (item: any): item is NotificationItem => {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof item.id === "string" &&
    typeof item.email === "string" &&
    typeof item.date === "string"
  );
};

const isInterviewItem = (item: any): item is InterviewItem => {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.fieldType === "string" &&
    typeof item.sex === "string" &&
    typeof item.school === "string" &&
    typeof item.interviewTime === "string"
  );
};
const isEvaluationItem = (item: any): item is EvaluationItem => {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.fieldType === "string" &&
    typeof item.sex === "string" &&
    typeof item.school === "string" &&
    typeof item.recruitTime === "string" &&
    typeof item.isEvaluated === "boolean"
  );
};

const isFinalEvaluationItem = (item: any): item is FinalEvaluationItem => {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.fieldType === "string" &&
    typeof item.sex === "string" &&
    typeof item.school === "string" &&
    typeof item.recruitTime === "string" &&
    typeof item.count === "number" &&
    item.status !== null
  );
};
export {
  isNotificationItem,
  isEvaluationItem,
  isFinalEvaluationItem,
  isInterviewItem,
};
