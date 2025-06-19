import { http, HttpResponse, delay } from "msw";

export const getTimeTableForm = http.get(
  "/v1/manager/interview-final/form",
  async () => {
    const formTemp = { file: "파일" };
    await delay(800);

    return HttpResponse.json(formTemp, { status: 200 });
  }
);

export const getSheet = http.get(
  "/v1/manager/interview-final/sheet",
  async () => {
    const formSheet = { file: "시트" };
    await delay(800);

    return HttpResponse.json(formSheet, { status: 200 });
  }
);
export const getInterviewTimeTable = http.get(
  "/api/interviews/timetable",
  () => {
    return HttpResponse.json({
      time: "2025-06-15T21:19:12.8874972",
      status: 200,
      code: "200",
      message: "면접 시간표를 조회합니다.",
      result: {
        totalDateTimeDto: {
          dateList: ["2025-08-11", "2025-08-12", "2025-08-13", "2025-08-14"],
          timeList: ["12:00", "13:00", "14:00", "15:00"],
          dateListSize: 4,
          timeListSize: 4,
        },
        timetableList: [
          {
            groupByDay: "2025-08-11",
            dayName: "월요일",
            groupByTimeDtoList: [
              {
                groupByTime: "12:00",
                memberDtoList: [
                  {
                    interviewFinalId: 101,
                    field: "백엔드",
                    username: "김철수",
                    interviewDate: "2025-08-11",
                    interviewTime: "12:00",
                    memberId: 1,
                    resumeId: 1001,
                  },
                  {
                    interviewFinalId: 102,
                    field: "웹 프론트",
                    username: "이영희",
                    interviewDate: "2025-08-11",
                    interviewTime: "12:00",
                    memberId: 2,
                    resumeId: 1002,
                  },
                  {
                    interviewFinalId: 103,
                    field: "데이터 분석",
                    username: "박지민",
                    interviewDate: "2025-08-11",
                    interviewTime: "12:00",
                    memberId: 3,
                    resumeId: 1003,
                  },
                ],
              },
              {
                groupByTime: "13:00",
                memberDtoList: [
                  {
                    interviewFinalId: 104,
                    field: "디자인",
                    username: "최현우",
                    interviewDate: "2025-08-11",
                    interviewTime: "13:00",
                    memberId: 4,
                    resumeId: 1004,
                  },
                  {
                    interviewFinalId: 105,
                    field: "앱 프론트",
                    username: "서지수",
                    interviewDate: "2025-08-11",
                    interviewTime: "13:00",
                    memberId: 5,
                    resumeId: 1005,
                  },
                  {
                    interviewFinalId: 106,
                    field: "백엔드",
                    username: "정민호",
                    interviewDate: "2025-08-11",
                    interviewTime: "13:00",
                    memberId: 6,
                    resumeId: 1006,
                  },
                ],
              },
              {
                groupByTime: "14:00",
                memberDtoList: [
                  {
                    interviewFinalId: 107,
                    field: "데이터 분석",
                    username: "채원",
                    interviewDate: "2025-08-11",
                    interviewTime: "14:00",
                    memberId: 25,
                    resumeId: 1025,
                  },
                  {
                    interviewFinalId: 108,
                    field: "딥러닝",
                    username: "태연",
                    interviewDate: "2025-08-11",
                    interviewTime: "14:00",
                    memberId: 26,
                    resumeId: 1026,
                  },
                  {
                    interviewFinalId: 109,
                    field: "웹 프론트",
                    username: "슬기",
                    interviewDate: "2025-08-11",
                    interviewTime: "14:00",
                    memberId: 27,
                    resumeId: 1027,
                  },
                ],
              },
              {
                groupByTime: "15:00",
                memberDtoList: [
                  {
                    interviewFinalId: 110,
                    field: "앱 프론트",
                    username: "지민",
                    interviewDate: "2025-08-11",
                    interviewTime: "15:00",
                    memberId: 28,
                    resumeId: 1028,
                  },
                  {
                    interviewFinalId: 111,
                    field: "디자인",
                    username: "뷔",
                    interviewDate: "2025-08-11",
                    interviewTime: "15:00",
                    memberId: 29,
                    resumeId: 1029,
                  },
                  {
                    interviewFinalId: 112,
                    field: "백엔드",
                    username: "김민수",
                    interviewDate: "2025-08-11",
                    interviewTime: "15:00",
                    memberId: 30,
                    resumeId: 1030,
                  },
                ],
              },
              {
                groupByTime: "14:00",
                memberDtoList: [
                  {
                    interviewFinalId: 207,
                    field: "앱 프론트",
                    username: "이지은",
                    interviewDate: "2025-08-12",
                    interviewTime: "14:00",
                    memberId: 31,
                    resumeId: 1031,
                  },
                  {
                    interviewFinalId: 208,
                    field: "백엔드",
                    username: "박서준",
                    interviewDate: "2025-08-12",
                    interviewTime: "14:00",
                    memberId: 32,
                    resumeId: 1032,
                  },
                  {
                    interviewFinalId: 209,
                    field: "디자인",
                    username: "김고은",
                    interviewDate: "2025-08-12",
                    interviewTime: "14:00",
                    memberId: 33,
                    resumeId: 1033,
                  },
                ],
              },
              {
                groupByTime: "15:00",
                memberDtoList: [
                  {
                    interviewFinalId: 210,
                    field: "웹 프론트",
                    username: "조정석",
                    interviewDate: "2025-08-12",
                    interviewTime: "15:00",
                    memberId: 34,
                    resumeId: 1034,
                  },
                  {
                    interviewFinalId: 211,
                    field: "데이터 분석",
                    username: "송혜교",
                    interviewDate: "2025-08-12",
                    interviewTime: "15:00",
                    memberId: 35,
                    resumeId: 1035,
                  },
                  {
                    interviewFinalId: 212,
                    field: "딥러닝",
                    username: "현빈",
                    interviewDate: "2025-08-12",
                    interviewTime: "15:00",
                    memberId: 36,
                    resumeId: 1036,
                  },
                ],
              },
              {
                groupByTime: "14:00",
                memberDtoList: [
                  {
                    interviewFinalId: 307,
                    field: "백엔드",
                    username: "손예진",
                    interviewDate: "2025-08-13",
                    interviewTime: "14:00",
                    memberId: 37,
                    resumeId: 1037,
                  },
                  {
                    interviewFinalId: 308,
                    field: "앱 프론트",
                    username: "공유",
                    interviewDate: "2025-08-13",
                    interviewTime: "14:00",
                    memberId: 38,
                    resumeId: 1038,
                  },
                  {
                    interviewFinalId: 309,
                    field: "딥러닝",
                    username: "전지현",
                    interviewDate: "2025-08-13",
                    interviewTime: "14:00",
                    memberId: 39,
                    resumeId: 1039,
                  },
                ],
              },
              {
                groupByTime: "15:00",
                memberDtoList: [
                  {
                    interviewFinalId: 310,
                    field: "디자인",
                    username: "이병헌",
                    interviewDate: "2025-08-13",
                    interviewTime: "15:00",
                    memberId: 40,
                    resumeId: 1040,
                  },
                  {
                    interviewFinalId: 311,
                    field: "웹 프론트",
                    username: "김태희",
                    interviewDate: "2025-08-13",
                    interviewTime: "15:00",
                    memberId: 41,
                    resumeId: 1041,
                  },
                  {
                    interviewFinalId: 312,
                    field: "데이터 분석",
                    username: "비",
                    interviewDate: "2025-08-13",
                    interviewTime: "15:00",
                    memberId: 42,
                    resumeId: 1042,
                  },
                ],
              },
            ],
          },
          {
            groupByDay: "2025-08-12",
            dayName: "화요일",
            groupByTimeDtoList: [
              {
                groupByTime: "12:00",
                memberDtoList: [
                  {
                    interviewFinalId: 201,
                    field: "데이터 분석",
                    username: "한소희",
                    interviewDate: "2025-08-12",
                    interviewTime: "12:00",
                    memberId: 7,
                    resumeId: 1007,
                  },
                  {
                    interviewFinalId: 202,
                    field: "딥러닝",
                    username: "이승기",
                    interviewDate: "2025-08-12",
                    interviewTime: "12:00",
                    memberId: 8,
                    resumeId: 1008,
                  },
                  {
                    interviewFinalId: 203,
                    field: "웹 프론트",
                    username: "김보라",
                    interviewDate: "2025-08-12",
                    interviewTime: "12:00",
                    memberId: 9,
                    resumeId: 1009,
                  },
                ],
              },
              {
                groupByTime: "13:00",
                memberDtoList: [
                  {
                    interviewFinalId: 204,
                    field: "딥러닝",
                    username: "장우진",
                    interviewDate: "2025-08-12",
                    interviewTime: "13:00",
                    memberId: 10,
                    resumeId: 1010,
                  },
                  {
                    interviewFinalId: 205,
                    field: "백엔드",
                    username: "오지현",
                    interviewDate: "2025-08-12",
                    interviewTime: "13:00",
                    memberId: 11,
                    resumeId: 1011,
                  },
                  {
                    interviewFinalId: 206,
                    field: "디자인",
                    username: "강다연",
                    interviewDate: "2025-08-12",
                    interviewTime: "13:00",
                    memberId: 12,
                    resumeId: 1012,
                  },
                ],
              },
            ],
          },
          {
            groupByDay: "2025-08-13",
            dayName: "수요일",
            groupByTimeDtoList: [
              {
                groupByTime: "12:00",
                memberDtoList: [
                  {
                    interviewFinalId: 301,
                    field: "앱 프론트",
                    username: "류진우",
                    interviewDate: "2025-08-13",
                    interviewTime: "12:00",
                    memberId: 13,
                    resumeId: 1013,
                  },
                  {
                    interviewFinalId: 302,
                    field: "백엔드",
                    username: "배수지",
                    interviewDate: "2025-08-13",
                    interviewTime: "12:00",
                    memberId: 14,
                    resumeId: 1014,
                  },
                  {
                    interviewFinalId: 303,
                    field: "디자인",
                    username: "이도현",
                    interviewDate: "2025-08-13",
                    interviewTime: "12:00",
                    memberId: 15,
                    resumeId: 1015,
                  },
                ],
              },
              {
                groupByTime: "13:00",
                memberDtoList: [
                  {
                    interviewFinalId: 304,
                    field: "웹 프론트",
                    username: "유재석",
                    interviewDate: "2025-08-13",
                    interviewTime: "13:00",
                    memberId: 16,
                    resumeId: 1016,
                  },
                  {
                    interviewFinalId: 305,
                    field: "데이터 분석",
                    username: "장나라",
                    interviewDate: "2025-08-13",
                    interviewTime: "13:00",
                    memberId: 17,
                    resumeId: 1017,
                  },
                  {
                    interviewFinalId: 306,
                    field: "딥러닝",
                    username: "신동엽",
                    interviewDate: "2025-08-13",
                    interviewTime: "13:00",
                    memberId: 18,
                    resumeId: 1018,
                  },
                ],
              },
            ],
          },
          {
            groupByDay: "2025-08-14",
            dayName: "목요일",
            groupByTimeDtoList: [
              {
                groupByTime: "12:00",
                memberDtoList: [
                  {
                    interviewFinalId: 401,
                    field: "디자인",
                    username: "아이유",
                    interviewDate: "2025-08-14",
                    interviewTime: "12:00",
                    memberId: 19,
                    resumeId: 1019,
                  },
                  {
                    interviewFinalId: 402,
                    field: "딥러닝",
                    username: "정우성",
                    interviewDate: "2025-08-14",
                    interviewTime: "12:00",
                    memberId: 20,
                    resumeId: 1020,
                  },
                  {
                    interviewFinalId: 403,
                    field: "앱 프론트",
                    username: "수지",
                    interviewDate: "2025-08-14",
                    interviewTime: "12:00",
                    memberId: 21,
                    resumeId: 1021,
                  },
                ],
              },
              {
                groupByTime: "13:00",
                memberDtoList: [
                  {
                    interviewFinalId: 404,
                    field: "웹 프론트",
                    username: "나연",
                    interviewDate: "2025-08-14",
                    interviewTime: "13:00",
                    memberId: 22,
                    resumeId: 1022,
                  },
                  {
                    interviewFinalId: 405,
                    field: "백엔드",
                    username: "제니",
                    interviewDate: "2025-08-14",
                    interviewTime: "13:00",
                    memberId: 23,
                    resumeId: 1023,
                  },
                  {
                    interviewFinalId: 406,
                    field: "데이터 분석",
                    username: "지수",
                    interviewDate: "2025-08-14",
                    interviewTime: "13:00",
                    memberId: 24,
                    resumeId: 1024,
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  }
);
