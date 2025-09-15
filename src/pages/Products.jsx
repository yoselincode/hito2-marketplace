import React, { useEffect, useState } from "react";
import { API_URL } from "../api/client";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchProducts(pageToLoad = currentPage, query = searchQuery) {
    setIsLoading(true);
    try {
      const url = new URL(`${API_URL}/products/search`);
      if (query) url.searchParams.set("title", query);
      url.searchParams.set("page", String(pageToLoad));
      url.searchParams.set("pageSize", String(itemsPerPage));
      const data = await fetch(url).then((r) => r.json());
      setProducts(data.items || []);
      setTotalResults(Number(data.total || 0));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts(1, "");
    setCurrentPage(1);
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  function handlePageChange(nextPage) {
    setCurrentPage(nextPage);
    fetchProducts(nextPage, searchQuery);
  }

  function handlePageSizeChange(nextSize) {
    setItemsPerPage(nextSize);
    setCurrentPage(1);
    fetchProducts(1, searchQuery);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Galería de Productos</h1>
      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <input
          className="w-full max-w-lg rounded-xl border px-3 py-2"
          placeholder="Buscar productos"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => {
            setCurrentPage(1);
            fetchProducts(1, searchQuery);
          }}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-white"
        >
          Buscar
        </button>
      </div>

      {isLoading && <div className="mt-8 text-slate-500">Cargando…</div>}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalResults}
        pageSize={itemsPerPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
