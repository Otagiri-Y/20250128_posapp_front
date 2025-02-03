"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Connecting to backend...");

  useEffect(() => {
    fetch("http://localhost:8000/")
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
