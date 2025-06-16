import Button from "@/components/Button/Button";
import NotificationTable from "@/components/ApplicationTable/NotificationTable";
import FlexBox from "@/components/Layout/FlexBox";
import ToastMessage from "@/components/Modal/ToastMessage";
import { useNotification } from "@/hooks/ApplyList/useNotification";
import Icon from "@/components/Icon/Icon";
import { useEffect, useState } from "react";
import axios from "axios";

const NotificationMock = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationList, setNotificationList] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const fetcher = async () => {
      const res = await axios.get("/v1/admin/notification?page=1&size=7");
      setNotificationList(res.data);
      setIsLoading(false);
    };
    fetcher();
  }, []);

  const {
    postIndividual,
    postNotification,
    isPending,
    toastMessage,
    isToastOpen,
    setIsToastOpen,
  } = useNotification();

  return (
    <div className="px-12">
      <FlexBox className="justify-end py-8">
        <Button
          className="w-[150px]"
          isPending={isPending}
          onClick={() => postNotification()}
        >
          <Icon type="Email" size={18} />
          전체 메일 발송
        </Button>
      </FlexBox>

      <NotificationTable
        rows={["이메일", "신청 날짜", ""]}
        applications={notificationList}
        isLoading={isLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={1}
        onClick={postIndividual}
      />
      <ToastMessage
        message={toastMessage}
        isOpen={isToastOpen}
        setIsOpen={setIsToastOpen}
      />
    </div>
  );
};

export default NotificationMock;
