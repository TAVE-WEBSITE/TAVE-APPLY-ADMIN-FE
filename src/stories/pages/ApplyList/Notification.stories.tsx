import type { Meta, StoryObj } from "@storybook/react";
import Notification from "@/pages/ApplyList/Notification";
import FlexBox from "@/components/Layout/FlexBox";

const meta = {
  title: "Pages/알림 신청 명단",
  component: Notification,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="text-white bg-gray-900 pt-10">
        <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
          <h1 className="font-bold text-4xl">"16기 지원서 명단"</h1>
          <p className="text-gray-500">2025.08.11 14:00 기준</p>
        </FlexBox>
        <section className="min-h-[calc(100vh-244px)] bg-gray-100 flex flex-col gap-8">
          <Story />
        </section>
      </div>
    ),
  ],
} satisfies Meta<typeof Notification>;
export default meta;
type Story = StoryObj<typeof meta>;

export const notificationListPage: Story = {
  name: "알림 신청 명단",
};
