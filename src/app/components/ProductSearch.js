"use client";
import { useState } from "react";

export default function ProductSearch() {
  const [janCode, setJanCode] = useState("");
  const [product, setProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [purchaseList, setPurchaseList] = useState([]);
  const [transactionId, setTransactionId] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // 商品検索処理
  const handleSearch = async () => {
    try {
      setErrorMessage("");
      setProduct(null);

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

  // 商品追加処理（購入リスト更新のみ）
  const handleAdd = () => {
    if (!product) {
      setErrorMessage("先に商品を検索してください");
      return;
    }

    // 購入リストに追加
    const newItem = {
      jan_code: janCode,
      name: product.NAME,
      price: product.PRICE,
      quantity: 1,
      total: product.PRICE,
    };

    setPurchaseList((prevList) => [...prevList, newItem]);

    // フィールドをリセット
    setJanCode("");
    setProduct(null);
    setErrorMessage("");
  };

  // 購入処理（/buy エンドポイントを呼び出す）
  const handlePurchase = async () => {
    if (purchaseList.length === 0) {
      setErrorMessage("購入リストが空です");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jan_codes: purchaseList.map((item) => item.jan_code) }),
      });

      if (!response.ok) {
        throw new Error("購入処理に失敗しました");
      }

      const data = await response.json();
      alert(`合計金額: ¥${data.total_price}`);

      // 全リストをクリア
      setPurchaseList([]);
      setTransactionId(null);
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
            <p className="text-blue-500"><strong>商品名:</strong> {product.NAME}</p>
            <p className="text-blue-500"><strong>単価:</strong> ¥{product.PRICE}</p>
            <button
              onClick={handleAdd}
              className="w-full mt-2 p-2 bg-pink-500 text-white rounded hover:bg-pink-700"
            >
              追加
            </button>
          </>
        ) : (
          <p className="text-gray-500">商品情報を入力してください</p>
        )}
      </div>

      {/* 購入リスト */}
      {purchaseList.length > 0 && (
        <div className="mt-4 p-2 border rounded bg-white shadow">
          <h2 className="text-lg font-bold text-gray-500">購入リスト</h2>
          <ul>
            {purchaseList.map((item, index) => (
              <li key={index} className="border-b py-1 text-blue-500">
                {item.name} x{item.quantity} {item.price}円 {item.total}円
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 購入ボタン */}
      {purchaseList.length > 0 && (
        <button
          onClick={handlePurchase}
          className="w-full mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          購入
        </button>
      )}
    </div>
  );
}
