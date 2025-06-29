import Icon from "../Icon/Icon";
import { useEffect, useRef, useState } from "react";
import FlexBox from "./FlexBox";
import type { RoleType } from "@/types/role";
import useDocumentStore from "@/hooks/Setting/Document/useDocumentStore";

export type SideBarLabel = "" | "공통 질문" | "파트별 질문" | RoleType;
interface SidebarItem {
  label: SideBarLabel;
  isExpandable: boolean;
  children?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  selectedItem: SideBarLabel;
  onSectionClick: (side: SideBarLabel) => void; // 공통 질문, 파트별 질문 등 큼지막한 탭을 클릭했을때 로직을 위한 props
  className?: string;
}

interface SidebarItemProps {
  item: SidebarItem;
  selectedItem: SideBarLabel;
  onSectionClick: (side: SideBarLabel) => void;
}

const SidebarItems: SidebarItem[] = [
  {
    label: "공통 질문",
    isExpandable: false,
  },
  {
    label: "파트별 질문",
    isExpandable: true,
    children: [
      {
        label: "디자인",
        isExpandable: false,
      },
      {
        label: "웹 프론트",
        isExpandable: false,
      },
      {
        label: "앱 프론트",
        isExpandable: false,
      },
      {
        label: "백엔드",
        isExpandable: false,
      },
      {
        label: "딥러닝",
        isExpandable: false,
      },
      { label: "데이터 분석", isExpandable: false },
    ],
  },
];

// 개별 사이드바 아이템 컴포넌트
const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  selectedItem,
  onSectionClick,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { setCurrentType } = useDocumentStore();

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onSectionClick(item.label);
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

  const handleQuestionTypeChange = async (label: string) => {
    if (label === "디자인") {
      setCurrentType("DESIGN");
    } else if (label === "웹 프론트") {
      setCurrentType("WEBFRONTEND");
    } else if (label === "앱 프론트") {
      setCurrentType("APPFRONTEND");
    } else if (label === "백엔드") {
      setCurrentType("BACKEND");
    } else if (label === "딥러닝") {
      setCurrentType("DEEPLEARNING");
    } else if (label === "데이터 분석") {
      setCurrentType("DATAANALYSIS");
    }
  };

  return (
    <div className="w-full">
      {item.isExpandable ? (
        <FlexBox direction="col" className="bg-white px-6 hover:bg-gray-100">
          <button
            className="relative flex w-full justify-between py-5 cursor-pointer"
            onClick={() => handleToggle()}
            onKeyDown={(e) => e.key === "Space" && handleToggle()}
          >
            <p
              className={`${
                selectedItem === item.label
                  ? "text-blue-700 font-bold"
                  : "text-gray-700 font-medium"
              } text-balance text-start`}
            >
              {item.label}
            </p>
            <Icon
              type="ChevronUp"
              size={24}
              className={`absolute right-0 ${
                isOpen ? "opacity-0" : ""
              } rotate-180`}
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
            <section className="pt-1 pb-5">
              {item.children?.map((child) => (
                <span
                  key={child.label}
                  onClick={() => {
                    onSectionClick(child.label);
                    handleQuestionTypeChange(child.label);
                  }}
                  className={`block py-2 px-4 text-sm ${
                    selectedItem === child.label
                      ? "text-blue-700 font-bold"
                      : "text-gray-700 font-medium"
                  } hover:text-blue-700 hover:font-bold cursor-pointer`}
                >
                  {child.label}
                </span>
              ))}
            </section>
          </div>
        </FlexBox>
      ) : (
        <button
          onClick={async () => {
            onSectionClick(item.label);
            setCurrentType("COMMON");
          }}
          className={`w-full px-6 py-4 flex items-start cursor-pointer ${
            selectedItem === item.label
              ? "text-blue-700 font-bold"
              : "text-gray-700 font-medium"
          } font-lg bg-white hover:bg-gray-100`}
        >
          {item.label}
        </button>
      )}
    </div>
  );
};

// 메인 사이드바 컴포넌트
const Sidebar: React.FC<SidebarProps> = ({
  items,
  selectedItem,
  onSectionClick,
  className = "",
}) => {
  return (
    <div
      className={`w-64 bg-white min-h-screen border-r border-gray-200 ${className}`}
    >
      {/* 사이드바 항목들 */}
      <div className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <SidebarItem
            key={item.label}
            item={item}
            onSectionClick={onSectionClick}
            selectedItem={selectedItem}
          />
        ))}
      </div>
    </div>
  );
};

export { Sidebar, SidebarItems };
