import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { api } from "../api/client";

export default function CheckoutSuccess() {
  const { id: saleIdParam } = useParams();
  const [saleData, setSaleData] = useState(null);

  useEffect(() => {
    api(`/sales/${saleIdParam}`)
      .then(setSaleData)
      .catch(() => {});
  }, [saleIdParam]);

  const formattedSaleId =
    saleIdParam && saleIdParam.padStart
      ? saleIdParam.padStart(6, "0")
      : saleIdParam;

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <Link to="/" className="text-emerald-600">
        ← Volver al inicio
      </Link>
      <div className="mt-6 rounded-2xl border bg-white p-10">
        <h1 className="text-3xl font-extrabold">Pedido realizado con éxito</h1>
        <div className="mt-2 text-slate-500">#{formattedSaleId}</div>
        <div className="mx-auto mt-8 h-20 w-20 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-4xl">
          ✓
        </div>
      </div>
    </div>
  );
}
