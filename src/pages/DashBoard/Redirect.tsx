"use client";

import { useEffect } from "react";
import useAccountStore from "@/hooks/useAccountStore";

const Redirect = () => {
  const { setUsername } = useAccountStore();
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("https://api.tave-wave.com/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "zlzmwkwldn@naver.com",
          password: "Test1234!!",
        }),
      });
      const data = await res.json();
      const accessToken = data.result.accessToken;
      const userName = data.result.username;
      console.log(userName);
      setUsername(userName);
      localStorage.setItem("adminAccessToken", accessToken);
    };
    fetcher();
  }, []);
  return <></>;
};

export default Redirect;
