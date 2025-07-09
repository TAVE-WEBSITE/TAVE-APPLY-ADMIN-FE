import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { usePagination } from "@/hooks/usePagination";
import { useFilter } from "@/hooks/useFilter";
import Button from "@/components/Button/Button";
import { getRecruitmentEmailCancel, getRecruitmentEmailConfig, updateStatusByDocumentEvaluation } from "./api";

const Final = () => {
  const dialogRefFirst = useRef<HTMLDialogElement>(null);
  const dialogRefSecond = useRef<HTMLDialogElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  //일단 서류평가 이메일 전송 예약 되어있는지 유무를 useState()로 해놨습니다
  //하지만 이러면 당연히 제대로 로직되로 구조가 안 흘러갈 것 같아서 
  //백에서 예약되어있는지를 받아야할지 고민입니다. ( 최종 면접 결과 부분도 동일 )
  const [emailConfig , setEmailConfig] = useState(false); 
  const navigate = useNavigate();

  const { entireList, isLoading, totalPages } =
    usePagination<FinalEvaluationItem>({
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
  //서류 평가 상태 : FAIL, PASS, HOLD, NOTCHECKED, COMPLETE
    const isEmpty = entireList.length === 0;
    const notDone = entireList.some(
      (e) => e.status === "NOTCHECKED" || e.status === "HOLD"
    );
    const allFail = !isEmpty && entireList.every(e => e.status === "FAIL");
    const allPass = !isEmpty && entireList.every(e => e.status === "PASS");

    if (notDone) dialogRefFirst.current?.showModal();
    else if(allFail || allPass) dialogRefSecond.current?.showModal(); //모든 평가 FAIL 또는 PASS일때
    else handleEmailUpdate();
  };

  const holdCount = useMemo(() => {
    return entireList.filter((e) => e.status === "HOLD").length;
  }, [entireList]);

  const notCheckedCount = useMemo(() => {
    return entireList.filter((e) => e.status === "NOTCHECKED").length;
  }, [entireList]);
  
  const handleEmailCancel = async () => {
    try {
      await getRecruitmentEmailCancel();
      setEmailConfig(false);
    } catch (error) {
      console.error("이메일 취소 실패:", error);
    }
  };

  const handleEmailUpdate = async () => {
    // 기존 코드
    //await updateStatusByDocumentEvaluation();
    try {
      await getRecruitmentEmailConfig();
      setEmailConfig(true);
    } catch (error) {
      console.error("이메일 예약 실패:", error);
    } finally {
      dialogRefSecond.current?.close();
    }
  };

  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <FlexBox className="gap-2">
          <Icon
            type="ChevronDown"
            size={40}
            className="rotate-90 cursor-pointer"
            onClick={() => navigate("/evaluation/document")}
          />
          <h1 className="font-bold text-4xl">16기 최종 서류 평가</h1>
        </FlexBox>

        <FlexBox className="w-full justify-between">
          <p className="text-gray-500">
            {formatDateTime(new Date().toISOString()) + " 기준"}
          </p>
          {emailConfig ? (
          <Button className="bg-gray-200" onClick={handleEmailCancel}>
            메일 발송 예정
          </Button>
        ) : (
          <Button onClick={openModal}>서류 평가 완료</Button>
        )}
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
        onConfirm={() => handleEmailUpdate()}
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
            totalPages={totalPages}
            isLoading={isLoading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            navigate={navigate}
            baseUrl="/evaluation/document/final"
          />
        </div>
      </Body>
    </div>
  );
};

export default Final;
