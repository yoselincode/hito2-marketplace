import React, { useState } from "react";
import { api } from "../api/client";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

function encodeFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    password: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  function updateFieldValue(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSelectImageFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const base64 = await encodeFileToBase64(file);
    setImagePreview(base64);
    updateFieldValue("image", base64);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    try {
      setIsSubmitting(true);
      await api(`/users`, { method: "POST", body: formData });
      await loginUser(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setErrorMessage(err.message || "No se pudo registrar");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link to="/" className="text-emerald-600">
        ← Volver al inicio
      </Link>
      <div className="mt-6 rounded-2xl border bg-white p-8">
        <h1 className="text-2xl font-bold text-center">Crear Cuenta</h1>
        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label className="text-sm">Foto de perfil</label>
            <div className="mt-2 grid gap-3 sm:grid-cols-[180px_1fr] items-start">
              <label className="relative grid h-36 w-full place-items-center rounded-xl border-2 border-dashed bg-slate-50 text-slate-500 hover:bg-slate-100 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  onChange={handleSelectImageFile}
                />
                <span>{imagePreview ? "Cambiar imagen" : "Subir imagen"}</span>
              </label>
              {imagePreview && (
                <div className="h-36 rounded-xl border overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm">Nombre</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={formData.name}
              onChange={(e) => updateFieldValue("name", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm">Apellido</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={formData.surname}
              onChange={(e) => updateFieldValue("surname", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={formData.email}
              onChange={(e) => updateFieldValue("email", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm">Teléfono</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={formData.phone}
              onChange={(e) => updateFieldValue("phone", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm">Contraseña</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={formData.password}
              onChange={(e) => updateFieldValue("password", e.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <div className="sm:col-span-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="sm:col-span-2">
            <button
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-white disabled:opacity-60"
            >
              {isSubmitting ? "Registrando…" : "Registrar usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
