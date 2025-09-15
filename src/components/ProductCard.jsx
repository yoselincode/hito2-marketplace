import { useState } from "react";
import { Link } from "react-router";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";

export default function ProductCard({ product, canManage = false, onDelete }) {
  const { currentUserId, isUserLoggedIn } = useAuth();
  const { isProcessingFavorite, isProductFavorite, toggleFavoriteForProduct } =
    useFavorites(currentUserId);

  const productId = Number(product?.id);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  async function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!isUserLoggedIn || !productId || isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      await api("/cart", {
        method: "POST",
        body: { userId: currentUserId, postId: productId, quantity: 1 },
      });
      alert("Agregado al carrito ✅");
    } catch {
      alert("No se pudo agregar al carrito");
    } finally {
      setIsAddingToCart(false);
    }
  }

  async function handleToggleFavorite(event) {
    event.preventDefault();
    event.stopPropagation();
    if (canManage) return;
    await toggleFavoriteForProduct(productId);
  }

  function handleDelete(event) {
    event.preventDefault();
    event.stopPropagation();
    onDelete?.(productId);
  }

  const favoriteActive = isProductFavorite(productId);

  return (
    <Link
      to={`/products/${product?.id}`}
      className="group block rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
        <img
          src={product?.image}
          alt={product?.title || "Producto"}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mt-4">
        <h3 className="line-clamp-1 text-base font-semibold">
          {product?.title}
        </h3>
        <p className="text-sm text-slate-600">
          ${Number(product?.price ?? 0).toFixed(2)}
        </p>

        {isUserLoggedIn && !canManage && (
          <div className="mt-3 flex items-stretch gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-70"
            >
              Agregar al carrito
            </button>

            <button
              type="button"
              onClick={handleToggleFavorite}
              disabled={isProcessingFavorite}
              aria-label={
                favoriteActive ? "Eliminar de favoritos" : "Agregar a favoritos"
              }
              title={
                favoriteActive ? "Eliminar de favoritos" : "Agregar a favoritos"
              }
              className={[
                "rounded-xl px-3 py-2 text-sm text-white transition",
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
        )}

        {canManage && (
          <div className="mt-3 flex items-center gap-2">
            <Link
              to={`/products/edit/${product?.id}`}
              onClick={(event) => event.stopPropagation()}
              className="rounded-xl border px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              Editar
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-xl px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
