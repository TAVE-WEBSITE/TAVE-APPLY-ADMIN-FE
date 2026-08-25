// import { useEffect } from "react";

// const Redirect = () => {
//   useEffect(() => {
    
//     const login = async () => {
//       try {
//         const res = await fetch(
//           `${import.meta.env.VITE_BASE_URL}/v1/auth/signin`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               email: import.meta.env.VITE_EMAIL,
//               password: import.meta.env.VITE_PASSWORD,
//             }),
//           }
//         );
//         if (!res.ok) {
//           throw new Error(`HTTP 에러! 상태: ${res.status}`);
//         }

//         const data = await res.json();
//         console.log("로그인 응답:", data);
        
//         const result = data.result;
        
//         sessionStorage.setItem("email", result.email);
//         sessionStorage.setItem("access_token", result.accessToken);
//         sessionStorage.setItem("username", result.username);
//       } catch (error) {
//         console.error("로그인 실패:", error);
//         // 로그인 실패 시에도 기본값 설정
        
//         sessionStorage.setItem("email", import.meta.env.VITE_EMAIL,);
//         sessionStorage.setItem("access_token",  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0IiwiYXV0aCI6IlJPTEVfQURNSU4iLCJleHAiOjM1MDQxMDk4MTB9.6dtLyzXYjDZ9z8YJ4Vrymt4NWHXHXBFB-QP5Z8k6-FI"
//         );
//         sessionStorage.setItem("username", "회장");
//       }
//     };
//     login();
//   }, []);

//   return <></>;
// };

import { useEffect, useState } from "react";

const Redirect = () => {
  const [sessionReceived, setSessionReceived] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.data.type === "SESSION_DATA") {
        const { accessToken, email, username } = event.data.data;

        // 받은 세션 정보를 sessionStorage에 저장
        sessionStorage.setItem("access_token", accessToken);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("username", username);

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
            "https://api.tave-wave.com/v1/auth/refresh",
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
            // 필요시 새로운 세션 정보 저장
            sessionStorage.setItem("access_token", data.result.accessToken);
            //sessionStorage.setItem("email", data.result.email);
            //sessionStorage.setItem("username", data.result.username);
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

  return <></>;
};
export default Redirect;
