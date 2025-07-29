import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Input from "@/components/Input/Input";
import Body from "@/components/Layout/Body";
import FlexBox from "@/components/Layout/FlexBox";
import Button from "@/components/Button/Button";
import {
  fetchAddress,
  postInterviewPlace,
  fetchInterviewTime,
} from "@/pages/Setting/api/Interview";
import type { InterviewAddress } from "@/pages/Setting/api/Interview";
import ToastMessage from "@/components/Modal/ToastMessage";


const Default = () => {
  const [interviewDates, setInterviewDates] = useState<string[]>([]);
  const [formattedDates, setFormattedDates] = useState<string[]>([]);
  const { data: addressData, isLoading, error } = useQuery({
    queryKey: ["setting", "address", "get"],
    queryFn: fetchAddress,
    retry: 1, // 재시도 횟수 제한
    retryDelay: 1000, // 재시도 간격
  });


  const { data: interviewTimeData } = useQuery({
    queryKey: ["setting", "interview", "time"],
    queryFn: fetchInterviewTime,
    retry: 1,
    retryDelay: 1000,


  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["setting", "interview", "post"],
    mutationFn: postInterviewPlace,

    onSuccess: (data) => {
      console.log("면접 설정 등록 성공:", data);
      alert("면접 설정이 성공적으로 등록되었습니다.");
    },
    onError: (error) => {
      console.error("면접 설정 등록 실패:", error);
      alert("면접 설정 등록에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const [addresses, setAddresses] = useState<string[]>(["", "", "", ""]);
  const [detailAddress, setDetailAddress] = useState(["", "", "", ""]);
  const [openChatLinks, setOpenChatLinks] = useState(["", "", "", ""]);
  const [documentLinks, setDocumentLinks] = useState(["", "", "", ""]);


  useEffect(() => {
    if (interviewTimeData?.result) {
      const timeData = interviewTimeData.result;

      const dates = timeData.map((item: any) => item.originalDate);
      const formatted = timeData.map((item: any) => item.formattedDate);
      
      setInterviewDates(dates);
      setFormattedDates(formatted);

    }
  }, [interviewTimeData]);

  useEffect(() => {
    if (addressData?.result && interviewDates.length > 0) {
      const placeData = addressData.result;

      const newAddresses = [...addresses];
      const newDetailAddresses = [...detailAddress];
      const newOpenChatLinks = [...openChatLinks];
      const newDocumentLinks = [...documentLinks];
      
              placeData.forEach((item: any) => {
          const dateIndex = interviewDates.findIndex(date => date === item.interviewDay);
          if (dateIndex !== -1) {
            newAddresses[dateIndex] = item.generalAddress || "";
            newDetailAddresses[dateIndex] = item.detailAddress || "";
            newOpenChatLinks[dateIndex] = item.openChatLink || "";
            newDocumentLinks[dateIndex] = item.code || "";
          }
        });
      
      setAddresses(newAddresses);
      setDetailAddress(newDetailAddresses);
      setOpenChatLinks(newOpenChatLinks);
      setDocumentLinks(newDocumentLinks);

    }
  }, [addressData, interviewDates]);

  const handleSubmit = () => {
    // 필수 필드 검증
    if (!addresses[0]?.trim()) {
      alert("주소를 입력해주세요.");
      return;
    }

    if (interviewDates.length === 0) {
      alert("면접 날짜 데이터를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const payload = interviewDates.map((date, idx) => ({
      interviewDate: date,
      generalAddress: addresses[idx] || "",
      detailAddress: detailAddress[idx] || "",
      openChatLink: openChatLinks[idx] || "",
      code: documentLinks[idx] || "",
    }));
    mutate(payload);
  };

  return (

    <Body className="py-8 gap-8 px-12">
      {isLoading && (
        <div className="text-center py-4">
          <p className="text-gray-600">면접 설정 데이터를 불러오는 중...</p>
        </div>
      )}
      {interviewDates.length === 0 && !isLoading && (
        <div className="text-center py-4">
          <p className="text-gray-600">면접 날짜 정보를 불러오는 중...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-4">
          <p className="text-red-600">면접 설정 데이터 조회에 실패했습니다. 새로고침 후 다시 시도해주세요.</p>
          <p className="text-sm text-gray-500 mt-1">에러: {error.message}</p>
        </div>
      )}
      
      <FlexBox className="items-start gap-6">
        <section className="border border-gray-300 bg-white w-1/2 rounded-xl min-h-[650px] px-6 py-5">
          <h2 className="text-gray-900 font-semibold text-lg">
            면접 장소 설정
          </h2>
          <FlexBox direction="col" className="gap-4">
            <div className="w-full border-t border-gray-300 mt-6"></div>
          </FlexBox>
          <FlexBox direction="col" className="gap-4 w-full p-4 items-start">
            {Array.from({ length: Math.max(interviewDates.length, 4) }, (_, index) => (
              <Input.TitleContainer
                key={index}
                title={`${index + 1}일차 (${formattedDates[index] || '날짜 로딩 중...'})`}
              >
                <FlexBox className="gap-4 w-full">
                  <div className="flex-1">
                    <Input.WithLabel
                      label="주소"
                      iconType="Link"
                      placeholder="면접 장소의 주소를 입력해주세요"
                      width="w-full"
                      value={addresses[index] || ""}
                      onChange={(e) => {
                        const updated = [...addresses];
                        updated[index] = e.target.value;
                        setAddresses(updated);
                      }}
                    ></Input.WithLabel>
                  </div>
                  <div className="flex-1">
                    <Input.WithLabel
                      label="상세 주소"
                      iconType="Link"
                      placeholder="자세한 주소 입력 (예시: 강의실 호수)"
                      width="w-full"
                      value={detailAddress[index] || ""}
                      onChange={(e) => {
                        const updated = [...detailAddress];
                        updated[index] = e.target.value;
                        setDetailAddress(updated);
                      }}
                    ></Input.WithLabel>
                  </div>
                </FlexBox>
              </Input.TitleContainer>
            ))}
          </FlexBox>
        </section>

        <section className="border border-gray-300 bg-white w-1/2 rounded-xl min-h-[650px] px-6 py-5">
          <h2 className="text-gray-900 font-semibold text-lg">
            면접 안내 오픈채팅방 설정
          </h2>
          <FlexBox direction="col" className="gap-4">
            <div className="w-full border-t border-gray-300 mt-6"></div>
          </FlexBox>
          <FlexBox direction="col" className="gap-4 w-full p-4 items-start">
            {Array.from({ length: Math.max(interviewDates.length, 4) }, (_, index) => (
              <Input.TitleContainer
                key={index}
                title={`${index + 1}일차 (${formattedDates[index] || '날짜 로딩 중...'})`}
              
              >
                <FlexBox className="gap-4 w-full">
                  <div className="flex-1">
                    <Input.WithLabel
                      label="오픈채팅방 링크"
                      iconType="Link"
                      placeholder="링크를 입력해주세요"
                      width="w-full"
                      value={openChatLinks[index]}
                      onChange={(e) => {
                        const updated = [...openChatLinks];
                        updated[index] = e.target.value;
                        setOpenChatLinks(updated);
                      }}
                    ></Input.WithLabel>
                  </div>
                  <div className="flex-1">
                    <Input.WithLabel
                      label="비밀번호"
                      iconType="Link"
                      placeholder="비밀번호를 입력해주세요"
                      width="w-full"
                      value={documentLinks[index]}
                      onChange={(e) => {
                        const updated = [...documentLinks];
                        updated[index] = e.target.value;
                        setDocumentLinks(updated);
                      }}
                    ></Input.WithLabel>
                  </div>
                </FlexBox>
              </Input.TitleContainer>
            ))}
          </FlexBox>
        </section>
      </FlexBox>
      <div className="flex justify-center">
        <Button 
          className="w-36 text-center" 
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "등록 중..." : "등록하기"}
        </Button>
      </div>
    </Body>


  );
};

export default Default;
