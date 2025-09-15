import React, { useEffect, useState } from "react";
import { api } from "../../api/client";
import ProductCard from "../../components/ProductCard";
import Pagination from "../../components/Pagination";

export default function ProfileFavoritesTab({ userId }) {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchFavorites(
    pageToLoad = currentPage,
    pageSize = itemsPerPage
  ) {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await api(
        `/users/${userId}/favorites?page=${pageToLoad}&pageSize=${pageSize}`
      );
      setFavorites(response.items || []);
      setTotalCount(Number(response.total || 0));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setCurrentPage(1);
    fetchFavorites(1, itemsPerPage);
  }, [userId, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  function handlePageChange(nextPage) {
    setCurrentPage(nextPage);
    fetchFavorites(nextPage, itemsPerPage);
  }

  function handlePageSizeChange(nextSize) {
    setItemsPerPage(nextSize);
    setCurrentPage(1);
    fetchFavorites(1, nextSize);
  }

  return (
    <>
      {isLoading && <div className="text-slate-500">Cargando…</div>}
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((favorite) => (
          <ProductCard key={favorite.favoriteId} product={favorite.product} />
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
