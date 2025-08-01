import Icon from "@/components/Icon/Icon";
import FlexBox from "@/components/Layout/FlexBox";
import type { SkillSet } from "@/hooks/Setting/Document/useDocumentStore";
import useDocumentStore from "@/hooks/Setting/Document/useDocumentStore";
import { postSkillSetByField, deleteSkillSetById } from "@/pages/Setting/api/Document";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ToastMessage from "@/components/Modal/ToastMessage";
import { axiosInstance } from "@/api/axiosInstance";

interface ChipControllerProps {
  chips: SkillSet[];
  setChips?: (chips: string[]) => void;
  focused?: boolean;
  onLanguageDelete?: (languageId: number, languageName: string) => Promise<void>;
  answerType?: string;
}

const ChipController = ({ chips, focused = false, onLanguageDelete, answerType }: ChipControllerProps) => {
  const { currentType, skillSets, setSkillSets } = useDocumentStore();
  const [localChips, setLocalChips] = useState(chips);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const queryClient = useQueryClient();

  // chips가 변경될 때 localChips 업데이트
  useEffect(() => {
    setLocalChips(chips);
  }, [chips]);

  const handleAddChip = () => {
    if (answerType === "PROGRAMMING") {
      // PROGRAMMING 질문의 경우 로컬 상태 사용
      const newChip = {
        id: Math.random(),
        language: "",
        field: currentType,
        selected: false
      };
      setLocalChips([...(localChips || []), newChip]);
    } else {
      // 일반 스킬셋의 경우 기존 로직 사용
      const newSkill: SkillSet = {
        id: Math.random(),
        field: currentType,
        language: "",
      };
      setSkillSets([...(skillSets || []), newSkill]);
    }
  };

  const handleRemoveChip = async (id: any) => {
    try {
      // 프로그래밍 언어 삭제인지 확인
      const chipToDelete = chips.find(chip => chip.id === id);
      
      if (onLanguageDelete && chipToDelete?.language) {
        // 프로그래밍 언어 삭제
        await onLanguageDelete(id, chipToDelete.language);
      } else {
        // 일반 스킬셋 삭제
        await deleteSkillSetById(id);
        
        // 로컬 상태에서도 제거
        const temp = (skillSets || []).filter((skill) => skill.id !== id);
        setSkillSets(temp);
      }
    } catch (error) {
      // 에러가 발생해도 로컬에서는 제거 (사용자 경험을 위해)
      const temp = (skillSets || []).filter((skill) => skill.id !== id);
      setSkillSets(temp);
    }
  };

  const handleEditChip = (id: any, e: React.ChangeEvent<HTMLInputElement>) => {
    if (answerType === "PROGRAMMING") {
      // PROGRAMMING 질문의 경우 로컬 상태 사용
      const newChips = (localChips || []).map((chip) =>
        chip.id === id ? { ...chip, language: e.target.value } : chip
      );
      setLocalChips(newChips);
    } else {
      // 일반 스킬셋의 경우 기존 로직 사용
      const newSkills = (skillSets || []).map((skill) =>
        skill.id === id ? { ...skill, language: e.target.value } : skill
      );
      setSkillSets(newSkills);
    }
  };

  const handleSaveSkill = async (id: any, skillName: string) => {
    if (skillName.trim() && currentType) {
      try {
        if (answerType === "PROGRAMMING") {
          // 프로그래밍 언어 추가 API 호출
          const response = await axiosInstance.post(`/v1/manager/lan`, {
            field: currentType,
            language: skillName.trim()
          });
          
          // 토스트 메시지 표시
          setToastMessage(`${skillName.trim()} 추가되었습니다.`);
          setIsToastOpen(true);
          
          // 프로그래밍 언어 쿼리 무효화하여 바로 반영
          await queryClient.invalidateQueries({ queryKey: ["programming-languages", currentType] });
          
        } else {
          // 일반 스킬셋 추가
          await postSkillSetByField(currentType, skillName.trim());
        }
      } catch (error) {
        setToastMessage("언어 추가에 실패했습니다.");
        setIsToastOpen(true);
      }
    }
  };

  const handleKeyDown = (id: any, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (answerType === "PROGRAMMING") {
        const chip = (localChips || []).find(c => c.id === id);
        if (chip) {
          handleSaveSkill(id, chip.language);
        }
      } else {
        const skill = (skillSets || []).find(s => s.id === id);
        if (skill) {
          handleSaveSkill(id, skill.language);
        }
      }
    }
  };

  const handleBlur = (id: any) => {
    if (answerType === "PROGRAMMING") {
      const chip = (localChips || []).find(c => c.id === id);
      if (chip && chip.language.trim()) {
        handleSaveSkill(id, chip.language);
      }
    } else {
      const skill = (skillSets || []).find(s => s.id === id);
      if (skill && skill.language.trim()) {
        handleSaveSkill(id, skill.language);
      }
    }
  };

  return (
    <FlexBox className="gap-2">
      {localChips.map((chip) => (
        <div
          key={chip.id}
          className="max-w-[120px] min-h-[30px] px-2 text-xs flex items-center justify-between gap-1 border border-gray-400 font-medium rounded-2xl text-gray-700"
        >
          <input
            value={chip.language}
            className="bg-transparent outline-none flex-1 min-w-0"
            onChange={(e) => handleEditChip(chip.id, e)}
            onKeyDown={(e) => handleKeyDown(chip.id, e)}
            onBlur={() => handleBlur(chip.id)}
          />
          <Icon
            type="Plus"
            size={20}
            onClick={() => handleRemoveChip(chip.id)}
            className="text-gray-400 rounded-full cursor-pointer rotate-45"
          />
        </div>
      ))}
      {focused && answerType === "PROGRAMMING" && (
        <button 
          className="rounded-full p-1 hover:bg-gray-200 cursor-pointer"
          onClick={handleAddChip}
        >
          <Icon type="Plus" size={16} className="text-gray-500" />
        </button>
      )}

      {answerType === "PROGRAMMING" && (
        <Icon
          type="Plus"
          size={20}
          onClick={handleAddChip}
          className="text-gray-400 border border-gray-400 rounded-full cursor-pointer hover:bg-gray-200"
        />
      )}
      <ToastMessage
        message={toastMessage}
        isOpen={isToastOpen}
        setIsOpen={setIsToastOpen}
        isError={false}
      />
    </FlexBox>
  );
};

export default ChipController;
