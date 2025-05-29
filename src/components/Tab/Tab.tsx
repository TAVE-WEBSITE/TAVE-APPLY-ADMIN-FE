interface InputProps {
  categories: string[];
  active?: string;
  onChange: () => void;
  className?: string;
  fitWidth?: boolean; //회색 border를 fit하게 맞출지의 유무
  centerType?: boolean; //center로 오는 경우
}

const Tab = ({
  categories,
  active,
  onChange,
  className,
  fitWidth = false,
  centerType = false,
}: InputProps) => {
  const current = active ?? categories[0];
  return (
    <div
      className={`relative flex flex-row gap-6  leading-[135%] tracking-[-0.56px] border-b border-[#E5E7EB]
        ${fitWidth && "w-fit"} 
        ${centerType && "justify-center"} ${className}`}
    >
      {categories.map((text) => (
        <div
          key={text}
          className={`relative px-1 pb-4 text-base font-bold cursor-pointer
            ${current === text ? "text-[#255FF4]" : "text-[#6C727F]"}
            ${centerType && "px-26"}
          `}
          onClick={onChange}
        >
          {text}
          {current === text && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#255FF4] translate-y-[1px]" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Tab;
