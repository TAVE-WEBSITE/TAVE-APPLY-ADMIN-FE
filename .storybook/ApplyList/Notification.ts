import { http, HttpResponse, delay } from "msw";

interface NotificationItem {
  id: string | number;
  email: string;
  date: string;
}

const notificationList: NotificationItem[] = [
  {
    id: 4000,
    email: "test2000@example.com",
    date: "2025-05-28T13:08:31.767463",
  },
  {
    id: 3999,
    email: "test1999@example.com",
    date: "2025-05-28T13:08:31.767356",
  },
  {
    id: 3998,
    email: "test1998@example.com",
    date: "2025-05-28T13:08:31.76721",
  },
  {
    id: 3997,
    email: "test1997@example.com",
    date: "2025-05-28T13:08:31.767095",
  },
  {
    id: 3996,
    email: "test1996@example.com",
    date: "2025-05-28T13:08:31.766947",
  },
  {
    id: 3995,
    email: "test1995@example.com",
    date: "2025-05-28T13:08:31.766786",
  },
  {
    id: 3994,
    email: "test1994@example.com",
    date: "2025-05-28T13:08:31.766643",
  },
  {
    id: 3993,
    email: "test1993@example.com",
    date: "2025-05-28T13:08:31.766459",
  },
  {
    id: 39932,
    email: "test1993@example.com",
    date: "2025-05-28T13:08:31.766459",
  },
  {
    id: 39931,
    email: "test1993@example.com",
    date: "2025-05-28T13:08:31.766459",
  },
  {
    id: 39934,
    email: "test1993@example.com",
    date: "2025-05-28T13:08:31.766459",
  },
  {
    id: 391,
    email: "test1993@example.com",
    date: "2025-05-28T13:08:31.766459",
  },
  {
    id: 392,
    email: "test1993@example.com",
    date: "2025-05-28T13:08:31.766459",
  },
  {
    id: 393,
    email: "test1993@example.com",
    date: "2025-05-28T13:08:31.766459",
  },
];

const getNotificationList = http.get("/v1/admin/notification", () => {
  return HttpResponse.json(notificationList, { status: 200 });
});

const postReservation = http.post(
  "/v1/admin/notification/reservation",
  async () => {
    await delay(1000);
    return HttpResponse.json(
      {
        time: "2025-05-31T22:12:16.598015",
        status: 200,
        code: "200",
        message:
          "신규 회원 모집 알림 이메일 발송 설정이 완료되었습니다. 작업은 03:00에 실행됩니다.",
      },
      { status: 200 }
    );
  }
);

const postIndividualReservation = http.post(
  "/v1/admin/notification/individual",
  async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    await delay(1000);
    return HttpResponse.json(
      {
        time: "2025-05-31T22:12:16.598015",
        status: 200,
        code: "200",
        message: `${id}-회원에 대해 신규 회원 모집 알림 이메일 전송이 완료되었습니다.`,
      },
      { status: 200 }
    );
  }
);

export { getNotificationList, postReservation, postIndividualReservation };
