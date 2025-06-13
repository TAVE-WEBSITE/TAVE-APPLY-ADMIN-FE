import { http, HttpResponse, delay } from "msw";
import type { ChartData, ChartDataWithCount } from "@/types/chart";
import {
  settingHandler,
  postSettingDefault,
} from "@/api/msw/Setting/defaultMock";
import {
  getAllInterviewers,
  getSingleInterviewer,
  postInterviewDate,
  postFile,
} from "./Setting/interviewMock";
import {
  getAppFrontQuestions,
  getWebFrontQuestions,
  getBackendQuestions,
  getDataAnalysisQuestions,
  getDeepLearningQuestions,
  getDesignQuestions,
  getCommonQuestions,
} from "./Setting/documentMock";
import {
  getNotificationList,
  postReservation,
  postIndividualReservation,
} from "./ApplyList/notification";
import { getEvalutionList, getFinalEvaluationList } from "./Evalution/Document";

const genderData: ChartDataWithCount[] = [
  { label: "남성", ratio: 75, count: 34 },
  { label: "여성", ratio: 25, count: 11 },
];

const skillData: ChartData[] = [
  { label: "프론트", ratio: 35 },
  { label: "백엔드", ratio: 25 },
  { label: "디자인", ratio: 20 },
  { label: "데브옵스", ratio: 13 },
  { label: "AI", ratio: 7 },
];

export const handlers = [
  http.get("/api/chart-data", async ({ request }) => {
    // URL에서 type 파라미터 추출
    const url = new URL(request.url);
    const type = url.searchParams.get("type");

    // // 10% 확률로 에러 발생
    // if (Math.random() < 0.1) {
    //   return new HttpResponse(null, {
    //     status: 500,
    //     statusText: "Internal Server Error",
    //   });
    // }

    await delay(1000);
    // type에 따라 데이터 반환
    switch (type) {
      case "gender":
        return HttpResponse.json(genderData);
      case "skill":
        return HttpResponse.json(skillData);
      default:
        return new HttpResponse(null, {
          status: 400,
          statusText: "Bad Request: Invalid type parameter",
        });
    }
  }),
  settingHandler,
  postSettingDefault,
  getAllInterviewers,
  getSingleInterviewer,
  postInterviewDate,
  postFile,
  // ApplyList 관련
  getNotificationList,
  postReservation,
  postIndividualReservation,
  // 여기부터 SETTING/서류설정 관련
  getCommonQuestions,
  getAppFrontQuestions,
  getWebFrontQuestions,
  getBackendQuestions,
  getDataAnalysisQuestions,
  getDeepLearningQuestions,
  getDesignQuestions,
  // 여기부터 EVALUTION/서류평가 관련
  getEvalutionList,
  getFinalEvaluationList,
];
