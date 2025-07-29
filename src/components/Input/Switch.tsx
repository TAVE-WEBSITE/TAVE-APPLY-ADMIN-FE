export interface SwitchProps {
  title?: string;
  isOn: boolean;
  setIsOn: (isOn: boolean) => void;
  onClick?: () => void;
}

export default function Switch({ title, isOn, setIsOn, onClick }: SwitchProps) {
  const toggleSwitch = () => {
    setIsOn(!isOn);
    if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <div className="flex gap-2">
        {title && (
          <div
            className={`flex items-center ${
              isOn ? "text-gray-700" : "text-gray-400"
            }`}
          >
            {title}
          </div>
        )}
        <div
          className={`w-12 h-6 rounded-full
            ${isOn ? "bg-blue-700" : "bg-gray-300"} py-[3px]`}
          onClick={toggleSwitch}
        >
          <div
            className={`w-[18px] h-[18px] rounded-full bg-white
                transform transition-transform duration-250 ${
                  isOn ? "translate-x-[27px]" : "translate-x-[3px]"
                }`}
          />
        </div>
      </div>
    </>
  );
}
