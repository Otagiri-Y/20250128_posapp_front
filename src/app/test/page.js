// バックエンドとの接続をテストするページ（本ページにアクセスし、Hello Worldと表示されれば接続はOK）
"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Connecting to backend...");

  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    fetch(`${apiUrl}/test`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((error) => setMessage("Failed to connect to backend"));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold">{message}</h1>
    </div>
  );
}
