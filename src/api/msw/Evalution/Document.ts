import { delay, http, HttpResponse } from "msw";
import { type Status } from "@/types/application";

const statusPool: Status[] = ["HOLD", "COMPLETE"];
const statusFinalPool: Status[] = [
  "FAIL",
  "PASS",
  "HOLD",
  "NOTCHECKED",
  "COMPLETE",
];

const fields = [
  "웹 프론트",
  "백엔드",
  "디자인",
  "데이터 분석",
  "딥러닝",
  "앱 프론트",
];
const names = [
  "홍길동",
  "김철수",
  "이영희",
  "박지민",
  "최현우",
  "서지수",
  "정민호",
  "한소희",
  "이승기",
  "김보라",
  "장우진",
  "오지현",
  "강다연",
  "류진우",
  "배수지",
  "이도현",
  "유재석",
  "장나라",
  "신동엽",
  "아이유",
  "정우성",
  "수지",
  "나연",
  "제니",
  "지수",
  "채원",
  "태연",
  "슬기",
  "지민",
  "뷔",
];

const schools = [
  "서울대학교",
  "연세대학교",
  "고려대학교",
  "성균관대학교",
  "한양대학교",
  "서울여자대학교",
  "중앙대학교",
  "홍익대학교",
  "경희대학교",
  "부산대학교",
  "인하대학교",
  "동국대학교",
  "이화여자대학교",
  "건국대학교",
  "경북대학교",
];

const generateMockData = (type: "final" | "document", count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const common = {
      id: `${i + 1}`,
      name: names[i % names.length],
      fieldType: fields[i % fields.length],
      sex: i % 2 === 0 ? "MALE" : "FEMALE",
      school: schools[i % schools.length],
    };

    if (type === "final") {
      return {
        ...common,
        count: (i % 5) + 1,
        status: statusFinalPool[i % statusPool.length],
      };
    } else {
      return {
        ...common,
        recruitTime: new Date().toISOString(),
        status: statusPool[i % statusPool.length],
      };
    }
  });
};

const DocumentEvalutionMockData = generateMockData("document", 40);
const DocumentFinalEvalutionMockData = generateMockData("final", 40);

export const getEvalutionList = http.get(
  "/v1/manager/resume/evaluate",
  async ({ request }) => {
    await delay(800);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 0);
    const size = Number(url.searchParams.get("size") || 7);
    const status = url.searchParams.get("status") as Status | null;

    let filtered = DocumentEvalutionMockData;

    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }

    const start = page * size;
    const end = start + size;
    const paged = filtered.slice(start, end);

    const result = {
      content: paged,
      page: {
        size: size,
        number: 0,
        totalElement: DocumentFinalEvalutionMockData.length,
        totalPages: Math.floor(DocumentFinalEvalutionMockData.length / size),
      },
    };

    return HttpResponse.json(result, { status: 200 });
  }
);

export const getFinalEvaluationList = http.get(
  "/v1/manager/resume/evaluate/final",
  async ({ request }) => {
    await delay(800);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 0);
    const size = Number(url.searchParams.get("size") || 7);
    const status = url.searchParams.get("status") as Status | null;

    let filtered = DocumentFinalEvalutionMockData;

    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }

    const start = page * size;
    const end = start + size;
    const paged = filtered.slice(start, end);
    const result = {
      content: paged,
      page: {
        size: size,
        number: 0,
        totalElement: DocumentFinalEvalutionMockData.length,
        totalPages: Math.floor(DocumentFinalEvalutionMockData.length / size),
      },
    };

    return HttpResponse.json(result, { status: 200 });
  }
);
