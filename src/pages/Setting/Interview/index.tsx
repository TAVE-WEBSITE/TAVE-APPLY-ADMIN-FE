import { useRef, useState } from "react";
import FlexBox from "@/components/Layout/FlexBox";
import Icon from "@/components/Icon/Icon";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Tab from "@/components/Tab/Tab";
import Body from "@/components/Layout/Body";
import Modal from "@/components/Modal/Modal";
import { postInterviewFile, 
  downloadInterviewTimeTableForm, 
  downloadInterviewerTimeTableForm, 
  generateInterviewTimeTable, 
  downloadInterviewerTimeTable } from "@/pages/Setting/api/Interview";
import { getTimeTableForm } from "@/pages/Evaluation/api";
import { useMutation } from "@tanstack/react-query";
import ToastMessage from "@/components/Modal/ToastMessage";
import Default from "./Default";
import TimeTable from "./TimeTable";

const tabCategories = ["면접 시간표 등록", "기본 설정"];

const interviewSettingPageMap: Record<string, React.ComponentType> = {
  "면접 시간표 등록": TimeTable,
  "기본 설정": Default,
};

const InterviewSetting = () => {
  const [activeTab, setActiveTab] = useState("면접 시간표 등록");
  const CurrentTab = interviewSettingPageMap[activeTab];

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [isDownloadingTimeTable, setIsDownloadingTimeTable] = useState(false);
  const [isDownloadingInterviewer, setIsDownloadingInterviewer] = useState(false);
  const [isGeneratingTimeTable, setIsGeneratingTimeTable] = useState(false);
  const [isDownloadingInterviewerTime, setIsDownloadingInterviewerTime] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  /** 파일 */
  const [intervieweeScheduleFile, setIntervieweeScheduleFile] =
    useState<File | null>(null);
  const [interviewerScheduleFile, setInterviewerScheduleFile] =
    useState<File | null>(null);
  const [evaluationSheetTemplateFile, setEvaluationSheetTemplateFile] =
    useState<File | null>(null);

  // 파일 선택을 위한 ref들
  const intervieweeFileRef = useRef<HTMLInputElement>(null);
  const interviewerFileRef = useRef<HTMLInputElement>(null);
  const evaluationFileRef = useRef<HTMLInputElement>(null);

  const {
    mutate,
    data: postFileResult,
    isPending,
  } = useMutation({
    mutationKey: ["setting", "files"],
    mutationFn: (data: { file: File }) => postInterviewFile(data),
    onSuccess: () => {
      setIsToastOpen(true);
    },
    onError: () => {
      setIsToastOpen(true);
    },
  });

  const openModal = () => {
    if (dialogRef) {
      dialogRef.current?.showModal();
    }
  };

  const handleDownloadTimeTableForm = async () => {
    try {
      setIsDownloadingTimeTable(true);
      await downloadInterviewTimeTableForm();
    } catch (error) {
      console.error("면접자 시간표 양식 다운로드 실패:", error);
    } finally {
      setIsDownloadingTimeTable(false);
    }
  };

  const handleDownloadInterviewerTimeTableForm = async () => {
    try {
      setIsDownloadingInterviewer(true);
      await downloadInterviewerTimeTableForm();
    } catch (error) {
      console.error("면접관 시간표 포함 다운로드 실패:", error);
    } finally {
      setIsDownloadingInterviewer(false);
    }
  };

  const handleGenerateInterviewTimeTable = async () => {
    try {
      setIsGeneratingTimeTable(true);
      await generateInterviewTimeTable();
      setToastMessage("면접 가능 시간표가 성공적으로 생성되었습니다.");
      setIsToastOpen(true);
    } catch (error) {
      console.error("면접 가능 시간표 생성 실패:", error);
      setToastMessage("면접 가능 시간표 생성에 실패했습니다.");
      setIsToastOpen(true);
    } finally {
      setIsGeneratingTimeTable(false);
    }
  };

  const handleDownloadInterviewerTime = async () => {
    try {
      setIsDownloadingInterviewerTime(true);
      await downloadInterviewerTimeTable();
      setToastMessage("면접자 시간 파악 파일이 성공적으로 다운로드되었습니다.");
      setIsToastOpen(true);
    } catch (error) {
      console.error("면접자 시간 파악 다운로드 실패:", error);
      setToastMessage("면접자 시간 파악 다운로드에 실패했습니다.");
      setIsToastOpen(true);
    } finally {
      setIsDownloadingInterviewerTime(false);
    }
  };

  const postFiles = async () => {
    // 업로드된 파일들을 개별적으로 처리
    const uploadPromises = [];
    
    if (intervieweeScheduleFile) {
      console.log("면접자 시간표 파일 업로드 중...");
      uploadPromises.push(
        mutate({
          file: intervieweeScheduleFile,
        })
      );
    }
    
    if (interviewerScheduleFile) {
      console.log("면접관 시간표 파일 업로드 중...");
      uploadPromises.push(
        mutate({
          file: interviewerScheduleFile,
        })
      );
    }
    
    if (evaluationSheetTemplateFile) {
      console.log("평가 시트 템플릿 파일 업로드 중...");
      uploadPromises.push(
        mutate({
          file: evaluationSheetTemplateFile,
        })
      );
    }

    // 최소 하나의 파일이라도 업로드된 경우에만 실행
    if (uploadPromises.length > 0) {
      console.log(`총 ${uploadPromises.length}개 파일 업로드 시작`);
      await Promise.all(uploadPromises);
      console.log("모든 파일 업로드 완료");
    } else {
      console.log("업로드할 파일이 없습니다.");
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
        {(postFileResult || toastMessage) && (
          <ToastMessage
            message={postFileResult?.message || toastMessage}
            isOpen={isToastOpen}
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
              면접 가능 시간표 생성 (EXCEL)
              </h3>
              
            </div>

            <div className="pl-13">
            <p className="text-gray-500 text-sm mb-2">
                자주 생성 시 서버에 무리가 가므로, <br/> 
                최대 10분 주기로 생성해주세요.
              </p>
              <div className="w-full">
                <button 
                  className="w-full whitespace-nowrap px-2 h-14 cursor-pointer bg-white border border-gray-300 text-gray-600 rounded-xl flex justify-between items-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleGenerateInterviewTimeTable}
                  disabled={isGeneratingTimeTable}
                >
                  {isGeneratingTimeTable ? "생성 중..." : "면접 가능 시간표 생성"}
                  <Icon type="Upload" size={16} className="rotate-180"/>
                </button>
                
                
              </div>
            </div>
          </div>
          {/* Step 1 */}
          <div className="w-full">
            <div className="flex items-center gap-2 mb-2 text-gray-900">
              <div className="bg-gray-200 py-2 px-4 rounded-full font-semibold min-w-[32px] text-center">
                2
              </div>
              <h3 className="font-semibold text-base">
                면접자 시간표 파일 다운로드 (EXCEL)
              </h3>
            </div>

            <div className="pl-13">
              <div className="grid grid-cols-2 gap-2 max-w-lg">
                <button 
                  className="whitespace-nowrap px-2 h-14 cursor-pointer bg-white border border-gray-300 text-gray-600 rounded-xl flex justify-between items-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDownloadInterviewerTime}
                  disabled={isDownloadingInterviewerTime}
                >
                  {isDownloadingInterviewerTime ? "다운로드 중..." : "면접자 시간 파악"}
                  <Icon type="Upload" size={16} />
                </button>
                <button 
                  className="whitespace-nowrap px-1 h-14 cursor-pointer bg-white border border-gray-300 text-gray-600 rounded-xl flex justify-between items-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDownloadTimeTableForm}
                  disabled={isDownloadingTimeTable}
                >
                  {isDownloadingTimeTable ? "다운로드 중..." : "면접자 시간표 양식"}
                  <Icon type="Upload" size={16} />
                </button>
                <button 
                  className="whitespace-nowrap px-1 h-14 cursor-pointer bg-white border border-gray-300 text-gray-600 rounded-xl flex justify-between items-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDownloadInterviewerTimeTableForm}
                  disabled={isDownloadingInterviewer}
                >
                  {isDownloadingInterviewer ? "다운로드 중..." : "면접관 시간표 포함"}
                  <Icon type="Upload" size={16} />
                </button>
                <button className="whitespace-nowrap px-1 h-14 cursor-pointer bg-white border border-gray-300 text-gray-600 rounded-xl flex justify-between items-center">
                  면접 평가 시트 양식
                  <Icon type="Upload" size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="w-full">
            <div className="flex items-center gap-2 text-gray-900">
              <div className="bg-gray-200 py-2 px-4 rounded-full font-semibold min-w-[32px] text-center">
                3
              </div>
              <h3 className="font-semibold text-base">
                면접자 시간표 파일 업로드 (Excel)
              </h3>
            </div>

            <div className="pl-13">
              <p className="text-gray-500 text-sm mb-2">
                면접자 시간표 양식에 맞게 올려주시면, 자동으로 등록됩니다 :)
              </p>
              <div className="flex gap-2 items-center justify-between">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="파일을 업로드해주세요"
                    className="w-full"
                    value={intervieweeScheduleFile?.name || ""}
                    readOnly
                  />
                  <input
                    ref={intervieweeFileRef}
                    type="file"
                    className="hidden"
                    accept=".,.xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setIntervieweeScheduleFile(file);
                      }
                    }}
                  />
                </div>
                <button 
                  className="cursor-pointer px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
                  onClick={() => intervieweeFileRef.current?.click()}
                >
                  파일 선택
                </button>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="w-full">
            <div className="flex items-center gap-2 text-gray-900">
              <div className="bg-gray-200 py-2 px-4 rounded-full font-semibold min-w-[32px] text-center">
                4
              </div>
              <h3 className="font-semibold text-base">
                면접관 시간표 파일 업로드 (Excel)
              </h3>
            </div>

            <div className="pl-13">
              <p className="text-gray-500 text-sm mb-2">
                면접에 참여할 운영진이 보게 될 시간표를 업로드해주세요.
              </p>
              <div className="flex gap-2 items-center justify-between">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="파일을 업로드해주세요"
                    className="w-full"
                    value={interviewerScheduleFile?.name || ""}
                    readOnly
                  />
                  <input
                    ref={interviewerFileRef}
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setInterviewerScheduleFile(file);
                      }
                    }}
                  />
                </div>
                <button 
                  className="cursor-pointer px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
                  onClick={() => interviewerFileRef.current?.click()}
                >
                  파일 선택
                </button>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="w-full">
            <div className="flex items-center gap-2 text-gray-900">
              <div className="bg-gray-200 py-2 px-4 rounded-full font-semibold min-w-[32px] text-center">
                5
              </div>
              <h3 className="font-semibold text-base">
                면접 평가 시트 템플릿 업로드 (Excel)
              </h3>
            </div>

            <div className="pl-13">
              <p className="text-gray-500 text-sm mb-2">
                운영진이 평가할 시트 템플릿을 업로드해주세요.
              </p>
              <div className="flex gap-2 items-center justify-between">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="파일을 업로드해주세요"
                    className="w-full"
                    value={evaluationSheetTemplateFile?.name || ""}
                    readOnly
                  />
                  <input
                    ref={evaluationFileRef}
                    type="file"
                    className="hidden"
                    accept=".,.xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEvaluationSheetTemplateFile(file);
                      }
                    }}
                  />
                </div>
                <button 
                  className="cursor-pointer px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
                  onClick={() => evaluationFileRef.current?.click()}
                >
                  파일 선택
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InterviewSetting;

