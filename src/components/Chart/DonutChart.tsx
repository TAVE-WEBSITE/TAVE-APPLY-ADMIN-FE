import { useState } from "react";
import { createPath, getTextPosition } from "@/utils/chart";
import FlexBox from "../Layout/FlexBox";
import CenterContent from "./CenterContent";
import { isChartDataWithCount } from "@/types/chart";

export interface DonutChartProps<T> {
  title?: string;
  data: T[];
  colors: string[];
}

const DonutChart = ({ title, data = [], colors }: DonutChartProps<any>) => {
  const [selectedSegment, setSelectedSegment] = useState(null);

  const handleSegmentClick = (index: any) => {
    setSelectedSegment(selectedSegment === index ? null : index);
  };

  const renderChart = () => {
    let currentAngle = 0;

    return data.map((item, index) => {
      const angle = (item.ratio / 100) * 360;
      const path = createPath(
        currentAngle,
        currentAngle + angle,
        60,
        100,
        selectedSegment === index
      );
      const midAngle = currentAngle + angle / 2;
      const textPos = getTextPosition(midAngle, selectedSegment === index);

      currentAngle += angle;

      return (
        <g key={index} className="block">
          <path
            d={path}
            fill={colors[index]}
            style={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              filter: selectedSegment === index ? "brightness(1.1)" : "none",
            }}
            onClick={() => handleSegmentClick(index)}
          />
          {/* 연결선 */}
          <line
            x1={textPos.lineStart.x}
            y1={textPos.lineStart.y}
            x2={textPos.lineEnd.x}
            y2={textPos.lineEnd.y}
            stroke="#6B7280"
            strokeWidth="1"
            style={{ transition: "all 0.3s ease" }}
          />
          <text
            x={textPos.text.x}
            y={textPos.text.y}
            textAnchor={textPos.text.x > 200 ? "start" : "end"}
            dominantBaseline="middle"
            fill="#111827"
            fontSize="12"
            fontWeight="600"
            style={{ pointerEvents: "none", transition: "all 0.3s ease" }}
          >
            {item.topic} ({Math.round(item.ratio)}%)
          </text>
        </g>
      );
    });
  };

  return (
    <FlexBox direction="col" className="py-4">
      <h1 className="text-lg font-bold text-gray-800">{title}</h1>

      <FlexBox direction="col">
        {/* 도넛 차트 */}
        <FlexBox className="relative justify-center mb-6">
          <>
            <svg width="400" height="400" style={{ display: "block" }}>
              {renderChart()}
            </svg>
            {/* 차트 가운데 컨텐츠 */}
            <FlexBox className="absolute inset-0 justify-center">
              {data[0] &&
                isChartDataWithCount(data[0]) &&
                CenterContent({ data, selectedSegment })}
            </FlexBox>
          </>
        </FlexBox>

        <FlexBox className="gap-1">
          {data.map((item, index) => (
            <button
              key={index}
              className={`flex items-center gap-1 p-3 rounded-lg cursor-pointer transition-all ${
                selectedSegment === index
                  ? "bg-blue-50 scale-103"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleSegmentClick(index)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index] }}
              ></div>
              <span className="text-gray-700 text-sm font-medium whitespace-nowrap">
                {item.topic}
              </span>
            </button>
          ))}
        </FlexBox>
      </FlexBox>
    </FlexBox>
  );
};

export default DonutChart;
