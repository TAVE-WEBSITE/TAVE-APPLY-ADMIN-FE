import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import FlexBox from "@/components/Layout/FlexBox";
import CountCard from "@/components/Card/CountCard";
import DonutChart from "@/components/Chart/DonutChart";
import Modal from "@/components/Modal/Modal";
import { formatDateTime } from "@/utils/formatDate";
import SkeletonDonutChart from "@/components/Chart/SkeletonUI/SkeletonDonutChart";
import { useDashBoard } from "@/hooks/DashBoard/useDashBoard";
import { useQuery } from "@tanstack/react-query";
import { fetchSettingDefault } from "@/pages/Setting/api/Default";

export const Page = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const {
    genderQuery: {
      data: genderData,
      isLoading: isGenderLoading,
      isError: isGenderError,
    },
    skillQuery: {
      data: skillData,
      isLoading: isSkillLoading,
      isError: isSkillError,
    },
    dashboardQuery: {
      data: dashboardData,
      isLoading: isDashboardLoading,
    }
  } = useDashBoard();

  // 기본 설정 데이터 조회
  const { data: defaultSettingData } = useQuery({
    queryKey: ["setting", "default"],
    queryFn: fetchSettingDefault,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const calculateSum = () => {
    if (genderData) return genderData.reduce((a, b) => a + b.count, 0);
    return 0;
  };

  // 날짜 표시 로직
  const getDateDisplay = () => {
    if (isBeforeRecruitment()) {
      return "모집 시작 전";
    }
    return formatDateTime(new Date().toISOString()) + " 기준";
  };

  // 모집 시작 전 여부 확인
  const isBeforeRecruitment = () => {
    if (!defaultSettingData?.result?.documentRecruitStartDate) {
      return true;
    }

    const currentDate = new Date();
    const documentStartDate = new Date(defaultSettingData.result.documentRecruitStartDate);
    
    return currentDate < documentStartDate;
  };

  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <h1 className="font-bold text-4xl">DashBoard</h1>
        <FlexBox className="w-full justify-between">
          <h2 className="font-semibold text-xl">16기 지원 현황</h2>
          <p className="text-gray-500">
            {getDateDisplay()}
          </p>
        </FlexBox>
      </FlexBox>

      <section className="min-h-[calc(100vh-244px)] bg-gray-100 flex flex-col gap-8">
        <FlexBox className="w-full pt-8 justify-center gap-4">
          {isDashboardLoading || isBeforeRecruitment() ? (
            <CountCard text="현재 지원자수" boxColor="blue" count={"-"} />
          ) : (
            <CountCard
              text="현재 지원자수"
              boxColor="blue"
              count={dashboardData?.totalCount ?? 0}
            />
          )}
          {isDashboardLoading || isBeforeRecruitment() ? (
            <CountCard text="전 기수 대비" boxColor="green" count={"-"} />
          ) : (
            <CountCard text="전 기수 대비" boxColor="green" count={`${dashboardData?.comparisonRatio ?? 0}%`} />
          )}
          {isDashboardLoading || isBeforeRecruitment() ? (
            <CountCard text="임시 저장 수" boxColor="orange" count={"-"} />
          ) : (
            <CountCard text="임시 저장 수" boxColor="orange" count={dashboardData?.temperCount ?? 0} />
          )}
        </FlexBox>

        <FlexBox className="justify-center gap-4">
          <div className="bg-white rounded-xl px-4 py-5 justify-between w-[640px] border border-gray-200">
            {isGenderLoading || isGenderError || isBeforeRecruitment() ? (
              <SkeletonDonutChart />
            ) : (
              genderData && (
                <DonutChart
                  data={genderData}
                  title="남녀 비율"
                  colors={["#4F46E5", "#EC4899"]}
                />
              )
            )}
          </div>
          <div className="bg-white rounded-xl px-4 py-5 justify-between w-[640px] border border-gray-200">
            {isSkillLoading || isSkillError || isBeforeRecruitment() ? (
              <SkeletonDonutChart />
            ) : (
              skillData && (
                // 파트 컬러 추가
                <DonutChart
                  data={skillData}
                  title="파트별 비율"
                  colors={[
                    "#4F46E5",
                    "#EC4899",
                    "#F97316",
                    "#EAB308",
                    "#10B981",
                    "#B744ED"
                  ]}
                />
              )
            )}
          </div>
        </FlexBox>
        <Modal
          dialogRef={dialogRef}
          defaultOpen={true}
          title="신규 지원 초기 설정"
          buttonCount={1}
          confirmText="설정하러 가기"
          onConfirm={() => navigate("/setting/default")}
        >
          <p className="text-center text-gray-500">
            안녕하세요, {sessionStorage.getItem("username") && sessionStorage.getItem("username")} 회장님!
            <br /> 기수 지원 관리 페이지에 오신 것을
            환영합니다. <br /> <br /> 15기 모집이 종료된 지, 147일이 지났습니다.{" "}
            <br /> 다음 기수 모집을 시작하기 전, 초기 설정 부탁드립니다.
          </p>
        </Modal>
      </section>
    </div>
  );
};
