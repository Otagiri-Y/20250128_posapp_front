"use client";
import ProductSearch from "./components/ProductSearch";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">商品検索</h1>
      <ProductSearch />
    </div>
  );
}