"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useRequest from "../../../hooks/use-request";

export default () => {
  const router = useRouter();

  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "get",
    body: {},
    onSuccess: () => router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out...</div>;
};
