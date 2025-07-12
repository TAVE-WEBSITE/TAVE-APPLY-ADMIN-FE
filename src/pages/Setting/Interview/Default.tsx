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

const interviewDays = ["2025-08-11", "2025-08-12", "2025-08-13", "2025-08-14"];

const Default = () => {
  const { data: addressData, isLoading } = useQuery({
    queryKey: ["setting", "address", "get"],
    queryFn: fetchAddress,
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

  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState(["", "", "", ""]);
  const [openChatLinks, setOpenChatLinks] = useState(["", "", "", ""]);
  const [documentLinks, setDocumentLinks] = useState(["", "", "", ""]);

  // 기존 면접 설정 데이터 로드
  useEffect(() => {
    if (addressData?.result) {
      const existingData = addressData.result;
      console.log("기존 면접 설정 데이터:", existingData);
      
      // 기존 데이터가 있으면 폼에 설정
      if (existingData) {
        // 주소 정보 설정
        setAddress(existingData.generalAddress || "");
        
        // 상세주소 설정 (모든 일차에 동일 적용)
        setDetailAddress(prev => {
          const updated = [...prev];
          updated[0] = existingData.detailAddress || "";
          return updated;
        });
        
        // 오픈채팅방 링크 설정
        setOpenChatLinks([
          existingData.firstOpenChatLink || "",
          existingData.secondOpenChatLink || "",
          existingData.thirdOpenChatLink || "",
          existingData.fourthOpenChatLink || ""
        ]);
        
        // 문서 링크 설정
        setDocumentLinks([
          existingData.firstDocumentLink || "",
          existingData.secondDocumentLink || "",
          existingData.thirdDocumentLink || "",
          existingData.fourthDocumentLink || ""
        ]);
      }
    }
  }, [addressData]);

  const handleSubmit = () => {
    // 필수 필드 검증
    if (!address.trim()) {
      alert("주소를 입력해주세요.");
      return;
    }

    const payload = interviewDays.map((day, idx) => ({
      interviewDay: day,
      generalAddress: address,
      detailAddress: detailAddress[0] || "", // 모든 일차에 동일한 상세주소 적용
      openChatLink: openChatLinks[idx] || "",
      code: documentLinks[idx] || "",
    }));

    console.log("면접 설정 등록 데이터:", payload);
    mutate(payload);
  };

  return (
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
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="주소를 입력해주세요"
              className="w-full"
            />
            <Input
              value={detailAddress[0]}
              onChange={(e) => {
                const updated = [...detailAddress];
                updated[0] = e.target.value;
                setDetailAddress(updated);
              }}
              placeholder="상세 주소를 입력해주세요 (예시: 강의실 호수) - 모든 일차에 동일 적용"
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
            {Array.from({ length: 4 }, (_, index) => (
              <Input.TitleContainer
                key={index}
                title={`${index + 1}일차 (8/10)`}
              >
                <FlexBox className="gap-4">
                  <Input.WithLabel
                    label="오픈채팅방 링크"
                    iconType="Link"
                    placeholder="링크를 입력해주세요"
                    width="w-lg"
                    value={openChatLinks[index]}
                    onChange={(e) => {
                      const updated = [...openChatLinks];
                      updated[index] = e.target.value;
                      setOpenChatLinks(updated);
                    }}
                  ></Input.WithLabel>
                  <Input.WithLabel
                    label="문서 링크"
                    iconType="Link"
                    placeholder="문서 링크를 입력해주세요"
                    value={documentLinks[index]}
                    onChange={(e) => {
                      const updated = [...documentLinks];
                      updated[index] = e.target.value;
                      setDocumentLinks(updated);
                    }}
                  ></Input.WithLabel>
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
