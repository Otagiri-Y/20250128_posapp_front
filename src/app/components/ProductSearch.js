"use client";
import { useState } from "react";

export default function ProductSearch() {
  const [janCode, setJanCode] = useState("");
  const [product, setProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const handleSearch = async () => {
    try {
      setErrorMessage(""); // エラーメッセージをリセット
      setProduct(null); // 商品情報をリセット

      const response = await fetch(`${apiUrl}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jan_code: janCode }),
      });

      if (!response.ok) {
        throw new Error("商品がマスタ未登録です");
      }

      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="w-full max-w-md p-4 border rounded shadow">
      <input
        type="text"
        placeholder="JANコードを入力"
        value={janCode}
        onChange={(e) => setJanCode(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={handleSearch}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        商品コード読み込み
      </button>

      <div className="mt-4 p-2 border rounded bg-gray-100">
        {errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : product ? (
          <>
            <p><strong>商品名:</strong> <span className="text-blue-500">{product.NAME}</span></p>
            <p><strong>単価:</strong> <span className="text-blue-500">¥{product.PRICE}</span></p>
          </>
        ) : (
          <p>商品情報を入力してください</p>
        )}
      </div>
    </div>
  );
}