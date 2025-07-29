import { RoleType } from "./role";

type DocumentType =
  | "COMMON"
  | "DESIGN"
  | "WEBFRONTEND"
  | "APPFRONTEND"
  | "BACKEND"
  | "DATAANALYSIS"
  | "DEEPLEARNING";

type DocumentKey = RoleType | "공통 질문";

export type { DocumentType, DocumentKey };
