import type { Meta, StoryObj } from "@storybook/react";
import { FinalPassSetting } from "@/pages/Setting";
import { SettingDefaultMock } from "./SettingDefaultMock";

const meta = {
  title: "Pages/설정",
  component: FinalPassSetting,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-900 min-h-screen pt-12">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SettingDefaultMock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "최종 합격 설정",
};
