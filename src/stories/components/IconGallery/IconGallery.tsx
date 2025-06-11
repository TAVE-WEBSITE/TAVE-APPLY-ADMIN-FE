import { Icon } from "@/components/Icon/Icon";
import type { IconType } from "@/components/Icon/Icon";

type StandardIconType = Exclude<IconType, "TaveLogo">;

const iconNames: StandardIconType[] = [
  "Trash",
  "TextLength",
  "Dots",
  "Calendar",
  "Check",
  "Filter",
  "Left",
  "CheckCircle",
  "Upload",
  "Key",
  "Link",
  "Menu",
  "X",
  "XCircle",
  "Pen",
  "ChevronDown",
  "ChevronUp",
  "Alert",
  "Arrow",
  "File",
  "Email",
  "HelperCircle",
  "Plus",
  "ClockCircle",
] as const;

export const IconGallery = () => {
  return (
    <div className="px-12 py-6">
      <h1 className="text-2xl font-bold mb-6">Icon Gallery</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {iconNames.map((iconName) => (
          <>
            <div
              key={iconName}
              className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg"
            >
              <Icon type={iconName} size={24} />
              <span className="text-base text-gray-900">{iconName}</span>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};
