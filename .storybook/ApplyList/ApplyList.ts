import { delay, http, HttpResponse } from "msw";

const interviewMockData = [
  {
    id: "1",
    fieldType: "웹 프론트",
    name: "홍길동",
    sex: "MALE",
    school: "서울대학교",
    recruitTime: "2024.03.20 14:30",
  },
  {
    id: "2",
    fieldType: "백엔드",
    name: "김철수",
    sex: "MALE",
    school: "연세대학교",
    recruitTime: "2024.03.20 15:00",
  },
  {
    id: "3",
    fieldType: "디자인",
    name: "이영희",
    sex: "FEMALE",
    school: "고려대학교",
    recruitTime: "2024.03.20 15:30",
  },
  {
    id: "4",
    fieldType: "데이터 분석",
    name: "박지민",
    sex: "FEMALE",
    school: "성균관대학교",
    recruitTime: "2024.03.21 09:00",
  },
  {
    id: "5",
    fieldType: "딥러닝",
    name: "최현우",
    sex: "MALE",
    school: "한양대학교",
    recruitTime: "2024.03.21 09:30",
  },
  {
    id: "6",
    fieldType: "앱 프론트",
    name: "서지수",
    sex: "FEMALE",
    school: "서울여자대학교",
    recruitTime: "2024.03.21 10:00",
  },
  {
    id: "7",
    fieldType: "백엔드",
    name: "정민호",
    sex: "MALE",
    school: "중앙대학교",

    recruitTime: "2024.03.21 10:30",
  },
  {
    id: "8",

    fieldType: "디자인",
    name: "한소희",
    sex: "FEMALE",
    school: "홍익대학교",
    recruitTime: "2024.03.21 11:00",
  },
  {
    id: "9",
    fieldType: "데이터 분석",
    name: "이승기",
    sex: "MALE",
    school: "경희대학교",
    recruitTime: "2024.03.21 11:30",
  },
  {
    id: "10",
    fieldType: "딥러닝",
    name: "김보라",
    sex: "FEMALE",
    school: "부산대학교",
    recruitTime: "2024.03.21 12:00",
  },
  {
    id: "11",
    fieldType: "웹 프론트",
    name: "장우진",
    sex: "MALE",
    school: "인하대학교",
    recruitTime: "2024.03.21 12:30",
  },
  {
    id: "12",
    fieldType: "백엔드",
    name: "오지현",
    sex: "FEMALE",
    school: "동국대학교",
    recruitTime: "2024.03.21 13:00",
  },
  {
    id: "13",
    fieldType: "디자인",
    name: "강다연",
    sex: "FEMALE",
    school: "이화여자대학교",
    recruitTime: "2024.03.21 13:30",
  },
  {
    id: "14",
    fieldType: "데이터 분석",
    name: "류진우",
    sex: "MALE",
    school: "건국대학교",
    recruitTime: "2024.03.21 14:00",
  },
  {
    id: "15",
    fieldType: "딥러닝",
    name: "배수지",
    sex: "FEMALE",
    school: "경북대학교",
    recruitTime: "2024.03.21 14:30",
  },
];

const mockResumes = interviewMockData.map((app, i) => {
  return {
    resumeId: app.id,
    name: app.name,
    field: app.fieldType,
    gender: app.sex,
    birthDate: `200${i % 10}.0${(i % 9) + 1}.1${i % 9}`,
    school: app.school,
    contact: `010-1234-56${String(i).padStart(2, "0")}`,
    email: `applicant${app.id}@example.com`,
    major: "컴퓨터공학과",
    subMajor: i % 3 === 0 ? "통계학과" : "디자인학과",
    partQuestions: [
      {
        question: "님의 프로그래밍 실력은 어느 정도 인가요?",
        answer: "초급",
      },
      {
        question: "기타 활용 가능한 기술 스택이 있으신가요?",
        answer: "리액트, Next.js, Redux, Tailwind CSS",
      },
      {
        question:
          "첫번째 질문에서 평가한 프레임워크/언어에 대해 학습하거나 활용한 경험에 대해 간단하게 서술해주세요. (500자 이내)",
        answer: "열심히 했습니다",
      },
    ],
    commonQuestions: [
      {
        question: "지원 동기와 TAVE 활동을 통해 얻고 싶은 것을 적어주세요.",
        answer: "협업과 성장 기회를 기대합니다.",
      },
      {
        question: "3개의 키워드로 자신을 표현해주세요.",
        answer: "책임감, 창의성, 열정",
      },
      {
        question: "이번 학기 계획이 있으신가요?",
        answer: "팀 프로젝트에 적극 참여하고, 기술 스택을 확장하고자 합니다.",
      },
      {
        question: "자신의 강점을 적어주세요.",
        answer: "소통 능력과 꾸준함이 저의 강점입니다.",
      },
    ],
  };
});

const getAllInterviewers = http.get("/v1/admin/interview", async () => {
  // const shouldSucceed = Math.random() > 0
  await delay(1000);
  return HttpResponse.json(interviewMockData, { status: 200 });
});

const getSingleInterviewer = http.get(
  "/v1/admin/interview/resume",
  async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const response = mockResumes[Number(id) - 1];
    return HttpResponse.json(response, { status: 200 });
  }
);

export { getAllInterviewers, getSingleInterviewer };
