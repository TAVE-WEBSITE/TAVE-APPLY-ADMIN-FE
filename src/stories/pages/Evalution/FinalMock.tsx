import { useState, useRef, useMemo } from "react";
import Body from "@/components/Layout/Body";
import FlexBox from "@/components/Layout/FlexBox";
import Icon from "@/components/Icon/Icon";
import { formatDateTime } from "@/utils/formatDate";
import CountCard from "@/components/Card/CountCard";
import Tab from "@/components/Tab/Tab";
import Modal from "@/components/Modal/Modal";
import SearchInput from "@/components/Input/SearchInput";
import FilterButton from "@/components/Button/FilterButton";
import ApplicationTable from "@/components/ApplicationTable/ApplicationTable";
import { type FinalEvaluationItem } from "@/types/application";
import { useFilter } from "@/hooks/useFilter";
import Button from "@/components/Button/Button";
import { usePagination } from "@/hooks/usePagination";

const FinalMock = () => {
  const dialogRefFirst = useRef<HTMLDialogElement>(null);
  const dialogRefSecond = useRef<HTMLDialogElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { entireList, isLoading } = usePagination<FinalEvaluationItem>({
    type: "최종 서류 평가",
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
  } = useFilter<FinalEvaluationItem>(entireList);

  const openModal = () => {
    const notDone = entireList.some(
      (e: any) => e.status === "NOTCHECKED" || e.status === "HOLD"
    );
    if (notDone) dialogRefFirst.current?.showModal();
    else dialogRefSecond.current?.showModal();
  };

  const holdCount = useMemo(() => {
    return entireList.filter((e: any) => e.status === "HOLD").length;
  }, [entireList]);

  const notCheckedCount = useMemo(() => {
    return entireList.filter((e: any) => e.status === "NOTCHECKED").length;
  }, [entireList]);

  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <FlexBox className="gap-2">
          <Icon
            type="ChevronDown"
            size={40}
            className="rotate-90 cursor-pointer"
            onClick={() => {}}
          />
          <h1 className="font-bold text-4xl">16기 최종 서류 평가</h1>
        </FlexBox>

        <FlexBox className="w-full justify-between">
          <p className="text-gray-500">
            {formatDateTime(new Date().toISOString()) + " 기준"}
          </p>
          <Button onClick={openModal}>서류 평가 완료</Button>
        </FlexBox>
      </FlexBox>
      <Modal
        dialogRef={dialogRefFirst}
        buttonCount={2}
        onConfirm={() => dialogRefFirst.current?.close()}
        title="최종 서류 평가"
      >
        <p className="text-gray-500 text-balance">
          모든 서류 평가가 완료되지 않았습니다. <br /> <br />
          현재 서류 평가 진행 현황입니다. <br />
          <ul>
            <li>
              - 보류 중인 서류{" "}
              <span className="text-blue-500 font-bold">{holdCount}</span>건
            </li>{" "}
            <li>
              - 진행하지 않은 서류{" "}
              <span className="text-blue-500 font-bold">{notCheckedCount}</span>
              건
            </li>
          </ul>
        </p>
      </Modal>
      <Modal
        dialogRef={dialogRefSecond}
        buttonCount={2}
        onConfirm={() => dialogRefSecond.current?.close()}
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
            categories={["전체", "평가 진행 전", "불합격", "합격"]}
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
            totalPages={1}
            isLoading={isLoading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </Body>
    </div>
  );
};

export default FinalMock;
