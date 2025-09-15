import React, { useEffect, useState } from "react";
import { API_URL, api } from "../../api/client";
import ProductCard from "../../components/ProductCard";
import Pagination from "../../components/Pagination";

export default function ProfileProductsTab({ userId }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchProducts(
    pageToLoad = currentPage,
    pageSize = itemsPerPage
  ) {
    if (!userId) return;
    setIsLoading(true);
    try {
      const url = new URL(`${API_URL}/users/${userId}/products`);
      url.searchParams.set("page", String(pageToLoad));
      url.searchParams.set("pageSize", String(pageSize));
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.items || []);
      setTotalCount(Number(data.total || 0));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(1, itemsPerPage);
  }, [userId, itemsPerPage]);

  async function handleDeleteProduct(productId) {
    const confirmed = confirm(
      "¿Eliminar este producto? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;
    try {
      await api(`/products/${productId}`, { method: "DELETE" });
      fetchProducts(currentPage, itemsPerPage);
    } catch {
      alert("No se pudo eliminar el producto");
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  function handlePageChange(nextPage) {
    setCurrentPage(nextPage);
    fetchProducts(nextPage, itemsPerPage);
  }

  function handlePageSizeChange(nextSize) {
    setItemsPerPage(nextSize);
    setCurrentPage(1);
    fetchProducts(1, nextSize);
  }

  return (
    <>
      {isLoading && <div className="text-slate-500">Cargando…</div>}
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            canManage
            onDelete={handleDeleteProduct}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalCount}
        pageSize={itemsPerPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
}
