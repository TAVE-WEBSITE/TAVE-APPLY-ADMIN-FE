import CheckBox from "@/components/Input/CheckBox";

interface PopoverProps {
  children: React.ReactNode;
}

interface CheckBoxPopoverProps {
  contents: string[];
  checkedList: any[];
  setCheckedList: (value: any) => void;
}

const Popover = ({ children }: PopoverProps) => {
  return (
    <div
      className={`absolute top-full left-0 mt-2 px-4 py-3 bg-white border border-gray-300 rounded-lg min-w-48 z-10`}
    >
      {children}
    </div>
  );
};

const CheckBoxPopover = ({
  contents,
  checkedList,
  setCheckedList,
}: CheckBoxPopoverProps) => {
  const handleToggle = (value: any) => {
    if (checkedList.includes(value)) {
      setCheckedList(checkedList.filter((item) => item !== value));
    } else {
      setCheckedList([...checkedList, value]);
    }
  };
  return (
    <Popover>
      {contents.map((content) => (
        <CheckBox
          key={content}
          text={content}
          isChecked={checkedList.includes(content)}
          onChange={() => handleToggle(content)}
        />
      ))}
    </Popover>
  );
};

export default CheckBoxPopover;
