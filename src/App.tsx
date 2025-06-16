import { Routes, Route, HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Page as DashBoard } from "@/pages/DashBoard";
import { Page as ApplyList } from "@/pages/ApplyList";
import ApplyListDetail from "./pages/ApplyList/Detail";
import {
  DefaultSetting,
  DocumentSetting,
  FinalPassSetting,
} from "./pages/Setting";
import InterviewSetting from "./pages/Setting/Interview";
import InterviewSettingDetail from "./pages/Setting/Interview/Detail";
import {
  EvaluationDocument,
  EvaluationInterview,
  FinalEvaluationDocument,
  EvaluationDetail,
  FinalEvaluationDetail,
} from "@/pages/Evaluation";
import Header from "@/components/Header/Header";

function App() {
  const queryClient = new QueryClient();
  const redirectionList = ["DASHBOARD", "APPLY LIST", "SETTING", "EVALUTION"];

  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <div className="h-screen bg-[#121826]">
          <Header redirectionList={redirectionList} />
          <main className="h-[calc(100vh-112px)]">
            <Routes>
              <Route path="/" element={<DashBoard />} />
              <Route path="/applies" element={<ApplyList />} />
              <Route path="/applies/:id" element={<ApplyListDetail />} />
              <Route path="/setting/default" element={<DefaultSetting />} />
              <Route path="/setting/document" element={<DocumentSetting />} />
              <Route path="/setting/interview" element={<InterviewSetting />} />
              <Route
                path="/setting/interview/:id"
                element={<InterviewSettingDetail />}
              />
              <Route path="/setting/final" element={<FinalPassSetting />} />
              <Route
                path="/evaluation/document"
                element={<EvaluationDocument />}
              />
              <Route
                path="/evaluation/document/:id"
                element={<EvaluationDetail />}
              />
              <Route
                path="/evaluation/document/final"
                element={<FinalEvaluationDocument />}
              />
              <Route
                path="/evaluation/document/final/:id"
                element={<FinalEvaluationDetail />}
              />
              <Route
                path="/evaluation/interview"
                element={<EvaluationInterview />}
              />
            </Routes>
          </main>
        </div>
      </HashRouter>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
