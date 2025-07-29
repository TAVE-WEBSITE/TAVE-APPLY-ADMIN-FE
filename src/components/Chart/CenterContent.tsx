import { isChartDataWithCount } from "@/types/chart";
import { getTotalCount } from "@/utils/chart";

interface CenterContentProps<T> {
  data: T[];
  selectedSegment: null | any;
  lastSelectedTopic?: string;
}

const CenterContent = ({ data, selectedSegment, lastSelectedTopic }: CenterContentProps<any>) => {
  if (selectedSegment !== null) {
    const selected = data[selectedSegment];
    return (
      <div className="text-center">
        <div className="text-gray-500 text-sm mb-1">{selected.topic}</div>
        <div className="text-xl font-bold text-gray-800">
          {isChartDataWithCount(selected)
            ? `${selected.count}명`
            : `${selected.ratio}%`}
        </div>
      </div>
    );
  }

  // 전체일 때 topic(마지막 선택된 segment의 topic) 표시
  return (
    <div className="text-center">
      <div className="text-gray-500 text-sm mb-1">전체</div>
      <div className="text-xl font-bold text-gray-800">
        {isChartDataWithCount(data[0]) ? `${getTotalCount(data)}명` : "100%"}
      </div>
      {lastSelectedTopic && (
        <div className="text-gray-400 text-xs mt-1">{lastSelectedTopic}</div>
      )}
    </div>
  );
};

export default CenterContent;
