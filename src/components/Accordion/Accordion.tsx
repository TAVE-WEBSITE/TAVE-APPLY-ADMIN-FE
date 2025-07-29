import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon/Icon";
import FlexBox from "@/components/Layout/FlexBox";

export interface AccordionProps {
  title: string;
  children: React.ReactNode;
  hasBorder?: boolean;
  className?: string;
}

export default function Accordion({
  title,
  children,
  hasBorder = true,
  className,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;

      if (isOpen) {
        contentRef.current.style.maxHeight = `${contentHeight}px`;
      } else {
        contentRef.current.style.maxHeight = "0px";
      }
    }
  }, [isOpen]);

  return (
    <FlexBox
      direction="col"
      className={`rounded-[20px] border border-gray-300 bg-white px-6 ${className}`}
    >
      <button
        className="relative flex w-full justify-between py-5"
        onClick={() => handleToggle()}
        onKeyDown={(e) => e.key === "Space" && handleToggle()}
      >
        <p className="text-gray-700 font-medium text-balance text-start">
          {title}
        </p>
        <Icon
          type="ChevronUp"
          size={24}
          className={`absolute right-0 ${isOpen ? "opacity-0" : ""} rotate-180`}
        />
        <Icon
          type="ChevronUp"
          size={24}
          className={`absolute right-0 ${isOpen ? "" : "opacity-0"}`}
        />
      </button>
      <div
        ref={contentRef}
        className={`w-full overflow-hidden transition-[max-height] ${
          isOpen ? "duration-300" : "duration-300"
        }`}
      >
        {hasBorder && <div className="w-full h-px bg-gray-300 mb-5" />}
        <section className="pt-1 pb-5">{children}</section>
      </div>
    </FlexBox>
  );
}
