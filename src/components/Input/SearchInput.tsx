import { Search } from "@/assets/Icons";
import React, { type InputHTMLAttributes } from "react";
import Input from "./Input";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  width?: string;
}

const SearchInput = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  className = "",
  disabled = false,
  width = "w-full",
}: SearchInputProps) => {
  return (
    <div className="relative">
      <Input
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        width={width}
        className={`pl-10 ${className}`}
      />
      <Search className="absolute top-1/3 left-3 w-5 h-5 text-[#9DA3AE]" />
    </div>
  );
};

export default SearchInput;
