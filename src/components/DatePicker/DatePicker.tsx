import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, SetStateAction } from "react";
import Icon from "@/components/Icon/Icon";
import DatePanel from "./DatePanel";

type CustomDatePickerProps = {
  state?: any;
  label?: string;
  description?: string;
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
  className?: string;
};

export default function DatePicker({
  state = "enable",
  label,
  description,
  value,
  setValue,
  className,
}: CustomDatePickerProps) {
  const [showPanel, setShowPanel] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    if (
      panelRef.current &&
      !panelRef.current.contains(document.activeElement)
    ) {
      setShowPanel(false);
    }
  };

  const handlePanelMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      panelRef.current &&
      !panelRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setShowPanel(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <button
      onClick={() => setShowPanel(!showPanel)}
      onKeyDown={(e) => e.key === "Enter" && setShowPanel(!showPanel)}
      className={`flex flex-col justify-center gap-2 w-[272px] ${className}`}
    >
      <div className="pl-4 text-sm font-normal text-gray-600">{label}</div>
      <div
        className={`bg-white cursor-pointer rounded-lg w-full relative rounded-lg`}
      >
        <div
          className={`absolute inset-0 pointer-events-none border border-gray-300 rounded-lg`}
        />
        <div className="w-full flex items-center justify-between pr-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="YYYY - MM - DD"
            value={value}
            onChange={onChangeInput}
            onBlur={handleBlur}
            readOnly={state === "readOnly"}
            disabled={state === "disabled"}
            className="w-full outline-none px-4 py-3 rounded-l-lg cursor-pointer bg-transparent text-base text-gray-900 caret-transparent"
          />
          <Icon type="Calendar" size={20} />
        </div>

        {showPanel && (
          <div
            ref={panelRef}
            onMouseDown={handlePanelMouseDown}
            className="absolute z-999 bottom-0 translate-y-full"
          >
            <DatePanel
              state={state}
              selectedDate={value}
              setSelectedDate={setValue}
              setShowPanel={setShowPanel}
            />
          </div>
        )}
      </div>
      <div className={`pl-4 text-sm font-normal text-gray-600`}>
        {description}
      </div>
    </button>
  );
}
