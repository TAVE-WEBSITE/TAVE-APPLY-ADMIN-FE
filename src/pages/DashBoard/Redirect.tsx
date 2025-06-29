import { useEffect, useState } from "react";

const Redirect = () => {
  const [sessionReceived, setSessionReceived] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.data.type === "SESSION_DATA") {
        const { accessToken, email } = event.data.data;

        // 받은 세션 정보를 sessionStorage에 저장
        sessionStorage.setItem("access_token", accessToken);
        sessionStorage.setItem("email", email);

        setEmail(email);
        setSessionReceived(true);

        // 세션 정보를 받았다는 신호를 부모 창에 전송
        window.parent.postMessage({ type: "IFRAME_LOADED" }, event.origin);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (sessionReceived && email) {
      const refreshToken = async () => {
        try {
          const response = await fetch(
            "https://test.api.tave-wave.com/v1/auth/refresh",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem(
                  "access_token"
                )}`,
              },
              credentials: "include",
              body: JSON.stringify({ email }),
            }
          );

          const data = await response.json();
          if (data.result) {
            console.log("토큰 리프레시 성공");
            // 필요시 새로운 토큰 저장
            sessionStorage.setItem("access_token", data.result.accessToken);
          } else {
            console.error("토큰 리프레시 실패:", data.message);
          }
        } catch (error) {
          console.error("토큰 리프레시 에러:", error);
        }
      };

      refreshToken();
    }
  }, [sessionReceived, email]);

  //   // 로그아웃 로직 (정확히는 iframe 창 닫기)
  //   const handleLogout = () => {
  //     // 부모 창에 로그아웃 신호 전송
  //     window.parent.postMessage({ type: "EXIT_FROM_APPLY_ADMIN" }, "*");
  //     window.close();
  //   };

  return <></>;
};

export default Redirect;
