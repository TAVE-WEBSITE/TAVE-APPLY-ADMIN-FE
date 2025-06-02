export interface SettingDefaultResponse {
  generation: string;
  documentRecruitStartDate: string;
  documentRecruitEndDate: string;
  documentAnnouncementDate: string;
  interviewStartDate: string;
  interviewEndDate: string;
  lastAnnouncementDate: string;
  accessStartDate: string;
  accessEndDate: string;
}

export interface SettingDefaultErrorResponse {
  code: number;
  message: string;
  data: null;
}
