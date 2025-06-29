import { axiosInstance } from "@/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import type { ChartData, ChartDataWithCount } from "@/types/chart";

export const useDashBoard = () => {
  const fetchChartData = async (type: string) => {
    try {
      const res = await axiosInstance.get(`/api/chart-data?type=${type}`);
      return res.data;
    } catch (error) {
      console.error(`Failed to fetch chart data`, error);
      throw error;
    }
  };

  const genderQuery = useQuery<ChartDataWithCount[]>({
    queryKey: ["chart-data", "gender"],
    queryFn: () => fetchChartData("gender"),
  });

  const skillQuery = useQuery<ChartData[]>({
    queryKey: ["chart-data", "skill"],
    queryFn: () => fetchChartData("skill"),
  });

  return {
    genderQuery,
    skillQuery,
  };
};
