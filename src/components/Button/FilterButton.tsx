import type { RoleType } from "@/types/role";
import Icon from "@/components/Icon/Icon";
import CheckBox from "@/components/Input/CheckBox";

const filters: RoleType[] = [
  "디자인",
  "웹 프론트",
  "앱 프론트",
  "백엔드",
  "데이터 분석",
  "딥러닝",
];

interface FilterButtonProps {
  checkedList: Set<RoleType>;
  onChange: (role: RoleType) => void;
}

const FilterButton = ({ checkedList, onChange }: FilterButtonProps) => {
  return (
    <details className="relative">
      <summary className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white text-gray-700 focus:outline outline-gray-300 font-medium cursor-pointer">
        <Icon type="Filter" size={18} />
        지원분야
      </summary>
      <div
        className={`absolute top-full left-0 mt-2 px-4 py-3 bg-white border border-gray-300 rounded-lg min-w-48 z-10`}
      >
        {filters.map((role) => (
          <CheckBox
            key={role}
            text={role}
            isChecked={checkedList.has(role)}
            onChange={() => onChange(role)}
          />
        ))}
      </div>
    </details>
  );
};

export default FilterButton;
