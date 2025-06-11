import { type InputHTMLAttributes } from "react";
import { WithTitle, WithNumber, WithHelperText } from "./Custom";
import {
  type WithTitleProps,
  type WithNumberProps,
  type WithHelperTextProps,
} from "./Custom";
import { Icon, type IconType } from "../Icon/Icon";
import FlexBox from "../Layout/FlexBox";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value"> {
  value?: string; // 파일이 아닌 경우만 사용
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  width?: string;
  className?: string;
  disabled?: boolean;
  allowFile?: boolean; // 파일 input으로 동작할지 여부
}

interface LabelProps {
  iconType: Exclude<IconType, "TaveLogo">;
  label: string;
  labelColor?: string;
  className?: string;
}

export type WithLabelProps = LabelProps & InputProps;

const Input = ({
  value,
  onChange,
  placeholder,
  width,
  type = "text",
  className = "",
  disabled = false,
  allowFile = false,
  ...rest
}: InputProps) => {
  const isFileInput = allowFile || type === "file";

  return (
    <input
      type={isFileInput ? "file" : type}
      value={isFileInput ? undefined : value} // file input은 value 제어 불가
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`px-4 py-3 text-base text-black leading-[135%] tracking-[-0.56px] focus:border-black bg-white border border-gray-300 rounded-lg ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${width} ${className}`}
      {...rest}
    />
  );
};

const WithLabel = ({
  value,
  onChange,
  placeholder,
  width,
  type = "text",
  disabled = false,
  allowFile = false,
  label,
  iconType,
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
        <Input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          width={width}
          type={type}
          disabled={disabled}
          allowFile={allowFile}
        />
      </FlexBox>
    </FlexBox>
  );
};

type InputType = React.FC<InputProps> & {
  TitleContainer: React.FC<WithTitleProps>;
  WithLabel: React.FC<WithLabelProps>;
  NumberContainer: React.FC<WithNumberProps>;
  HelperTextContainer: React.FC<WithHelperTextProps>;
};
Input.TitleContainer = WithTitle;
Input.WithLabel = WithLabel;
Input.NumberContainer = WithNumber;
Input.HelperTextContainer = WithHelperText;

export default Input as InputType;
