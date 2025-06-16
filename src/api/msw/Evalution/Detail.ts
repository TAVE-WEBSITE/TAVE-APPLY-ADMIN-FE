import { delay, http, HttpResponse } from "msw";

export const postApplication = http.post(
  "/v1/manager/resume/evaluate/:resumeId",
  async ({ params, request }) => {
    const { resumeId } = params;
    const { score, opinion } = (await request.json()) as any;

    await delay(800);

    if (!resumeId || !score || !opinion) {
      return HttpResponse.json(
        {
          message: "누락된 값이 있습니다.",
        },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      {
        message: `평가 업데이트에 성공했습니다.`,
        received: { score, opinion },
      },
      { status: 200 }
    );
  }
);
