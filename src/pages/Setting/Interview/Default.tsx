import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Input from "@/components/Input/Input";
import Body from "@/components/Layout/Body";
import FlexBox from "@/components/Layout/FlexBox";
import Button from "@/components/Button/Button";
import {
  fetchAddress,
  postInterviewPlace,
} from "@/pages/Setting/api/Interview";
import type { InterviewAddress } from "@/pages/Setting/api/Interview";
import ToastMessage from "@/components/Modal/ToastMessage";

const Default = () => {
  const { data } = useQuery({
    queryKey: ["setting", "address", "get"],
    queryFn: fetchAddress,
    staleTime: 1000 * 60 * 5,
  });

  const { mutate } = useMutation({
    mutationKey: ["setting", "interview", "post"],
    mutationFn: postInterviewPlace,
    onSuccess: (response) => {
      setMessage(response.result);
      setIsToastOpen(true);
    },
  });

  const [interviewAddress, setInterviewAddress] = useState<InterviewAddress[]>(
    []
  );
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (data) {
      const result: InterviewAddress[] = data.result;
      setInterviewAddress(result);
    }
  }, [data]);

  const handleGeneralAddressChange = (value: string) => {
    const updated = [...interviewAddress].map((e) => {
      return { ...e, generalAddress: value };
    });
    setInterviewAddress(updated);
  };

  const handleDetailAddressChange = (value: string) => {
    const updated = [...interviewAddress].map((e) => {
      return { ...e, detailAddress: value };
    });
    setInterviewAddress(updated);
  };

  const handleOpenChatLinkChange = (index: number, value: string) => {
    const updated = [...interviewAddress];
    updated[index] = { ...updated[index], openChatLink: value };
    setInterviewAddress(updated);
  };

  const handleCodeChange = (index: number, value: string) => {
    const updated = [...interviewAddress];
    updated[index] = { ...updated[index], code: value };
    setInterviewAddress(updated);
  };

  const handleSubmit = () => {
    const payload: Omit<InterviewAddress, "id">[] = interviewAddress.map(
      ({ id, ...rest }) => rest
    );
    mutate(payload);
  };

  return (
    <form
      action=""
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Body className="py-8 gap-8 px-12">
        <FlexBox className="items-start">
          <section className="w-[650px]">
            <FlexBox className="gap-2 text-gray-900 mb-2">
              <div className="bg-gray-200 py-2 px-4 rounded-full font-semibold min-w-[32px] text-center">
                1
              </div>
              <h3 className="font-semibold text-base">면접 장소 등록</h3>
            </FlexBox>

            <FlexBox direction="col" className="gap-2 max-w-xl pl-12">
              <Input
                value={
                  interviewAddress.length > 0
                    ? interviewAddress[0].generalAddress
                    : ""
                }
                onChange={(e) => handleGeneralAddressChange(e.target.value)}
                placeholder="주소를 입력해주세요"
                className="w-full"
              />
              <Input
                value={
                  interviewAddress.length > 0
                    ? interviewAddress[0].detailAddress
                    : ""
                }
                onChange={(e) => handleDetailAddressChange(e.target.value)}
                placeholder="상세 주소를 입력해주세요 (예시: 강의실 호수)"
                className="w-full"
              />
            </FlexBox>
          </section>

          <section className="border border-gray-300 bg-white flex-1 rounded-xl min-h-[650px] px-6 py-5">
            <h2 className="text-gray-900 font-semibold text-lg">
              면접 안내 오픈채팅방 설정
            </h2>
            <FlexBox direction="col" className="gap-4">
              <div className="w-full border-t border-gray-300 mt-6"></div>
            </FlexBox>
            <FlexBox direction="col" className="gap-4 p-4 items-start">
              {interviewAddress &&
                interviewAddress.map((e, i) => (
                  <Input.TitleContainer
                    key={e.id}
                    title={`${i + 1}일차 (${e.interviewDay.slice(5)})`}
                  >
                    <FlexBox className="gap-4">
                      <Input.WithLabel
                        label="오픈채팅방 링크"
                        iconType="Link"
                        placeholder="링크를 입력해주세요"
                        width="w-lg"
                        value={e.openChatLink}
                        onChange={(e) =>
                          handleOpenChatLinkChange(i, e.target.value)
                        }
                      ></Input.WithLabel>
                      <Input.WithLabel
                        label="비밀번호 설정"
                        iconType="Key"
                        placeholder="비밀번호를 입력해주세요"
                        value={e.code}
                        onChange={(e) => handleCodeChange(i, e.target.value)}
                      ></Input.WithLabel>
                    </FlexBox>
                  </Input.TitleContainer>
                ))}
            </FlexBox>
          </section>
        </FlexBox>
        <div className="flex justify-center">
          <Button type="submit" className="w-[88px] text-center">
            등록하기
          </Button>
        </div>
      </Body>
      <ToastMessage
        isOpen={isToastOpen}
        setIsOpen={setIsToastOpen}
        message={message}
      />
    </form>
  );
};

export default Default;
