import { useEffect, useState } from "react";
import Body from "@/components/Layout/Body";
import FlexBox from "@/components/Layout/FlexBox";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { formatDateTime } from "@/utils/formatDate";
import Icon from "@/components/Icon/Icon";

import ToastMessage from "@/components/Modal/ToastMessage";
import { useFinalPassSetting } from "@/hooks/Setting/FinalPass/useFinal";

const BANKS = [
  "KB국민은행",
  "신한은행",
  "우리은행",
  "하나은행",
  "IBK기업은행",
  "NH농협은행",
  "카카오뱅크",
  "토스뱅크",
  "SC제일은행",
  "씨티은행",
];

// ISO <-> "YYYY.MM.DD HH:MM" 문자열 변환 함수 (예시)
function parseToISO(dateTimeStr: string): string | null {
  const regex = /^(\d{4})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2})$/;
  const match = dateTimeStr.match(regex);
  if (!match) return null;

  const [_, yyyy, mm, dd, hh, min] = match;
  const date = new Date(
    Number(yyyy),
    Number(mm) - 1,
    Number(dd),
    Number(hh),
    Number(min),
    0
  );

  if (isNaN(date.getTime())) return null;
  return date.toISOString();
}

const FinalPassSetting = () => {
  const {
    isLoading,
    isError,
    totalFee,
    setTotalFee,
    clubFee,
    setClubFee,
    mtFee,
    setMtFee,
    feeDeadline,
    setFeeDeadline,
    bankName,
    setBankName,
    accountNumber,
    setAccountNumber,
    accountHolder,
    setAccountHolder,
    surveyLink,
    setSurveyLink,
    surveyDeadline,
    setSurveyDeadline,
    otLink,
    setOtLink,
    otPassword,
    setOtPassword,
    otDeadline,
    setOtDeadline,
    updateFinalPassSetting,
    toastMessage,
  } = useFinalPassSetting();

  // 입력용 상태 따로 관리: 백엔드에서 받아온 ISO -> 포맷된 문자열로 변환해 초기화
  const [feeDeadlineInput, setFeeDeadlineInput] = useState("");
  const [surveyDeadlineInput, setSurveyDeadlineInput] = useState("");
  const [otDeadlineInput, setOtDeadlineInput] = useState("");

  useEffect(() => {
    if (feeDeadline) {
      setFeeDeadlineInput(formatDateTime(feeDeadline));
    } else {
      setFeeDeadlineInput("");
    }
  }, [feeDeadline]);

  useEffect(() => {
    if (surveyDeadline) {
      setSurveyDeadlineInput(formatDateTime(surveyDeadline));
    } else {
      setSurveyDeadlineInput("");
    }
  }, [surveyDeadline]);

  useEffect(() => {
    if (otDeadline) {
      setOtDeadlineInput(formatDateTime(otDeadline));
    } else {
      setOtDeadlineInput("");
    }
  }, [otDeadline]);

  const [isPending, setIsPending] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  //const [toastText, setToastText] = useState("");

  useEffect(() => {
    if (isLoading || isError) {
      setIsToastOpen(true);
    }
  }, [isLoading, isError]);

  const handleSave = () => {
    setIsPending(true);
    updateFinalPassSetting();

    setTimeout(() => {
      setIsToastOpen(true);
      setIsPending(false);
      // API 등록 성공 시 2초 후 새로고침
      if (!isError) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }, 1000);
  };

  // 날짜 입력 onChange 핸들러 예시 (feeDeadline)
  const handleFeeDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFeeDeadlineInput(val);

    const iso = parseToISO(val);
    if (iso) setFeeDeadline(iso);
  };

  // surveyDeadline 핸들러
  const handleSurveyDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSurveyDeadlineInput(val);

    const iso = parseToISO(val);
    if (iso) setSurveyDeadline(iso);
  };

  // otDeadline 핸들러
  const handleOtDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setOtDeadlineInput(val);

    const iso = parseToISO(val);
    if (iso) setOtDeadline(iso);
  };

  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <h1 className="font-bold text-4xl">최종 합격 안내 설정</h1>
      </FlexBox>

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">설정 데이터를 불러오는 중...</p>
        </div>
      )}

      {!isLoading && (
      <Body>
        <FlexBox direction="col" className="justify-center mx-auto pt-8 gap-8">
          <Input.NumberContainer number={1} className="items-start">
            <Input.TitleContainer title="회비">
              <Input.WithLabel
                type="number"
                label="회비 금액"
                iconType="Check"
                labelColor="text-gray-900"
                placeholder="금액 입력해주세요"
                value={String(totalFee)}
                width="w-xl"
                onChange={(e) => setTotalFee(Number(e.target.value))}
                className="mb-2"
              />
              <FlexBox className={`w-full justify-between gap-4`}>
                <FlexBox direction="col" className={`items-start gap-2 w-full`}>
                  <FlexBox className="gap-2">
                    <Icon type="Check" size={20} />
                    <span className="text-gray-900">회비 구성</span>
                  </FlexBox>
                  <FlexBox className="gap-2">
                    <div className="rounded-3xl border border-blue-300 bg-blue-100 text-blue-700 text-sm p-2">
                      동아리 회비
                    </div>
                    <Input
                      type="number"
                      placeholder="금액을 입력하세요"
                      value={String(clubFee)}
                      onChange={(e) => setClubFee(Number(e.target.value))}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <Icon type="Plus" size={18} className="text-gray-400" />
                    <div className="rounded-3xl border border-blue-300 bg-blue-100 text-blue-700 text-sm p-2">
                      MT 회비
                    </div>
                    <Input
                      type="number"
                      placeholder="금액을 입력하세요"
                      value={String(mtFee)}
                      onChange={(e) => setMtFee(Number(e.target.value))}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </FlexBox>
                </FlexBox>
              </FlexBox>
              <FlexBox className={`w-full justify-between gap-4`}>
                <FlexBox direction="col" className={`items-start gap-2 w-full`}>
                  <FlexBox className="gap-2">
                    <Icon type="Check" size={20} />
                    <span className="text-gray-900">입금 계좌</span>
                  </FlexBox>
                  <FlexBox className="gap-2">
                    <div className="relative">
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className={`
          w-full appearance-none bg-white text-gray-700 text-base
          border border-gray-300 rounded-xl px-4 py-3
          pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400
          disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
        `}
                      >
                        <option value="" disabled hidden>
                          은행
                        </option>
                        {BANKS.map((bank) => (
                          <option key={bank} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                      <Icon
                        type="ChevronUp"
                        size={20}
                        className="absolute rotate-180 right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                    <Input
                      placeholder="계좌 번호를 입력해주세요"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                    <Input
                      placeholder="계좌주를 입력"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                    />
                  </FlexBox>
                </FlexBox>
              </FlexBox>
              <Input.WithLabel
                label="마감 기한"
                iconType="Check"
                labelColor="text-gray-900"
                placeholder="YYYY.MM.DD HH:MM"
                value={feeDeadlineInput} // 수정: 입력용 문자열 상태로 변경
                width="w-xl"
                onChange={handleFeeDeadlineChange} // 수정: 포맷 핸들러 적용
                className="mb-2"
              />
            </Input.TitleContainer>
          </Input.NumberContainer>

          <Input.NumberContainer number={2} className="items-start">
            <Input.TitleContainer title="아지트 초대 설문 조사">
              <Input.WithLabel
                label="링크"
                iconType="Check"
                labelColor="text-gray-900"
                placeholder="아지트 설문 조사 링크를 작성해주세요"
                value={surveyLink}
                width="w-xl"
                onChange={(e) => setSurveyLink(e.target.value)}
                className="mb-2"
              />
              <Input.WithLabel
                label="마감 기한"
                iconType="Check"
                labelColor="text-gray-900"
                placeholder="YYYY.MM.DD HH:MM"
                value={surveyDeadlineInput} // 수정
                width="w-xl"
                onChange={handleSurveyDeadlineChange} // 수정
                className="mb-2"
              />
            </Input.TitleContainer>
          </Input.NumberContainer>

          <Input.NumberContainer number={3} className="items-start">
            <Input.TitleContainer title="OT 공지방">
              <Input.WithLabel
                label="링크"
                iconType="Check"
                labelColor="text-gray-900"
                placeholder="카카오톡 오픈채팅방 링크를 입력하세요"
                value={otLink}
                width="w-xl"
                onChange={(e) => setOtLink(e.target.value)}
                className="mb-2"
              />
              <Input.WithLabel
                label="비밀번호"
                iconType="Check"
                labelColor="text-gray-900"
                placeholder="채팅방 비밀번호 입력해주세요"
                value={otPassword}
                width="w-xl"
                onChange={(e) => setOtPassword(e.target.value)}
                className="mb-2"
              />
              <Input.WithLabel
                label="마감 기한"
                iconType="Check"
                labelColor="text-gray-900"
                placeholder="YYYY.MM.DD HH:MM"
                value={otDeadlineInput} // 수정
                width="w-xl"
                onChange={handleOtDeadlineChange} // 수정
                className="mb-2"
              />
            </Input.TitleContainer>
          </Input.NumberContainer>
        </FlexBox>
        <FlexBox className="mx-auto my-12 gap-2">
          <button className="w-[100px] bg-gray-300 py-3 px-4 rounded-lg border border-gray-300 text-gray-900 font-semibold">
            미리보기
          </button>
          <Button
            className="w-[100px]"
            isPending={isPending}
            onClick={handleSave}
          >
            저장하기
          </Button>
        </FlexBox>
        <ToastMessage
          message={toastMessage}
          isOpen={isToastOpen}
          isError={isError}
          setIsOpen={setIsToastOpen}
        />
      </Body>
      )}
    </div>
  );
};

export default FinalPassSetting;
