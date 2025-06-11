import type { StoryObj, Meta } from "@storybook/react";
import ApplyMock from "./ApplyMock";
import ApplyListDetailMock from "./DetailMock";
import FlexBox from "@/components/Layout/FlexBox";
import { MemoryRouter } from "react-router-dom";

const meta = {
  title: "Pages/지원 명단",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="text-white bg-gray-900 pt-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ApplyMock>;
export default meta;
type Story = StoryObj<typeof meta>;

export const applyListPage: Story = {
  name: "지원 명단 조회 페이지",
  render: () => (
    <>
      <FlexBox className="gap-8 px-16 pb-8 items-start" direction="col">
        <h1 className="font-bold text-4xl">16기 지원서 명단</h1>
        <p className="text-gray-500">2025.08.11 14:00 기준</p>
      </FlexBox>
      <section className="min-h-[calc(100vh-244px)] bg-gray-100 flex flex-col gap-8">
        <ApplyMock />
      </section>
    </>
  ),
};

export const applyListDetailPage: Story = {
  name: "지원자 상세 정보",
  render: () => (
    <MemoryRouter initialEntries={["/applies/1"]}>
      <ApplyListDetailMock />
    </MemoryRouter>
  ),
};
