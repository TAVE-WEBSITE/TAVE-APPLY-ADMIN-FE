interface TextAreaProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  width?: string;
  height?: string;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
}

const TextArea = ({
  value,
  onChange,
  placeholder,
  width,
  height,
  maxLength,
  disabled = false,
  className,
}: TextAreaProps) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      className={`px-4 py-5 text-base text-black leading-[135%] tracking-[-0.56px] focus:border-black bg-white border border-gray-400 rounded-lg ${
        disabled ? "opacity-50" : ""
      } ${width} ${height} ${className}`}
    />
  );
};

export default TextArea;
