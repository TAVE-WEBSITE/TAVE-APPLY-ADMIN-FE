// "use client";

// import { useEffect } from "react";
// import useAccountStore from "@/hooks/useAccountStore";

// const Redirect = () => {
//   const { setUsername } = useAccountStore();
//   useEffect(() => {
//     const fetcher = async () => {
//       const res = await fetch("https://test.api.tave-wave.com/v1/auth/signin", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: import.meta.env.VITE_ADMIN_EMAIL,
//           password: import.meta.env.VITE_ADMIN_PASSWORD,
//         }),
//       });
//       const data = await res.json();
//       const accessToken = data.result.accessToken;
//       const userName = data.result.username;
//       setUsername(userName);
//       localStorage.setItem("adminAccessToken", accessToken);
//     };
//     fetcher();
//   }, []);
//   return <></>;
// };

// export default Redirect;
