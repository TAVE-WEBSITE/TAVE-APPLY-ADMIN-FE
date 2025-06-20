import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import DocumentMock from "./DocumentMock";
import DetailMock from "./DetailMock";
import FinalDocumentMock from "./FinalMock";
import FinalDetailMock from "./FinalDetailMock";
import InterviewMock from "./InterviewMock";
import InterviewDetailMock from "./InterviewDetailMock";

const createMockQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });
};

const meta = {
  title: "Pages/평가",
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
    },
    controls: { disable: true },
    actions: { disable: true },
  },
  decorators: [
    (Story) => {
      const queryClient = createMockQueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <div className="min-h-screen bg-gray-900 pt-12">
              <Story />
            </div>
          </MemoryRouter>
        </QueryClientProvider>
      );
    },
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DocumentEvaluation: Story = {
  name: "서류 평가",
  render: () => <DocumentMock />,
};

export const DocumentEvaluationDetail: Story = {
  name: "서류 평가 개별",
  render: () => <DetailMock />,
};

export const FinalDocumentEvaluation: Story = {
  name: "최종 서류 평가",
  render: () => <FinalDocumentMock />,
};

export const FinalDocumentEvaluationDetail: Story = {
  name: "최종 서류 평가 개별",
  render: () => <FinalDetailMock />,
};

export const InterviewEvaluation: Story = {
  name: "면접 평가",
  render: () => <InterviewMock />,
};

export const InterviewEvaulationDetail: Story = {
  name: "면접 평가 개별 (2인)",
  render: () => <InterviewDetailMock />,
};
