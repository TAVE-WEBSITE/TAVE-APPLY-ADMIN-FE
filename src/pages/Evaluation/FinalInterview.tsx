import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Body from "@/components/Layout/Body";
import FlexBox from "@/components/Layout/FlexBox";
import { formatDateTime } from "@/utils/formatDate";
import CountCard from "@/components/Card/CountCard";
import Tab from "@/components/Tab/Tab";
import SearchInput from "@/components/Input/SearchInput";
import FilterButton from "@/components/Button/FilterButton";
import ApplicationTable from "@/components/ApplicationTable/ApplicationTable";
import { type EvaluationItem } from "@/types/application";
import { usePagination } from "@/hooks/usePagination";
import { useFilter } from "@/hooks/useFilter";
import Button from "@/components/Button/Button";
import { getFinalInterviewEmailCancel, getFinalInterviewEmailConfig, getFinalInterviewEmailFind } from "./api";
import Modal from "@/components/Modal/Modal";

const FinalInterview = () => {
  const navigate = useNavigate();
  const dialogRefFirst = useRef<HTMLDialogElement>(null);
  const dialogRefSecond = useRef<HTMLDialogElement>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [emailConfig , setEmailConfig] = useState(false);

  const { entireList, isLoading, totalPages } = usePagination<EvaluationItem>({
    type: "최종 면접 평가",
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

  //서류 평가 부분과 유사하여 필요한 코드 가져옴
  //아직 마무리 되지 않은듯하여 주석 처리
  //이후 필요 시 사용 예정
  
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
        await getFinalInterviewEmailCancel();
        const { isBooked } = await getFinalInterviewEmailFind(); // 최신 상태 조회
        setEmailConfig(isBooked); // 상태 갱신
      } catch (error) {
        console.error("이메일 취소 실패:", error);
      }
    };
  
    const handleEmailUpdate = async () => {
      // 기존 코드
      //await updateStatusByDocumentEvaluation();
      try {
        await getFinalInterviewEmailConfig();
        const { isBooked } = await getFinalInterviewEmailFind(); // 최신 상태 조회
        setEmailConfig(isBooked); // 상태 갱신
      } catch (error) {
        console.error("이메일 예약 실패:", error);
      } finally {
        dialogRefSecond.current?.close();
      }
    };

    useEffect(() => {
      const viewEmail = async () => {
        try {
          const { isBooked } = await getFinalInterviewEmailFind();
          setEmailConfig(isBooked);
        } catch (error) {
          console.error("이메일 상태 조회 실패:", error);
        }
      };
    
      viewEmail();
    }, []);
  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <h1 className="font-bold text-4xl">16기 최종 면접 평가</h1>
        <FlexBox className="w-full justify-between">
          <p className="text-gray-500">
            {formatDateTime(new Date().toISOString()) + " 기준"}
          </p>
          {emailConfig ? (
            <Button className="bg-gray-200" onClick={handleEmailCancel}>
              메일 발송 예정
            </Button>
          ) : (
            <Button onClick={openModal}>면접 평가 완료</Button>
          )}
        </FlexBox>
      </FlexBox>
      <Modal
        dialogRef={dialogRefFirst}
        buttonCount={2}
        onConfirm={() => dialogRefFirst.current?.close()}
        title="최종 면접 평가"
      >
        <p className="text-gray-500 text-balance">
          모든 면접 평가가 완료되지 않았습니다. <br /> <br />
          현재 면접 평가 진행 현황입니다. <br />
          <ul>
            <li>
              - 보류 중인 면접{" "}
              <span className="text-blue-500 font-bold">{holdCount}</span>건
            </li>{" "}
            <li>
              - 진행하지 않은 면접{" "}
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
        title="최종 면접 평가"
      >
        <p className="text-gray-500 text-balance">
          현재 시간 부로, <br /> 면접 합격 결과를 수정하실 수 없습니다. <br />
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
              "지원 날짜",
              "평가 여부",
            ]}
            applications={filteredList}
            totalPages={totalPages}
            isLoading={isLoading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            baseUrl="/evaluation/interview/final"
            navigate={navigate}
          />
        </div>
      </Body>
    </div>
  );
};

export default FinalInterview;
