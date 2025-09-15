import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function Cart() {
  const { currentUserId } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  async function fetchCartItems() {
    if (!currentUserId) return;
    const response = await api(`/users/${currentUserId}/cart`);
    setCartItems(response.items || []);
  }

  useEffect(() => {
    fetchCartItems();
  }, [currentUserId]);

  async function updateItemQuantity(cartItemId, newQuantity) {
    const quantity = Math.max(1, Number(newQuantity) || 1);
    await api(`/cart/${cartItemId}`, { method: "PUT", body: { quantity } });
    fetchCartItems();
  }

  async function removeCartItem(cartItemId) {
    await api(`/cart/${cartItemId}`, { method: "DELETE" });
    fetchCartItems();
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  const tax = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * 0.19 * item.quantity,
    0
  );

  const hasItemsInCart = cartItems.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <Link to="/" className="text-emerald-600">
          ← Volver al inicio
        </Link>
        <h1 className="text-3xl font-bold">Carrito de compras</h1>

        {!hasItemsInCart && (
          <div className="rounded-2xl border bg-white p-8 text-center">
            <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
              🛒
            </div>
            <h2 className="text-lg font-semibold">Tu carrito está vacío</h2>
            <p className="mt-1 text-slate-600">
              Agrega productos desde la tienda para verlos aquí.
            </p>
            <div className="mt-4">
              <Link
                to="/products"
                className="inline-block rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
              >
                Explorar productos
              </Link>
            </div>
          </div>
        )}

        {hasItemsInCart &&
          cartItems.map((cartItem) => (
            <div key={cartItem.id} className="rounded-2xl border bg-white p-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-xl bg-slate-100 overflow-hidden">
                  <img
                    src={cartItem.product.image}
                    alt={cartItem.product.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{cartItem.product.title}</div>
                  <div className="text-sm text-slate-600">
                    ${Number(cartItem.product.price).toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-600">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={cartItem.quantity}
                    onChange={(e) =>
                      updateItemQuantity(cartItem.id, e.target.value)
                    }
                    className="w-20 rounded-xl border px-2 py-1"
                  />
                  <button
                    onClick={() => removeCartItem(cartItem.id)}
                    className="rounded-xl px-3 py-2 text-slate-500 hover:bg-slate-50"
                    title="Eliminar del carrito"
                    aria-label="Eliminar del carrito"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {hasItemsInCart && (
        <aside className="space-y-4">
          <div className="rounded-2xl border bg-white p-4">
            <h2 className="text-lg font-semibold">Total del carrito</h2>
            <dl className="mt-3 space-y-1">
              <div className="flex justify-between">
                <dt>IVA</dt>
                <dd className="font-semibold">${tax.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between text-xl">
                <dt>Total estimado</dt>
                <dd className="font-bold">${(subtotal + tax).toFixed(2)}</dd>
              </div>
            </dl>
            <Link
              to="/checkout"
              className="mt-4 block rounded-xl bg-emerald-600 px-4 py-2 text-center text-white hover:bg-emerald-700"
            >
              Finalizar Compra
            </Link>
          </div>
        </aside>
      )}
    </div>
  );
}
