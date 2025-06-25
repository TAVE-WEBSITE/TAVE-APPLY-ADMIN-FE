import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import { startMSW } from "./api/msw/browser";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
// // MSW 시작 후 앱 렌더링
// const prepare = async () => {
//   // 개발 환경에서만 MSW 실행
//   if (import.meta.env.DEV) {
//     await startMSW();
//   }

//   createRoot(document.getElementById("root")!).render(
//     <StrictMode>
//       <App />
//     </StrictMode>
//   );
// };

// prepare();
