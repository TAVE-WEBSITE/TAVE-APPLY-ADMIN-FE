import { useState, useRef } from "react";
import Body from "@/components/Layout/Body";
import FlexBox from "@/components/Layout/FlexBox";
import { formatDateTime } from "@/utils/formatDate";
import CountCard from "@/components/Card/CountCard";
import Tab from "@/components/Tab/Tab";
import Modal from "@/components/Modal/Modal";
import SearchInput from "@/components/Input/SearchInput";
import FilterButton from "@/components/Button/FilterButton";
import ApplicationTable from "@/components/ApplicationTable/ApplicationTable";
import { type EvaluationItem } from "@/types/application";
import { usePagination } from "@/hooks/usePagination";
import { useFilter } from "@/hooks/useFilter";

const Document = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { entireList, isLoading, totalPages } = usePagination<EvaluationItem>({
    type: "서류 평가",
    page: currentPage,
    size: 7,
  });

  const {
    filteredList,
    checkedRoles,
    searchInput,
    activeTab,
    setActiveTab,
    setSearchInput,
    handleFilter,
  } = useFilter<EvaluationItem>(entireList);

  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <h1 className="font-bold text-4xl">16기 서류 평가 현황</h1>
        <FlexBox className="w-full justify-between">
          <p className="text-gray-500">
            {formatDateTime(new Date().toISOString()) + " 기준"}
          </p>
          <div className="text-xl text-gray-300 underline cursor-pointer">
            서류 최종 평가하기
          </div>
        </FlexBox>
      </FlexBox>
      <Modal
        dialogRef={dialogRef}
        buttonCount={2}
        onConfirm={() => {}}
        title="최종 서류 평가"
      >
        <p className="text-gray-500 text-balance">
          현재 시간 부로, <br /> 서류 합격 결과를 수정하실 수 없습니다. <br />
          <br />
          동의하시겠습니까?
        </p>
      </Modal>
      <Body className="pt-4 gap-8">
        <FlexBox className="gap-4 mx-auto">
          <CountCard text="현재 지원자 수" boxColor={"blue"} count={200} />
          <CountCard text="남은 평가 서류 수" boxColor={"green"} count={37} />
          <CountCard text="합격자 수" boxColor={"orange"} count={80} />
        </FlexBox>
        <FlexBox className="justify-between w-[1320px] mx-auto">
          <Tab
            categories={["전체", "대기중", "완료"]}
            active={activeTab}
            onChange={setActiveTab}
          />

          <FlexBox className="gap-4">
            <FilterButton checkedList={checkedRoles} onChange={handleFilter} />
            <SearchInput
              placeholder="이름을 입력해주세요"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </FlexBox>
        </FlexBox>
        <div className="w-[1320px] mx-auto">
          <ApplicationTable
            rows={[
              "지원 분야",
              "이름",
              "성별",
              "학교",
              "평가 완료 인원",
              "최종 평가",
            ]}
            applications={filteredList}
            totalPages={totalPages}
            isLoading={isLoading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </Body>
    </div>
  );
};

export default Document;
