import React from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const { isUserLoggedIn, logoutUser } = useAuth();

  function handleLogout() {
    logoutUser();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-hero-gradient rounded-lg flex items-center justify-center bg-emerald-600">
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <span className="font-semibold">Marketplace</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-emerald-600"
                : "text-slate-600 hover:text-slate-900"
            }
          >
            Inicio
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "text-emerald-600"
                : "text-slate-600 hover:text-slate-900"
            }
          >
            Productos
          </NavLink>
          {isUserLoggedIn && (
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                isActive
                  ? "text-emerald-600"
                  : "text-slate-600 hover:text-slate-900"
              }
            >
              Favoritos
            </NavLink>
          )}
          {isUserLoggedIn && (
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive
                  ? "text-emerald-600"
                  : "text-slate-600 hover:text-slate-900"
              }
            >
              Carrito
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {!isUserLoggedIn ? (
            <>
              <Link
                className="rounded-xl border px-3 py-1.5 text-sm"
                to="/login"
              >
                Iniciar sesión
              </Link>
              <Link
                className="rounded-xl bg-emerald-600 px-3 py-1.5 text-sm text-white"
                to="/register"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <Link
                className="rounded-xl border px-3 py-1.5 text-sm"
                to="/profile"
              >
                Mi perfil
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-xl px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                Salir
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
