import type { Meta, StoryObj } from "@storybook/react";
import { Page } from "@/pages/ApplyList";

const meta = {
  title: "Pages/알림 신청 명단",
  component: Page,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-900 min-h-screen pt-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Page>;
export default meta;
type Story = StoryObj<typeof meta>;

export const notificationListPage: Story = {
  name: "알림 신청 명단",
};
