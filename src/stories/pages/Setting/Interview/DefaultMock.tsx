import { useState } from "react";
import Input from "@/components/Input/Input";
import Body from "@/components/Layout/Body";
import FlexBox from "@/components/Layout/FlexBox";
import Button from "@/components/Button/Button";

const DefaultMock = () => {
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [openChatLinks, setOpenChatLinks] = useState(Array(4).fill(""));
  const [openChatPasswords, setOpenChatPasswords] = useState(Array(4).fill(""));

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
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
              placeholder="상세 주소를 입력해주세요 (예시: 강의실 호수)"
              className="w-full"
            />
          </FlexBox>
        </section>

        <section className="border border-gray-300 bg-white rounded-xl flex-1 rounded-xl min-h-[650px] px-6 py-5">
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
                <FlexBox className="w-full gap-4">
                  <Input.WithLabel
                    label="오픈채팅방 링크"
                    iconType="Link"
                    placeholder="링크를 입력해주세요"
                    value={openChatLinks[index]}
                    width="w-lg"
                    onChange={(e) => {
                      const newLinks = [...openChatLinks];
                      newLinks[index] = e.target.value;
                      setOpenChatLinks(newLinks);
                    }}
                  ></Input.WithLabel>
                  <Input.WithLabel
                    label="비밀번호 설정"
                    iconType="Key"
                    placeholder="비밀번호를 입력해주세요"
                    className="w-full"
                    value={openChatPasswords[index]}
                    onChange={(e) => {
                      const newPasswords = [...openChatPasswords];
                      newPasswords[index] = e.target.value;
                      setOpenChatPasswords(newPasswords);
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
          className="w-[88px] text-center"
          onClick={() => {
            // 저장 시뮬레이션
            console.log("저장된 데이터:", {
              address,
              detailAddress,
              openChatLinks,
              openChatPasswords,
            });
          }}
        >
          등록하기
        </Button>
      </div>
    </Body>
  );
};

export { DefaultMock };
