export interface SettingDefaultResponse {
  result: SettingBody;
}

export interface SettingBody {
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



export interface FinalPassResult {
  totalFee: number;
  clubFee: number;
  mtFee: number;
  feeDeadline: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  surveyLink: string;
  surveyDeadline: string;
  otLink: string;
  otPassword: string;
  otDeadline: string;
}

export interface SettingFinalPassResponse {
  time: string;
  status: number;
  code: string;
  message: string;
  result: FinalPassResult;
}


