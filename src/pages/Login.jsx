import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [emailAddress, setEmailAddress] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    try {
      await loginUser(emailAddress, passwordValue);
      navigate("/");
    } catch {
      setErrorMessage("Credenciales inválidas");
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Link to="/" className="text-emerald-600">
        ← Volver al inicio
      </Link>
      <div className="mt-6 rounded-2xl border bg-white p-8">
        <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
        <p className="mt-1 text-center text-slate-500">
          Accede a tu cuenta de marketplace
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm">Contraseña</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              required
            />
          </div>
          {errorMessage && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
          <button className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-white">
            Iniciar Sesión
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-emerald-600">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
