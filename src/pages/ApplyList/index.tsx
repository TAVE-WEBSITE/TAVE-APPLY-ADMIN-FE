import FlexBox from "@/components/Layout/FlexBox";
import Apply from "./Apply";
import Notification from "./Notification";

type ApplyListPages = "알림 신청 명단" | "지원 명단";

const applyListPageMap: Record<ApplyListPages, React.ComponentType> = {
  "알림 신청 명단": Notification,
  "지원 명단": Apply,
};

const isRecruiting: boolean = false;
const CurrentPage = isRecruiting
  ? applyListPageMap["지원 명단"]
  : applyListPageMap["알림 신청 명단"];

export const Page = () => {
  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <h1 className="font-bold text-4xl">
          {isRecruiting ? "16기 지원서 명단" : "다음 기수 알림 신청 명단"}
        </h1>
        <p className="text-gray-500">2025.08.11 14:00 기준</p>
      </FlexBox>
      <section className="min-h-[calc(100vh-244px)] bg-gray-100 flex flex-col gap-8">
        <CurrentPage />
      </section>
    </div>
  );
};
