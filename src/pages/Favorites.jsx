import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { Link } from "react-router";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../hooks/useAuth";
import Pagination from "../components/Pagination";

export default function Favorites() {
  const { currentUserId } = useAuth();
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchFavorites(pageToLoad = currentPage) {
    if (!currentUserId) return;
    setIsLoading(true);
    try {
      const response = await api(
        `/users/${currentUserId}/favorites?page=${pageToLoad}&pageSize=${itemsPerPage}`
      );
      setFavoriteItems(response.items || []);
      setTotalFavorites(Number(response.total || 0));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!currentUserId) return;
    setCurrentPage(1);
    fetchFavorites(1);
  }, [currentUserId, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(totalFavorites / itemsPerPage));

  function handlePageChange(nextPage) {
    setCurrentPage(nextPage);
    fetchFavorites(nextPage);
  }

  function handlePageSizeChange(nextSize) {
    setItemsPerPage(nextSize);
    setCurrentPage(1);
    fetchFavorites(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Link to="/" className="text-emerald-600">
        ← Volver al inicio
      </Link>
      <h1 className="mt-2 text-3xl font-bold">Favoritos</h1>

      {isLoading && <div className="mt-6 text-slate-500">Cargando…</div>}

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {favoriteItems.map((favorite) => (
          <ProductCard key={favorite.favoriteId} product={favorite.product} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalFavorites}
        pageSize={itemsPerPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
