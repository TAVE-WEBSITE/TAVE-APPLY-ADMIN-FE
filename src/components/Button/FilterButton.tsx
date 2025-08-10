import type { RoleType } from "@/types/role.d";
import Icon from "@/components/Icon/Icon";

const filters: RoleType[] = [
  "DESIGN",
  "WEBFRONTEND",
  "APPFRONTEND",
  "BACKEND",
  "DATAANALYSIS",
  "DEEPLEARNING",
];

const roleDisplayNames: Record<RoleType, string> = {
  DESIGN: "디자인",
  WEBFRONTEND: "웹 프론트",
  APPFRONTEND: "앱 프론트",
  BACKEND: "백엔드",
  DATAANALYSIS: "데이터 분석",
  DEEPLEARNING: "딥러닝",
};

interface FilterButtonProps {
  selectedRole: RoleType | null;
  onChange: (role: RoleType | null) => void;
}

const FilterButton = ({ selectedRole, onChange }: FilterButtonProps) => {
  const handleRoleClick = (role: RoleType) => {
    if (selectedRole === role) {
      onChange(null); // 이미 선택된 경우 선택 해제
    } else {
      onChange(role); // 새로운 역할 선택
    }
  };

  return (
    <details className="relative">
      <summary className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white text-gray-700 focus:outline outline-gray-300 font-medium cursor-pointer">
        <Icon type="Filter" size={18} />
        지원분야
      </summary>
      <div className="absolute top-full left-0 mt-2 px-4 py-3 bg-white border border-gray-300 rounded-lg min-w-48 z-10">
        {filters.map((role) => (
          <div
            key={role}
            className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50"
            onClick={() => handleRoleClick(role)}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedRole === role
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              }`}
            >
              {selectedRole === role && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            <span className="text-gray-700">{roleDisplayNames[role]}</span>
          </div>
        ))}
        {selectedRole && (
          <div
            className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 text-red-500"
            onClick={() => onChange(null)}
          >
            <span className="text-sm">선택 해제</span>
          </div>
        )}
      </div>
    </details>
  );
};

export default FilterButton;
