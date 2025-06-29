import Icon from "@/components/Icon/Icon";
import FlexBox from "@/components/Layout/FlexBox";
import type { SkillSet } from "@/hooks/Setting/Document/useDocumentStore";
import useDocumentStore from "@/hooks/Setting/Document/useDocumentStore";

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

  const handleRemoveChip = (id: any) => {
    const temp = skillSets.filter((skill) => skill.id !== id);
    setSkillSets(temp);
  };

  const handleEditChip = (id: any, e: React.ChangeEvent<HTMLInputElement>) => {
    const newSkills = skillSets.map((skill) =>
      skill.id === id ? { ...skill, language: e.target.value } : skill
    );
    setSkillSets(newSkills);
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
