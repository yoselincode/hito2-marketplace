import React, { useState } from "react";
import { API_URL } from "../api/client";

export default function Footer() {
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscriberName, setSubscriberName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubscribe() {
    setErrorMessage("");
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subscriberEmail);
    if (!subscriberEmail || !isValidEmail) {
      setErrorMessage("Ingresa un email válido");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: subscriberEmail,
          name: subscriberName || undefined,
        }),
      });
      if (!response.ok) throw new Error("Error en suscripción");
      setIsSubscribed(true);
    } catch {
      setErrorMessage("No se pudo suscribir. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <footer className="border-t bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-6 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-hero-gradient rounded-lg flex items-center justify-center bg-emerald-600">
              <span className="text-primary-foreground font-bold text-sm">
                M
              </span>
            </div>
            <span className="font-semibold">Marketplace</span>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Tu destino de compras online favorito.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Enlaces</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>
              <a href="/">Inicio</a>
            </li>
            <li>
              <a href="/products">Productos</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Newsletter</h4>
          {!isSubscribed ? (
            <div className="mt-3 grid gap-2">
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Tu nombre (opcional)"
                value={subscriberName}
                onChange={(e) => setSubscriberName(e.target.value)}
                disabled={isSubmitting}
              />
              <div className="flex gap-2">
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Tu email"
                  type="email"
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  onClick={handleSubscribe}
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {isSubmitting ? "Enviando…" : "Suscribirse"}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-emerald-600 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              ¡Gracias por suscribirte! 🎉
            </div>
          )}
          {errorMessage && (
            <div className="mt-2 text-xs text-red-400">{errorMessage}</div>
          )}
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-400">
        © 2025 Marketplace hecho con ❤️ por Yoselin.
      </div>
    </footer>
  );
}
