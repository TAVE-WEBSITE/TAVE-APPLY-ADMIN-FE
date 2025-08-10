import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
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
import { type RoleType } from "@/types/role.d";
import Button from "@/components/Button/Button";
import { getFinalInterviewEmailCancel, getFinalInterviewEmailConfig, getFinalInterviewEmailFind } from "./api";
import Modal from "@/components/Modal/Modal";

const FinalInterview = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dialogRefFirst = useRef<HTMLDialogElement>(null);
  const dialogRefSecond = useRef<HTMLDialogElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [emailConfig , setEmailConfig] = useState(false);
  const [activeTab, setActiveTab] = useState("전체");
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const getStatusFromTab = (tab: string) => {
    switch (tab) {
      case "전체":
        return undefined;
      case "평가 진행 전":
        return "PASS";
      case "불합격":
        return "FINAL_FAIL";
      case "합격":
        return "FINAL_PASS";
      default:
        return "PASS";
    }
  };

  const { entireList, isLoading, totalPages,countData } = usePagination<EvaluationItem>({
    pageType: "최종 면접 평가",
    page: currentPage - 1, // 0-based index로 변환
    size: 7,
    status: getStatusFromTab(activeTab),
    name: searchInput,
    type: selectedRole || undefined,
  });

  // API 요청 데이터 로깅
  console.log("=== 최종 면접 평가 API 요청 정보 ===");
  console.log("pageType:", "최종 면접 평가");
  console.log("page:", currentPage);
  console.log("size:", 7);
  console.log("status:", getStatusFromTab(activeTab));
  console.log("=============================");

  const handleFilter = (role: RoleType | null) => {
    setSelectedRole(role);
  };



  // 응답 데이터 로깅
  useEffect(() => {
    console.log("=== 최종 면접 평가 API 응답 데이터 ===");
    console.log("현재 탭:", activeTab);
    console.log("현재 status:", getStatusFromTab(activeTab));
    console.log("전체 리스트:", entireList);
    console.log("isLoading:", isLoading);
    console.log("totalPages:", totalPages);
    console.log("countData:", countData);
    console.log("=============================");
  }, [entireList, activeTab, isLoading, totalPages, countData]);

  
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
      console.log("=== 면접 평가 완료 프로세스 시작 ===");
      console.log("현재 전체 지원자 목록:", entireList);
      console.log("현재 상태별 분류:");
      console.log("- 전체 지원자 수:", entireList.length);
      console.log("- 합격자 수:", entireList.filter(e => e.status === "FINAL_PASS").length);
      console.log("- 불합격자 수:", entireList.filter(e => e.status === "FINAL_FAIL").length);
      console.log("- 평가 진행 전:", entireList.filter(e => e.status === "PASS").length);
      
      // 기존 코드
      //await updateStatusByDocumentEvaluation();
      try {
        console.log("=== 메일 발송 예약 API 호출 ===");
        console.log("API 엔드포인트: /v1/admin/config/recruitment/last/email");
        const emailResponse = await getFinalInterviewEmailConfig();
        console.log("메일 발송 예약 응답:", emailResponse);
        
        console.log("=== 메일 예약 상태 확인 API 호출 ===");
        console.log("API 엔드포인트: /v1/admin/config/recruitment/last/email/find");
        const { isBooked } = await getFinalInterviewEmailFind(); // 최신 상태 조회
        console.log("메일 예약 상태:", isBooked);
        
        setEmailConfig(isBooked); // 상태 갱신
        
        console.log("=== 면접 평가 완료 프로세스 성공 ===");
        console.log("모든 지원자의 최종 결과가 백엔드로 전송되었습니다.");
        console.log("메일 발송이 예약되었습니다.");
        
      } catch (error: any) {
        console.error("=== 면접 평가 완료 프로세스 실패 ===");
        console.error("이메일 예약 실패:", error);
        console.error("에러 상세:", error.response?.data || error);
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
          <CountCard text="현재 지원자 수" boxColor={"blue"} count={countData.totalRecruiter} />
          <CountCard text="최종 평가 완료 수" boxColor={"green"} count={countData.completedRecruiter} />
          <CountCard text="최종 평가 남은 수" boxColor={"orange"} count={countData.notCompletedRecruiter} />
        </FlexBox>
        <FlexBox className="justify-between w-[1320px] mx-auto">
          <Tab
            categories={["전체", "평가 진행 전", "불합격", "합격"]}
            active={activeTab}
                          onChange={(tab) => {
                setActiveTab(tab);
                setCurrentPage(1); // 탭 변경 시 첫 페이지로 이동
                setSearchInput(""); // 검색 입력값 초기화
                setSearchValue(""); // 검색 입력값 초기화
                setSelectedRole(null); // 지원 분야 필터 초기화
                // 캐시 무효화
                queryClient.invalidateQueries({ 
                  queryKey: ["pagination", "최종 면접 평가"] 
                });
              }}
          />

          <FlexBox className="gap-4">
            <FilterButton selectedRole={selectedRole} onChange={handleFilter} />
            <SearchInput
              placeholder="이름을 입력해주세요"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  console.log("Enter 키 입력됨, searchValue:", searchValue);
                  setSearchInput(searchValue);
                  setCurrentPage(1); // 검색 시 1페이지로 이동
                }
              }}
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
              "면접 일자",
              "최종 평가",
            ]}
            applications={entireList}
            totalPages={totalPages}
            isLoading={isLoading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            baseUrl="/evaluation/interview/final"
            navigate={navigate}
            pageType="interview"
          />
        </div>
      </Body>
    </div>
  );
};

export default FinalInterview;
