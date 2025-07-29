import { useState } from "react";
import FlexBox from "@/components/Layout/FlexBox";
import Body from "@/components/Layout/Body";
import Tab from "@/components/Tab/Tab";
import {
  Sidebar,
  SidebarItems,
  type SideBarLabel,
} from "@/components/Layout/Sidebar";
import DraggableList from "@/components/Draggable/List";

const DocumentSetting = () => {
  const [selectedTab, setSelectedTab] = useState("지원서 질문");
  const [selectedSide, setSelectedSide] = useState<SideBarLabel>("공통 질문");

  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <h1 className="font-bold text-4xl">서류 설정</h1>
      </FlexBox>
      <Body className="pt-4">
        <div className=" flex pl-5 leading-[135%] tracking-[-0.56px] border-b border-[#E5E7EB]">
        <div className="text-[#255FF4] px-1 pb-4 text-xl font-bold ">지원서 질문</div>
        </div>
        <div className="flex items-start w-full">
          <Sidebar
            items={SidebarItems}
            selectedItem={selectedSide}
            onSectionClick={setSelectedSide}
          />
          <DraggableList />
        </div>
      </Body>
    </div>
  );
};

export default DocumentSetting;
