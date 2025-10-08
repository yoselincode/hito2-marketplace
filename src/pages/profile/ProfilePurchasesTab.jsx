import React, { useEffect, useState, useCallback } from "react";
import { api } from "../../api/client";
import Pagination from "../../components/Pagination";

export default function ProfilePurchasesTab({ userId }) {
  const [purchases, setPurchases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Utilidad: CLP/ES-CL (si quieres decimales mantengo 2; cambia minimumFractionDigits si prefieres sin decimales)
  const currency = useCallback(
    (n) =>
      new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(n || 0)),
    []
  );

  const formatDateTime = useCallback((iso) => {
    try {
      return new Date(iso).toLocaleString("es-CL");
    } catch {
      return "-";
    }
  }, []);

  const fetchPurchases = useCallback(
    async (pageToLoad = currentPage, pageSize = itemsPerPage) => {
      if (!userId) return;
      setIsLoading(true);
      try {
        const response = await api(
          `/users/${userId}/sales?page=${pageToLoad}&pageSize=${pageSize}`
        );
        setPurchases(Array.isArray(response.items) ? response.items : []);
        setTotalCount(Number(response.total || 0));
      } finally {
        setIsLoading(false);
      }
    },
    [userId, currentPage, itemsPerPage]
  );

  useEffect(() => {
    setCurrentPage(1);
    fetchPurchases(1, itemsPerPage);
  }, [userId, itemsPerPage, fetchPurchases]);

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
      {isLoading && (
        <div className="mb-4 text-slate-500">Cargando…</div>
      )}

      <div className="space-y-6">
        {!isLoading && purchases.length === 0 && (
          <div className="rounded-2xl border bg-white p-6 text-slate-600">
            Aún no has realizado compras.
          </div>
        )}

        {purchases.map((sale) => {
          const saleNet = Number(sale.totalAmount || 0);
          const saleIva = Number(sale.totalIva || 0);
          const saleGrandTotal = saleNet + saleIva;

          return (
            <div
              key={sale.id}
              className="rounded-2xl border bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold">Venta #{sale.id}</div>
                <div className="text-sm text-slate-500">
                  {formatDateTime(sale.createdAt)}
                </div>
              </div>

              <div className="mt-3 space-y-3">
                {(sale.items || []).map((saleItem) => {
                  const qty = Number(saleItem.quantity || 0);
                  const price = Number(saleItem.price || 0); // neto unitario
                  const iva = Number(saleItem.iva || 0);     // IVA total del ítem
                  const itemNetSubtotal = price * qty;       // neto por ítem
                  const itemTotal = itemNetSubtotal + iva;   // total por ítem

                  return (
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

                      <div className="flex-1 min-w-0">
                        <div className="font-medium line-clamp-1">
                          {saleItem.product?.title || "Producto"}
                        </div>
                        <div className="text-sm text-slate-600">
                          Cantidad:{" "}
                          <span className="font-semibold">{qty}</span>
                          {" · "}Precio unitario: {currency(price)}
                          {" · "}IVA ítem: {currency(iva)}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-slate-500">Neto ítem</div>
                        <div className="font-semibold">
                          {currency(itemNetSubtotal)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">Total ítem</div>
                        <div className="font-semibold">
                          {currency(itemTotal)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-end gap-6 text-sm">
                <div className="text-slate-600">
                  Neto venta:{" "}
                  <span className="font-semibold">{currency(saleNet)}</span>
                </div>
                <div className="text-slate-600">
                  IVA total:{" "}
                  <span className="font-semibold">{currency(saleIva)}</span>
                </div>
                <div className="text-lg">
                  Total:{" "}
                  <span className="font-bold">
                    {currency(saleGrandTotal)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
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
