import { useRef, useState } from "react";
import FlexBox from "@/components/Layout/FlexBox";
import Icon from "@/components/Icon/Icon";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Tab from "@/components/Tab/Tab";
import Body from "@/components/Layout/Body";
import Modal from "@/components/Modal/Modal";
import ToastMessage from "@/components/Modal/ToastMessage";
import { DefaultMock } from "./DefaultMock";
import { TimeTableMock } from "./TimeTableMock";

const tabCategories = ["면접 시간표 등록", "기본 설정"];

const interviewSettingPageMap: Record<string, React.ComponentType> = {
  "면접 시간표 등록": TimeTableMock,
  "기본 설정": DefaultMock,
};

const InterviewSettingMock = () => {
  const [activeTab, setActiveTab] = useState("면접 시간표 등록");
  const CurrentTab = interviewSettingPageMap[activeTab];

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [postFileResult, setPostFileResult] = useState<{
    message: string;
  } | null>(null);

  /** 파일 */
  const [intervieweeScheduleFile, setIntervieweeScheduleFile] =
    useState<File | null>(null);
  const [interviewerScheduleFile, setInterviewerScheduleFile] =
    useState<File | null>(null);
  const [evaluationSheetTemplateFile, setEvaluationSheetTemplateFile] =
    useState<File | null>(null);

  const openModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const postFiles = async () => {
    if (
      intervieweeScheduleFile &&
      interviewerScheduleFile &&
      evaluationSheetTemplateFile
    ) {
      setIsPending(true);
      // 파일 업로드 시뮬레이션
      setTimeout(() => {
        setPostFileResult({ message: "파일이 성공적으로 업로드되었습니다." });
        setIsToastOpen(true);
        setIsPending(false);
      }, 1000);
    } else {
      setIsPending(true);
      setTimeout(() => {
        setPostFileResult({ message: "누락된 파일이 있습니다." });
        setIsToastOpen(true);
        setIsPending(false);
      }, 1000);
    }
  };

  return (
    <div className="text-white">
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <h1 className="font-bold text-4xl">면접 설정</h1>
        <Button onClick={openModal}>
          <Icon type="Plus" size={18} />
          시간표 등록하기
        </Button>
      </FlexBox>
      <Body className="py-8 gap-8 px-12">
        <Tab
          categories={tabCategories}
          active={activeTab}
          onChange={setActiveTab}
        />
        {<CurrentTab />}
      </Body>

      <Modal
        dialogRef={dialogRef}
        buttonCount={2}
        onConfirm={postFiles}
        isPending={isPending}
        confirmText="등록"
        title="면접 시간표 등록"
      >
        {postFileResult && (
          <ToastMessage
            message={postFileResult.message}
            isOpen={isToastOpen}
            isError={postFileResult.message === "누락된 파일이 있습니다."}
            setIsOpen={setIsToastOpen}
          />
        )}
        <div className="space-y-6 p-2">
          {/* Step 1 */}
          <div className="w-full">
            <div className="flex items-center gap-2 mb-2 text-gray-900">
              <div className="bg-gray-200 py-2 px-4 rounded-full font-semibold min-w-[32px] text-center">
                1
              </div>
              <h3 className="font-semibold text-base">
                면접자 시간표 파일 다운로드 (CSV)
              </h3>
            </div>

            <div className="pl-13">
              <div className="grid grid-cols-2 gap-2 max-w-lg">
                <button className="px-4 py-2 cursor-pointer bg-white border border-gray-300 text-gray-600 rounded-xl flex justify-between items-center">
                  면접자 시간 파악
                  <Icon type="Upload" size={16} />
                </button>
                <button className="px-4 py-2 cursor-pointer bg-white border border-gray-300 text-gray-600 rounded-xl flex justify-between items-center">
                  면접자 시간 파악
                  <Icon type="Upload" size={16} />
                </button>
                <button className="px-4 py-2 cursor-pointer bg-white border border-gray-300 text-gray-600 rounded-xl flex justify-between items-center">
                  면접자 시간 파악
                  <Icon type="Upload" size={16} />
                </button>
                <button className="px-4 py-2 cursor-pointer bg-white border border-gray-300 text-gray-600 rounded-xl flex justify-between items-center">
                  면접자 시간 파악
                  <Icon type="Upload" size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="w-full">
            <div className="flex items-center gap-2 text-gray-900">
              <div className="bg-gray-200 py-2 px-4 rounded-full font-semibold min-w-[32px] text-center">
                2
              </div>
              <h3 className="font-semibold text-base">
                면접자 시간표 파일 업로드 (CSV)
              </h3>
            </div>

            <div className="pl-13">
              <p className="text-gray-500 text-sm mb-2">
                면접자 시간표 양식에 맞게 올려주시면, 자동으로 등록됩니다 :)
              </p>
              <div className="flex items-center gap-3 max-w-lg">
                <Input
                  type="file"
                  placeholder="파일을 업로드해주세요"
                  className="flex-1"
                  allowFile={true}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setIntervieweeScheduleFile(file);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="w-full">
            <div className="flex items-center gap-2 text-gray-900">
              <div className="bg-gray-200 py-2 px-4 rounded-full font-semibold min-w-[32px] text-center">
                3
              </div>
              <h3 className="font-semibold text-base">
                면접관 시간표 파일 업로드 (CSV)
              </h3>
            </div>

            <div className="pl-13">
              <p className="text-gray-500 text-sm mb-2">
                면접에 참여할 운영진이 보게 될 시간표를 업로드해주세요.
              </p>
              <div className="flex items-center gap-3 max-w-lg">
                <Input
                  type="file"
                  placeholder="파일을 업로드해주세요"
                  className="flex-1"
                  allowFile={true}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setInterviewerScheduleFile(file);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="w-full">
            <div className="flex items-center gap-2 text-gray-900">
              <div className="bg-gray-200 py-2 px-4 rounded-full font-semibold min-w-[32px] text-center">
                4
              </div>
              <h3 className="font-semibold text-base">
                면접 평가 시트 템플릿 업로드 (CSV)
              </h3>
            </div>

            <div className="pl-13">
              <p className="text-gray-500 text-sm mb-2">
                운영진이 평가할 시트 템플릿을 업로드해주세요.
              </p>
              <div className="flex items-center max-w-lg">
                <Input
                  type="file"
                  placeholder="파일을 업로드해주세요"
                  className="flex-1"
                  allowFile={true}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEvaluationSheetTemplateFile(file);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InterviewSettingMock;
