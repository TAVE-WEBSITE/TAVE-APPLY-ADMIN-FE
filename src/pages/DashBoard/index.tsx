import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import FlexBox from "@/components/Layout/FlexBox";
import CountCard from "@/components/Card/CountCard";
import DonutChart from "@/components/Chart/DonutChart";
import Modal from "@/components/Modal/Modal";
import { formatDateTime } from "@/utils/formatDate";
import SkeletonDonutChart from "@/components/Chart/SkeletonUI/SkeletonDonutChart";
import { useDashBoard } from "@/hooks/DashBoard/useDashBoard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSettingDefault } from "@/pages/Setting/api/Default";
import { axiosInstance } from "@/api/axiosInstance";

// 대시보드 업데이트 API 함수
const updateDashboard = async () => {
  const response = await axiosInstance.post("/v1/manager/dashboard");
  return response.data;
};

export const Page = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
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

  // 대시보드 업데이트 mutation
  const updateDashboardMutation = useMutation({
    mutationFn: updateDashboard,
    onSuccess: async () => {
      console.log("대시보드 업데이트 완료");
      
      // POST 요청 성공 후 GET 요청으로 최신 데이터 조회
      try {
        await queryClient.refetchQueries({ queryKey: ["chart-data", "dashboard"] });
        await queryClient.refetchQueries({ queryKey: ["chart-data", "gender"] });
        await queryClient.refetchQueries({ queryKey: ["chart-data", "skill"] });
        console.log("대시보드 데이터 재조회 완료");
      } catch (error) {
        console.error("대시보드 데이터 재조회 실패:", error);
      }
    },
    onError: (error) => {
      console.error("대시보드 업데이트 실패:", error);
    }
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

  // 대시보드 업데이트 핸들러
  const handleDashboardUpdate = () => {
    updateDashboardMutation.mutate();
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
            <CountCard text="전 기수 대비" boxColor="green" count={`${dashboardData?.comparisonRatio.toFixed(2) ?? 0}%`} />
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
        <button 
        className="mx-auto w-44 py-1 bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 disabled:bg-gray-400"
        onClick={handleDashboardUpdate}
        disabled={updateDashboardMutation.isPending}>
          {updateDashboardMutation.isPending ? "업데이트 중..." : "대시보드 업데이트"}
        </button>
                {(() => {
          // 기본 설정에 generation이 없으면 모달 표시
          if (defaultSettingData?.result?.generation) {
            return null;
          }

          // 최종 발표일이 있고, 현재 날짜가 최종 발표일로부터 100일이 지났으면 모달 표시
          if (defaultSettingData?.result?.lastAnnouncementDate) {
            const lastAnnouncementDate = new Date(defaultSettingData.result.lastAnnouncementDate);
            const currentDate = new Date();
            const daysDiff = Math.floor((currentDate.getTime() - lastAnnouncementDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysDiff >= 100) {
              return (
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
                    환영합니다. <br /> <br /> 15기 모집이 종료된 지, {daysDiff}일이 지났습니다.{" "}
                    <br /> 다음 기수 모집을 시작하기 전, 초기 설정 부탁드립니다.
                  </p>
                </Modal>
              );
            }
          }

          return null;
        })()}
      </section>
    </div>
  );
};
