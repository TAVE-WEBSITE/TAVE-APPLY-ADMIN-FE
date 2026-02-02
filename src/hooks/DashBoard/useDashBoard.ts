import { axiosInstance } from "@/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import type { ChartData, ChartDataWithCount } from "@/types/chart";

// 대시보드 API 응답 타입 정의
interface DashboardResponse {
  time: string;
  status: number;
  code: string;
  message: string;
  result: {
    totalCount: number;
    comparisonRatio: number;
    temperCount: number;
    sexRatioDtos: { topic: string; count: number; ratio: number }[];
    fieldRatioDtos: { topic: string; count: number; ratio: number }[];
  };
}

export const useDashBoard = () => {
  const fetchChartData = async (): Promise<DashboardResponse> => {
    try {
      const res = await axiosInstance.get(`/v1/manager/dashboard`);
      console.log("res", res);
      return res.data;
    } catch (error) {
      console.error(`Failed to fetch chart data`, error);
      throw error;
    }
  };

  const genderQuery = useQuery({
    queryKey: ["chart-data", "gender"],
    queryFn: fetchChartData,
    select: (data: DashboardResponse) => data.result.sexRatioDtos.map(item => ({
      label: item.topic,
      count: item.count,
      ratio: item.ratio
    })),
  });

  const skillQuery = useQuery({
    queryKey: ["chart-data", "skill"],
    queryFn: fetchChartData,
    select: (data: DashboardResponse) => data.result.fieldRatioDtos.map(item => ({
      label: item.topic,
      count: item.count,
      ratio: item.ratio
    })),
  });

  const dashboardQuery = useQuery({
    queryKey: ["chart-data", "dashboard"],
    queryFn: fetchChartData,
    select: (data: DashboardResponse) => ({
      totalCount: data.result.totalCount,
      comparisonRatio: data.result.comparisonRatio,
      temperCount: data.result.temperCount,
    }),
  });

  return {
    dashboardQuery,
    genderQuery,
    skillQuery,
  };
};
