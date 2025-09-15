import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function Checkout() {
  const { currentUserId } = useAuth();
  const [contactEmail, setContactEmail] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUserId) return;
    api(`/users/${currentUserId}/cart`).then((response) =>
      setCartItems(response.items || [])
    );
  }, [currentUserId]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  const tax = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * 0.19 * item.quantity,
    0
  );

  async function handlePlaceOrder() {
    const payload = {
      userId: currentUserId,
      items: cartItems.map((item) => ({
        postId: item.postId,
        quantity: item.quantity,
        price: Number(item.product.price),
        iva: Number((Number(item.product.price) * 0.19).toFixed(2)),
      })),
    };
    const sale = await api(`/sales`, { method: "POST", body: payload });
    navigate(`/checkout/success/${sale.id}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <a href="/cart" className="text-emerald-600">
          ← Volver al carrito
        </a>
        <h1 className="mt-2 text-3xl font-bold">Información de contacto</h1>
        <div className="mt-6 rounded-2xl border bg-white p-6 space-y-4">
          <label className="block text-sm font-medium">
            Correo electrónico
          </label>
          <input
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="user@gmail.com"
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>
      </div>

      <aside>
        <div className="rounded-2xl border bg-white p-4">
          <h2 className="font-semibold">Resumen del pedido</h2>
          <ul className="mt-3 space-y-3">
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-lg bg-slate-100 overflow-hidden">
                  <img
                    src={item.product.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {item.product.title}
                  </div>
                </div>
                <div className="text-sm">x{item.quantity}</div>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1">
            <div className="flex justify-between">
              <dt>IVA</dt>
              <dd className="font-semibold">${tax.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between text-xl">
              <dt>Total</dt>
              <dd className="font-bold">${(subtotal + tax).toFixed(2)}</dd>
            </div>
          </dl>
          <button
            onClick={handlePlaceOrder}
            className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2 text-white"
          >
            Realizar el pedido
          </button>
        </div>
      </aside>
    </div>
  );
}
