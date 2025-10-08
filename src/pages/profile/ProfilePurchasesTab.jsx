import React, { useEffect, useState } from "react";
import { api } from "../../api/client";
import Pagination from "../../components/Pagination";

export default function ProfilePurchasesTab({ userId }) {
  const [purchases, setPurchases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchPurchases(
    pageToLoad = currentPage,
    pageSize = itemsPerPage
  ) {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await api(
        `/users/${userId}/sales?page=${pageToLoad}&pageSize=${pageSize}`
      );
      setPurchases(response.items || []);
      setTotalCount(Number(response.total || 0));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setCurrentPage(1);
    fetchPurchases(1, itemsPerPage);
  }, [userId, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  function handlePageChange(nextPage) {
    setCurrentPage(nextPage);
    fetchPurchases(nextPage, itemsPerPage);
  }

  function handlePageSizeChange(nextSize) {
    setItemsPerPage(nextSize);
    setCurrentPage(1);
    fetchPurchases(1, nextSize);
  }

  return (
    <>
      {isLoading && <div className="text-slate-500">Cargando…</div>}
      <div className="space-y-6">
        {purchases.length === 0 && (
          <div className="rounded-2xl border bg-white p-6 text-slate-600">
            Aún no has realizado compras.
          </div>
        )}
        {purchases.map((sale) => (
          <div
            key={sale.id}
            className="rounded-2xl border bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-semibold">Venta #{sale.id}</div>
              <div className="text-sm text-slate-500">
                {new Date(sale.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="mt-3 space-y-3">
              {(sale.items || []).map((saleItem) => (
                <div
                  key={saleItem.id}
                  className="flex items-center gap-3 rounded-xl border p-3"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-lg bg-slate-100">
                    {saleItem.product?.image ? (
                      <img
                        src={saleItem.product.image}
                        alt={saleItem.product?.title || "Producto"}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium line-clamp-1">
                      {saleItem.product?.title || "Producto"}
                    </div>
                    <div className="text-sm text-slate-600">
                      Cantidad:{" "}
                      <span className="font-semibold">{saleItem.quantity}</span>
                      {" · "}Precio: ${Number(saleItem.price).toFixed(2)}
                      {" · "}IVA: ${Number(saleItem.iva || 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Subtotal</div>
                    <div className="font-semibold">
                      ${Number(saleItem.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-end gap-6 text-sm">
              <div className="text-slate-600">
                IVA total:{" "}
                <span className="font-semibold">
                  ${Number(sale.totalIva || 0).toFixed(2)}
                </span>
              </div>
              <div className="text-lg">
                Total:{" "}
                <span className="font-bold">
                  ${Number(sale.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
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
