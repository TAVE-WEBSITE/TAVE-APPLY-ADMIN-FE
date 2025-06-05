import FlexBox from "@/components/Layout/FlexBox";
import Icon from "@/components/Icon/Icon";
import type { IconType } from "@/components/Icon/Icon";

export interface WithTitleProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}
export interface WithHelperTextProps extends WithTitleProps {
  helperText: string;
}
export interface WithLabelProps {
  iconType: Exclude<IconType, "TaveLogo">;
  label: string;
  labelColor?: string;
  children: React.ReactNode;
  className?: string;
}
export interface WithNumberProps {
  number: number;
  children: React.ReactNode;
  className?: string;
}
const WithTitle = ({ title, children, className = "" }: WithTitleProps) => {
  return (
    <>
      <FlexBox direction="col" className="justify-center">
        <FlexBox>
          <label className={`text-gray-700 font-bold ${className}`}>
            {title}
          </label>
        </FlexBox>
      </FlexBox>
      {children}
    </>
  );
};

const WithHelperText = ({
  title,
  helperText,
  children,
  className = "",
}: WithHelperTextProps) => {
  return (
    <>
      <FlexBox direction="col" className="justify-center">
        <FlexBox className="gap-4 pt-1 pb-2">
          <p className={`text-gray-700 font-bold ${className}`}>{title}</p>
          <div className="relative inline-block group">
            <Icon type="HelperCircle" size={16} className="cursor-help" />
            <div className="absolute z-10 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-md left-6 -top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 text-balance">
              {helperText}
            </div>
          </div>
        </FlexBox>
      </FlexBox>
      {children}
    </>
  );
};

const WithLabel = ({
  label,
  iconType,
  children,
  labelColor = "text-gray-500",
  className = "",
}: WithLabelProps) => {
  return (
    <FlexBox className={`w-full justify-between gap-4 ${className}`}>
      <FlexBox direction="col" className={`items-start gap-2 w-full`}>
        <FlexBox className="gap-2">
          <Icon type={iconType} size={20} />
          <span className={`${labelColor}`}>{label}</span>
        </FlexBox>
        {children}
      </FlexBox>
    </FlexBox>
  );
};

const WithNumber = ({ number, children, className = "" }: WithNumberProps) => {
  return (
    <>
      <FlexBox
        className={`gap-4 text-gray-900 font-semibold w-full mb-2 ${className}`}
      >
        <div className="bg-gray-200 py-2 px-4 rounded-full text-gray-400">
          {number}
        </div>
        <FlexBox direction="col" className="w-full items-start">
          {children}
        </FlexBox>
      </FlexBox>
    </>
  );
};

export { WithTitle, WithLabel, WithNumber, WithHelperText };
