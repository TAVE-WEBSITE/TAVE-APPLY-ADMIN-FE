import Icon from "@/components/Icon/Icon";
import FlexBox from "@/components/Layout/FlexBox";
import type { SkillSet } from "@/hooks/Setting/Document/useDocumentStore";
import useDocumentStore from "@/hooks/Setting/Document/useDocumentStore";
import { postSkillSetByField, deleteSkillSetById } from "@/pages/Setting/api/Document";

interface ChipControllerProps {
  chips: SkillSet[];
  setChips?: (chips: string[]) => void;
  focused?: boolean;
}

const ChipController = ({ chips, focused = false }: ChipControllerProps) => {
  const { currentType, skillSets, setSkillSets } = useDocumentStore();

  const handleAddChip = () => {
    const newSkill: SkillSet = {
      id: Math.random(),
      field: currentType,
      language: "",
    };
    setSkillSets([...skillSets, newSkill]);
  };

  const handleRemoveChip = async (id: any) => {
    try {
      // API 호출하여 서버에서 삭제
      await deleteSkillSetById(id);
      console.log("스킬셋이 성공적으로 삭제되었습니다:", id);
      
      // 로컬 상태에서도 제거
      const temp = skillSets.filter((skill) => skill.id !== id);
      setSkillSets(temp);
    } catch (error) {
      console.error("스킬셋 삭제 실패:", error);
      // 에러가 발생해도 로컬에서는 제거 (사용자 경험을 위해)
      const temp = skillSets.filter((skill) => skill.id !== id);
      setSkillSets(temp);
    }
  };

  const handleEditChip = (id: any, e: React.ChangeEvent<HTMLInputElement>) => {
    const newSkills = skillSets.map((skill) =>
      skill.id === id ? { ...skill, language: e.target.value } : skill
    );
    setSkillSets(newSkills);
  };

  const handleSaveSkill = async (id: any, skillName: string) => {
    if (skillName.trim() && currentType) {
      try {
        await postSkillSetByField(currentType, skillName.trim());
        console.log("스킬셋이 성공적으로 생성되었습니다:", skillName);
      } catch (error) {
        console.error("스킬셋 생성 실패:", error);
      }
    }
  };

  const handleKeyDown = (id: any, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const skill = skillSets.find(s => s.id === id);
      if (skill) {
        handleSaveSkill(id, skill.language);
      }
    }
  };

  const handleBlur = (id: any) => {
    const skill = skillSets.find(s => s.id === id);
    if (skill && skill.language.trim()) {
      handleSaveSkill(id, skill.language);
    }
  };

  return (
    <FlexBox className="gap-2">
      {chips.map((chip) => (
        <div
          key={chip.id}
          className="max-w-[90px] min-h-[30px] px-2 text-xs flex items-center justify-between gap-1 border border-gray-400 font-medium rounded-2xl text-gray-700"
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
      {focused && (
        <button className="rounded-full p-1 hover:bg-gray-200 cursor-pointer">
          <Icon type="Plus" size={16} className="text-gray-500" />
        </button>
      )}

      <Icon
        type="Plus"
        size={20}
        onClick={handleAddChip}
        className="text-gray-400 border border-gray-400 rounded-full cursor-pointer hover:bg-gray-200"
      />
    </FlexBox>
  );
};

export default ChipController;
