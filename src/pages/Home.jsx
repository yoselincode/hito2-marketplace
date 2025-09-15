import React, { useEffect, useState } from "react";
import { API_URL } from "../api/client";
import { Link } from "react-router";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(false);
  const [featuredError, setFeaturedError] = useState("");

  useEffect(() => {
    let isActive = true;
    async function fetchFeaturedProducts() {
      setIsLoadingFeatured(true);
      setFeaturedError("");
      try {
        const response = await fetch(`${API_URL}/products/search?&pageSize=6`);
        const data = await response.json();
        if (!isActive) return;
        setFeaturedProducts(data.items || []);
      } catch (e) {
        if (!isActive) return;
        setFeaturedError("No se pudieron cargar los destacados");
      } finally {
        if (isActive) setIsLoadingFeatured(false);
      }
    }
    fetchFeaturedProducts();
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
      <section className="grid gap-8 lg:grid-cols-2 items-center">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            Tu Marketplace <span className="text-emerald-600">Favorito</span>
          </h1>
          <p className="text-slate-600 max-w-xl">
            Descubre miles de productos de calidad, con envío rápido y los
            mejores precios. Tu experiencia de compra perfecta te espera aquí.
          </p>
          <div className="flex gap-3">
            <Link
              to="/products"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-white"
            >
              Explorar Productos
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border bg-white p-3 shadow-sm">
          <div className="rounded-2xl bg-emerald-50 aspect-video">
            <img src="/bg.png" alt="Banner principal" />
          </div>
        </div>
      </section>

      <section id="destacados">
        <h2 className="mb-4 text-2xl font-bold">Productos Destacados</h2>
        {isLoadingFeatured && <div className="text-slate-500">Cargando…</div>}
        {featuredError && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {featuredError}
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
