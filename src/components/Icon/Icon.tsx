import React from "react";
import type { SVGProps } from "react";
import * as icons from "@/assets/Icons";

export type IconType =
  | "TaveLogo"
  | "XCircle"
  | "X"
  | "ChevronDown"
  | "ChevronUp"
  | "Check"
  | "Left"
  | "Calendar"
  | "Arrow"
  | "Alert"
  | "Trash"
  | "TextLength"
  | "Pen"
  | "Menu"
  | "File"
  | "Filter"
  | "HelperCircle"
  | "Dots"
  | "Plus"
  | "Upload"
  | "Link"
  | "Key"
  | "Email"
  | "CheckCircle"
  | "ClockCircle";

interface BaseIconProps extends SVGProps<SVGSVGElement> {
  type: IconType;
  className?: string;
}

interface StandardIconProps extends BaseIconProps {
  type: Exclude<IconType, "TaveLogo">;
  size: number;
}

interface TaveLogoIconProps extends BaseIconProps {
  type: "TaveLogo";
  width: number;
  height: number;
}

type IconProps = StandardIconProps | TaveLogoIconProps;

export const Icon: React.FC<IconProps> = ({
  type,
  className = "",
  ...props
}) => {
  const IconComponent = icons[type];

  if (!IconComponent) {
    return null;
  }

  if (type === "TaveLogo") {
    const { width, height } = props as TaveLogoIconProps;
    return (
      <IconComponent
        width={width}
        height={height}
        className={className}
        {...props}
      />
    );
  }

  const { size } = props as StandardIconProps;
  return (
    <IconComponent
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
};

export default Icon;
