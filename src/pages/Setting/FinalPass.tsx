import { useState } from "react";
import Body from "@/components/Layout/Body";
import FlexBox from "@/components/Layout/FlexBox";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { formatDateTimeInput } from "@/utils/formatDate";
import Icon from "@/components/Icon/Icon";

import ToastMessage from "@/components/Modal/ToastMessage";

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

const FinalPassSetting = () => {
  const [entireFee, setEntireFee] = useState("");
  const [clubFee, setClubFee] = useState("");
  const [MTFee, setMTFee] = useState("");
  //const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [feeEndDate, setFeeEndDate] = useState("");
  const [surveyLink, setSurveyLink] = useState("");
  const [surveyEndDate, setSurveyEndDate] = useState("");
  const [OTLink, setOTLink] = useState("");
  const [password, setPassword] = useState("");
  const [OTEndDate, setOTEndDate] = useState("");

  const [isPending, setIsPending] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);

  const handleSave = () => {
    setIsPending(true);
    setTimeout(() => {
      setIsToastOpen(true);
      setIsPending(false);
    }, 1000);
  };

  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <h1 className="font-bold text-4xl">최종 합격 안내 설정</h1>
      </FlexBox>

      <Body>
        <FlexBox
          direction="col"
          className="gap-4 justify-center mx-auto pt-8 gap-8"
        >
          <Input.NumberContainer number={1} className="items-start">
            <Input.TitleContainer title="회비">
              <Input.WithLabel
                type="number"
                label="회비 금액"
                iconType="Check"
                labelColor="text-gray-900"
                placeholder="금액 입력해주세요"
                value={entireFee}
                width="w-xl"
                onChange={(e) => setEntireFee(e.target.value)}
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
                      value={clubFee}
                      onChange={(e) => setClubFee(e.target.value)}
                    />
                    <Icon type="Plus" size={18} className="text-gray-400" />
                    <div className="rounded-3xl border border-blue-300 bg-blue-100 text-blue-700 text-sm p-2">
                      MT 회비
                    </div>
                    <Input
                      type="number"
                      placeholder="금액을 입력하세요"
                      value={MTFee}
                      onChange={(e) => setMTFee(e.target.value)}
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
                value={feeEndDate}
                width="w-xl"
                onChange={(e) => formatDateTimeInput(e, setFeeEndDate)}
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
                value={surveyEndDate}
                width="w-xl"
                onChange={(e) => formatDateTimeInput(e, setSurveyEndDate)}
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
                value={OTLink}
                width="w-xl"
                onChange={(e) => setOTLink(e.target.value)}
                className="mb-2"
              />
              <Input.WithLabel
                label="비밀번호"
                iconType="Check"
                labelColor="text-gray-900"
                placeholder="채팅방 비밀번호 입력해주세요"
                value={password}
                width="w-xl"
                onChange={(e) => setPassword(e.target.value)}
                className="mb-2"
              />
              <Input.WithLabel
                label="마감 기한"
                iconType="Check"
                labelColor="text-gray-900"
                placeholder="YYYY.MM.DD HH:MM"
                value={OTEndDate}
                width="w-xl"
                onChange={(e) => formatDateTimeInput(e, setOTEndDate)}
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
          message="최종 합격 안내 설정을 변경하셨습니다"
          isOpen={isToastOpen}
          setIsOpen={setIsToastOpen}
        />
      </Body>
    </div>
  );
};

export default FinalPassSetting;
