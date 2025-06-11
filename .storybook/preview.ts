import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";
import "../src/index.css";
import {
  getCommonQuestions,
  getDesignQuestions,
  getWebFrontQuestions,
  getAppFrontQuestions,
  getBackendQuestions,
  getDataAnalysisQuestions,
  getDeepLearningQuestions,
} from "./Setting/Document/documentMock";
import {
  getNotificationList,
  postReservation,
  postIndividualReservation,
} from "./ApplyList/Notification";
import {
  getAllInterviewers,
  getSingleInterviewer,
} from "./ApplyList/ApplyList";

initialize({
  onUnhandledRequest: "bypass",
  serviceWorker: {
    url:
      process.env.NODE_ENV === "development"
        ? "/mockServiceWorker.js"
        : "./mockServiceWorker.js",
  },
});

const preview: Preview = {
  parameters: {
    actions: {},
    msw: {
      handlers: [
        getCommonQuestions,
        getDesignQuestions,
        getWebFrontQuestions,
        getAppFrontQuestions,
        getBackendQuestions,
        getDataAnalysisQuestions,
        getDeepLearningQuestions,
        // 알림 신청 명단 페이지 관련
        getNotificationList,
        postReservation,
        postIndividualReservation,
        // 지원 명단 조회 페이지 관련
        getAllInterviewers,
        getSingleInterviewer,
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  loaders: [mswLoader],
};

export default preview;
