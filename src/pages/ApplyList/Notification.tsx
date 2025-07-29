import { useEffect, useState } from "react";
import Button from "@/components/Button/Button";
import NotificationTable from "@/components/ApplicationTable/NotificationTable";
import FlexBox from "@/components/Layout/FlexBox";
import ToastMessage from "@/components/Modal/ToastMessage";
import Icon from "@/components/Icon/Icon";
import { fetchList } from "@/api/fetchList";
import { useNotification } from "@/hooks/ApplyList/useNotification";
import type { NotificationItem } from "@/types/applylist";

const Notification = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationList, setNotificationList] = useState<NotificationItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isReserved, setIsReserved] = useState(false);

  const {
    postIndividual,
    postNotification,
    isPending,
    toastMessage,
    isToastOpen,
    setIsToastOpen,
    getReservationCheck,
    deleteReservation,
  } = useNotification();

  const size = 7;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchList("알림 신청", { page: currentPage-1, size });

        const content = data?.result?.content ?? [];
        setNotificationList(content);
        const pageInfo = data?.result?.page;
        setTotalPages(pageInfo?.totalPages ?? 0);
      } catch (error) {
        console.error("알림 신청 데이터 조회 실패", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchReservationStatus = async () => {
      try {
        const  {reservation}  = await getReservationCheck();
        setIsReserved(reservation);
      } catch (error) {
        console.error("이메일 예약 상태 조회 실패", error);
      }
    };

    fetchData();
    fetchReservationStatus();
  }, [currentPage]);

  const handleNotificationButton = async () => {
    if (isReserved) {
      // 예약 취소
      try {
        await deleteReservation();
        setIsReserved(false);
      } catch (error) {
        console.error("이메일 예약 취소 실패", error);
      }
    } else {
      // 예약 신청
      await postNotification(); // 내부에서 성공 시 toast 발생
      const { reservation } = await getReservationCheck();
      setIsReserved(reservation);
    }
  };
  return (
    <div className="px-12">
      <FlexBox className="justify-end py-8">
        <Button
          className={`w-[180px] ${isReserved && "bg-gray-300"}`}
          isPending={isPending}
          onClick={handleNotificationButton}
        >
          <Icon type="Email" size={18} />
          {isReserved ? "메일 발송 예정" : "전체 메일 발송"}
        </Button>
      </FlexBox>

      <NotificationTable
        rows={["이메일", "신청 날짜", ""]}
        applications={notificationList}
        isLoading={isLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
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

export default Notification;
