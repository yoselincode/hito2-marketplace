import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { API_URL, api } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";

export default function ProductDetail() {
  const { id: productIdParam } = useParams();
  const { currentUserId, isUserLoggedIn } = useAuth();
  const { isProcessingFavorite, isProductFavorite, toggleFavoriteForProduct } =
    useFavorites(currentUserId);

  const [product, setProduct] = useState(null);
  const productId = Number(productIdParam);

  useEffect(() => {
    fetch(`${API_URL}/products/${productIdParam}`)
      .then((r) => r.json())
      .then(setProduct)
      .catch(() => {});
  }, [productIdParam]);

  async function handleAddToCart() {
    try {
      await api("/cart", {
        method: "POST",
        body: { userId: currentUserId, postId: productId, quantity: 1 },
      });
      alert("Agregado al carrito ✅");
    } catch {
      alert("No se pudo agregar al carrito");
    }
  }

  async function handleToggleFavorite() {
    if (!isUserLoggedIn || !productId || isProcessingFavorite) return;
    await toggleFavoriteForProduct(productId);
  }

  if (!product)
    return <div className="mx-auto max-w-7xl px-4 py-10">Cargando…</div>;

  const favoriteActive = isProductFavorite(productId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-2xl border bg-white p-4">
        <div className="aspect-video rounded-xl bg-slate-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-6 rounded-2xl border p-4">
          <h2 className="text-xl font-semibold">Descripción del Producto</h2>
          <p className="mt-2 text-slate-700 whitespace-pre-wrap">
            {product.description || "Sin descripción."}
          </p>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border bg-white p-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <div className="mt-2 text-emerald-600 text-xl font-bold">
            ${Number(product.price).toFixed(2)}
          </div>

          {isUserLoggedIn ? (
            <div className="mt-4 flex items-stretch gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
              >
                Agregar al carrito
              </button>
              <button
                onClick={handleToggleFavorite}
                disabled={isProcessingFavorite}
                aria-label={
                  favoriteActive
                    ? "Eliminar de favoritos"
                    : "Agregar a favoritos"
                }
                title={
                  favoriteActive
                    ? "Eliminar de favoritos"
                    : "Agregar a favoritos"
                }
                className={[
                  "rounded-xl px-4 py-2 text-white transition",
                  favoriteActive
                    ? "bg-slate-400 hover:bg-slate-500"
                    : "bg-emerald-600 hover:bg-emerald-700",
                  isProcessingFavorite && "opacity-70 cursor-wait",
                ].join(" ")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 21s-6.716-4.37-9.428-7.08A6.5 6.5 0 1 1 12 5.07a6.5 6.5 0 1 1 9.428 8.85C18.716 16.63 12 21 12 21z" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
