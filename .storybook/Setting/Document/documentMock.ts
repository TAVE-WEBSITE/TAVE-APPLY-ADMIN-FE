import { http, HttpResponse } from "msw";
import {
  designQuestions,
  webFrontQuestions,
  appFrontQuestions,
  backendQuestions,
  dataAnalysisQuestions,
  deepLearningQuestions,
  commonQuestions,
} from "./documentData";

// API 핸들러들
const getCommonQuestions = http.get("/api/setting/document/COMMON", () => {
  return HttpResponse.json(commonQuestions, { status: 200 });
});
const getDesignQuestions = http.get("/api/setting/document/DESIGN", () => {
  return HttpResponse.json(designQuestions, { status: 200 });
});

const getWebFrontQuestions = http.get(
  "/api/setting/document/WEBFRONTEND",
  () => {
    return HttpResponse.json(webFrontQuestions, { status: 200 });
  }
);

const getAppFrontQuestions = http.get(
  "/api/setting/document/APPFRONTEND",
  () => {
    return HttpResponse.json(appFrontQuestions, { status: 200 });
  }
);

const getBackendQuestions = http.get("/api/setting/document/BACKEND", () => {
  return HttpResponse.json(backendQuestions, { status: 200 });
});

const getDataAnalysisQuestions = http.get(
  "/api/setting/document/DATAANALYSIS",
  () => {
    return HttpResponse.json(dataAnalysisQuestions, { status: 200 });
  }
);

const getDeepLearningQuestions = http.get(
  "/api/setting/document/DEEPLEARNING",
  () => {
    return HttpResponse.json(deepLearningQuestions, { status: 200 });
  }
);

export {
  getCommonQuestions,
  getDesignQuestions,
  getWebFrontQuestions,
  getAppFrontQuestions,
  getBackendQuestions,
  getDataAnalysisQuestions,
  getDeepLearningQuestions,
};
