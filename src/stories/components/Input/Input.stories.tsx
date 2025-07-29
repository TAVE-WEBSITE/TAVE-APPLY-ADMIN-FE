import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Input from "@/components/Input/Input";
import SearchInput from "@/components/Input/SearchInput";
import TextArea from "@/components/Input/TextArea";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("");

    return (
      <Input
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
  args: {
    placeholder: "기본 입력",
    width: "w-80",
  },
};

export const Search: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <SearchInput
        {...args}
        value={value}
        placeholder="검색어를 입력해주세요"
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const TextAreaa: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <TextArea
        value={value}
        placeholder="내용을 입력해주세요"
        onChange={(e) => setValue(e.target.value)}
        width="w-80"
        height="h-40"
      />
    );
  },
};
