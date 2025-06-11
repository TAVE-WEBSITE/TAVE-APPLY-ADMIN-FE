import { useEffect, useState } from "react";
import Body from "@/components/Layout/Body";
import FlexBox from "@/components/Layout/FlexBox";
import Input from "@/components/Input/Input";
import DatePicker from "@/components/DatePicker/DatePicker";
import Button from "@/components/Button/Button";
import { useDefaultSetting } from "@/hooks/Setting/useDefault";
import { formatDateTimeInput } from "@/utils/formatDate";

import ToastMessage from "@/components/Modal/ToastMessage";
import Icon from "@/components/Icon/Icon";

const DefaultSetting = () => {
  const {
    nextGeneration,
    setNextGeneration,
    documentStartDate,
    setDocumentStartDate,
    documentEndDate,
    setDocumentEndDate,
    documentResultDateTime,
    setDocumentResultDateTime,
    interviewStartDate,
    setInterviewStartDate,
    interviewEndDate,
    setInterviewEndDate,
    finalResultDateTime,
    setFinalResultDateTime,
    homepageOpenStartDate,
    setHomepageOpenStartDate,
    homepageOpenEndDate,
    setHomepageOpenEndDate,
    updateDefaultSetting,
    mutationData,
    isPending,
    isSuccess,
    isError,
  } = useDefaultSetting();
  const [isToastOpen, setIsToastOpen] = useState(false);

  useEffect(() => {
    if (isSuccess || isError) {
      setIsToastOpen(true);
    }
  }, [isSuccess, isError]);

  const handleUpdate = () => {
    updateDefaultSetting();
  };

  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <h1 className="font-bold text-4xl">신규 지원 초기 설정</h1>
        <h2 className="font-semibold text-xl">15기</h2>
      </FlexBox>

      <Body>
        <FlexBox
          direction="col"
          className="gap-4 justify-center mx-auto pt-8 gap-8"
        >
          <Input.NumberContainer number={1} className="items-start">
            <Input.TitleContainer title="다음 기수를 입력해주세요">
              <Input
                placeholder="기수를 입력해주세요"
                value={nextGeneration}
                onChange={(e) => setNextGeneration(e.target.value)}
                width="w-xl"
              />
            </Input.TitleContainer>
          </Input.NumberContainer>

          <Input.NumberContainer number={2} className="items-start">
            <Input.TitleContainer
              title="앞으로의 모집 일정을 알려주세요"
              className="pt-1 mb-4"
            >
              <FlexBox className={`justify-between gap-4`}>
                <FlexBox direction="col" className={`items-start w-full`}>
                  <FlexBox className="gap-2">
                    <Icon type="CheckCircle" size={20} />
                    <span className="text-gray-900">서류 모집</span>
                  </FlexBox>
                  <FlexBox className="gap-2">
                    <DatePicker
                      value={documentStartDate}
                      setValue={setDocumentStartDate}
                    />
                    <div className="text-gray-300 font-bold w-3 border border-t" />
                    <DatePicker
                      value={documentEndDate}
                      setValue={setDocumentEndDate}
                    />
                  </FlexBox>
                </FlexBox>
              </FlexBox>
              <Input.WithLabel
                iconType="ClockCircle"
                label="서류 발표"
                labelColor="text-gray-900"
                placeholder="YYYY.MM.DD HH:MM"
                width="w-xl"
                value={documentResultDateTime}
                onChange={(e) =>
                  formatDateTimeInput(e, setDocumentResultDateTime)
                }
              />

              <FlexBox className={`justify-between gap-4`}>
                <FlexBox direction="col" className={`items-start w-full`}>
                  <FlexBox className="gap-2">
                    <Icon type="CheckCircle" size={20} />
                    <span className="text-gray-900">면접 기간</span>
                  </FlexBox>
                  <FlexBox className="gap-2">
                    <DatePicker
                      value={interviewStartDate}
                      setValue={setInterviewStartDate}
                    />
                    <div className="text-gray-300 font-bold w-3 border border-t" />
                    <DatePicker
                      value={interviewEndDate}
                      setValue={setInterviewEndDate}
                    />
                  </FlexBox>
                </FlexBox>
              </FlexBox>

              <Input.WithLabel
                iconType="ClockCircle"
                label="최종 발표"
                labelColor="text-gray-900"
                placeholder="YYYY.MM.DD HH:MM"
                width="w-xl"
                value={finalResultDateTime}
                onChange={(e) => formatDateTimeInput(e, setFinalResultDateTime)}
              />
            </Input.TitleContainer>
          </Input.NumberContainer>

          <Input.NumberContainer number={3} className="items-start">
            <Input.HelperTextContainer
              title="홈페이지 공개"
              helperText="신규 기수 지원 안내를 포함한 홈페이지에 접근이 가능한 일정입니다 :)"
            >
              <FlexBox className="gap-2">
                <DatePicker
                  value={homepageOpenStartDate}
                  setValue={setHomepageOpenStartDate}
                />
                <div className="text-gray-300 font-bold w-3 border border-t" />
                <DatePicker
                  value={homepageOpenEndDate}
                  setValue={setHomepageOpenEndDate}
                />
              </FlexBox>
            </Input.HelperTextContainer>
          </Input.NumberContainer>
        </FlexBox>
        <div className="w-[100px] mx-auto mt-12 mb-[300px]">
          <Button
            isPending={isPending}
            disabled={isPending}
            className="w-[100px]"
            onClick={handleUpdate}
          >
            저장하기
          </Button>
          <ToastMessage
            message={mutationData ? mutationData.message : ""}
            isOpen={isToastOpen}
            isError={isError}
            setIsOpen={setIsToastOpen}
          />
        </div>
      </Body>
    </div>
  );
};

export default DefaultSetting;
