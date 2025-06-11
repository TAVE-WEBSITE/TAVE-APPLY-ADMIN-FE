import type { ButtonHTMLAttributes } from "react";

export interface TimeSlotButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  time: string;
  isSelected: boolean;
  onClick?: () => void;
}

// 시간대 버튼 컴포넌트
const TimeSlotButton = ({
  time,
  isSelected,
  onClick,
  disabled,
}: TimeSlotButtonProps) => {
  return (
    <button
      className={`
        w-18 h-10 rounded-lg text-center text-md border border-gray-300 ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }
        ${
          isSelected
            ? "text-blue-500 bg-blue-100 font-semibold"
            : "bg-white text-gray-500"
        } 
      `}
      onClick={onClick}
    >
      {time}
    </button>
  );
};

export default TimeSlotButton;
