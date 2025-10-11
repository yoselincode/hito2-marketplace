import React, { useEffect, useState, useCallback } from "react";
import { api, API_URL } from "../api/client";
import { Link } from "react-router";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../hooks/useAuth";
import Pagination from "../components/Pagination";

export default function ProfilePage() {
  const { currentUserId } = useAuth();
  const [activeTab, setActiveTab] = useState("products");
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
  const formatDateTime = useCallback(
    (iso) => new Date(iso).toLocaleString("es-CL"),
    []
  );

  useEffect(() => {
    if (!currentUserId) return;
    (async () => {
      try {
        const user = await fetch(`${API_URL}/users/${currentUserId}`).then((r) => r.json());
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      }
    })();
  }, [currentUserId]);

  async function fetchPageData(pageToLoad = currentPage) {
    if (!currentUserId) return;
    setIsLoading(true);
    try {
      if (activeTab === "products") {
        const url = new URL(`${API_URL}/users/${currentUserId}/products`);
        url.searchParams.set("page", String(pageToLoad));
        url.searchParams.set("pageSize", String(itemsPerPage));
        const data = await fetch(url).then((r) => r.json());
        setEntries(Array.isArray(data.items) ? data.items : []);
        setTotalCount(Number(data.total || 0));
      } else if (activeTab === "favorites") {
        const data = await api(
          `/users/${currentUserId}/favorites?page=${pageToLoad}&pageSize=${itemsPerPage}`
        );
        setEntries(Array.isArray(data.items) ? data.items : []);
        setTotalCount(Number(data.total || 0));
      } else if (activeTab === "purchases") {
        const data = await api(
          `/users/${currentUserId}/sales?page=${pageToLoad}&pageSize=${itemsPerPage}`
        );
        setEntries(Array.isArray(data.items) ? data.items : []);
        setTotalCount(Number(data.total || 0));
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setCurrentPage(1);
    fetchPageData(1);
  }, [activeTab, itemsPerPage, currentUserId]);

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  function handlePageChange(nextPage) {
    setCurrentPage(nextPage);
    fetchPageData(nextPage);
  }

  function handlePageSizeChange(nextSize) {
    setItemsPerPage(nextSize);
    setCurrentPage(1);
    fetchPageData(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-slate-100 overflow-hidden">
            {currentUser?.image ? (
              <img
                src={currentUser.image}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {currentUser
                ? `${currentUser.name || ""} ${currentUser.surname || ""}`.trim() ||
                  "Mi perfil"
                : "Mi perfil"}
            </h1>
            {currentUser?.phone && (
              <div className="text-sm text-slate-500">{currentUser.phone}</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setActiveTab("products")}
          className={`rounded-xl px-3 py-1.5 ${
            activeTab === "products" ? "bg-slate-900 text-white" : "border"
          }`}
        >
          Mis productos
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`rounded-xl px-3 py-1.5 ${
            activeTab === "favorites" ? "bg-slate-900 text-white" : "border"
          }`}
        >
          Mis favoritos
        </button>
        <button
          onClick={() => setActiveTab("purchases")}
          className={`rounded-xl px-3 py-1.5 ${
            activeTab === "purchases" ? "bg-slate-900 text-white" : "border"
          }`}
        >
          Mis compras
        </button>
      </div>

      {activeTab === "products" && (
        <div className="mt-6">
          <Link
            to="/products/new"
            className="inline-block rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            + Crear nuevo producto
          </Link>
        </div>
      )}

      {isLoading && <div className="mt-6 text-slate-500">Cargando…</div>}

      {activeTab !== "purchases" ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeTab === "products" &&
            entries.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                canManage
                onDelete={async () => {
                  const confirmed = confirm(
                    "¿Eliminar este producto? Esta acción no se puede deshacer."
                  );
                  if (!confirmed) return;
                  try {
                    await api(`/products/${product.id}`, { method: "DELETE" });
                    fetchPageData(currentPage);
                  } catch {
                    alert("No se pudo eliminar el producto");
                  }
                }}
              />
            ))}

          {activeTab === "favorites" &&
            entries.map((favorite) => (
              <ProductCard
                key={favorite.favoriteId}
                product={favorite.product}
              />
            ))}
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {entries.length === 0 && (
            <div className="rounded-2xl border bg-white p-6 text-slate-600">
              Aún no has realizado compras.
            </div>
          )}

          {entries.map((sale) => {
            const neto = Number(sale.totalAmount || 0);
            const iva = Number(sale.totalIva || 0);
            const total = neto + iva;

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
                    const price = Number(saleItem.price || 0); 
                    const itemIva = Number(saleItem.iva || 0);
                    const itemNeto = price * qty;
                    const itemTotal = itemNeto + itemIva;

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
                            Cantidad: <span className="font-semibold">{qty}</span>
                            {" · "}Precio: {currency(price)}
                            {" · "}IVA: {currency(itemIva)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Neto ítem</div>
                          <div className="font-semibold">{currency(itemNeto)}</div>
                          <div className="mt-1 text-xs text-slate-500">Total ítem</div>
                          <div className="font-semibold">{currency(itemTotal)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-end gap-6 text-sm">
                  <div className="text-slate-600">
                    Neto venta: <span className="font-semibold">{currency(neto)}</span>
                  </div>
                  <div className="text-slate-600">
                    IVA total: <span className="font-semibold">{currency(iva)}</span>
                  </div>
                  <div className="text-lg">
                    Total: <span className="font-bold">{currency(total)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalCount}
        pageSize={itemsPerPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
