import React, { useEffect, useState } from "react";
import { api, API_URL } from "../api/client";
import { useNavigate, Link, useParams } from "react-router";
import { useAuth } from "../hooks/useAuth";

function encodeFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CreateProduct() {
  const { id: productIdParam } = useParams();
  const isEditing = !!productIdParam;
  const navigate = useNavigate();
  const { currentUserId } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    iva: "",
    description: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      try {
        const product = await fetch(
          `${API_URL}/products/${productIdParam}`
        ).then((r) => r.json());
        updateFieldValue("title", product.title || "");
        updateFieldValue("price", product.price ?? "");
        updateFieldValue("stock", product.stock ?? "");
        updateFieldValue("iva", product.iva ?? "");
        updateFieldValue("description", product.description || "");
        const image = product.image || "";
        updateFieldValue("image", image);
        setImagePreview(image);
      } catch {
        setErrorMessage("No se pudo cargar el producto");
      }
    })();
  }, [isEditing, productIdParam]);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    const payload = {
      userId: currentUserId,
      title: formData.title.trim(),
      description: (formData.description || "").trim() || null,
      price: Number(formData.price),
      image: formData.image,
      iva: Number(formData.iva),
      stock: Number(formData.stock),
    };
    if (
      !payload.userId ||
      !payload.title ||
      isNaN(payload.price) ||
      !payload.image
    ) {
      setErrorMessage(
        "Completa los campos obligatorios (título, precio, imagen)"
      );
      return;
    }
    try {
      setIsSubmitting(true);
      if (isEditing) {
        await api(`/products/${productIdParam}`, {
          method: "PUT",
          body: payload,
        });
      } else {
        await api(`/products`, { method: "POST", body: payload });
      }
      navigate(`/profile`);
    } catch (err) {
      setErrorMessage(
        err.message ||
          (isEditing
            ? "Error actualizando producto"
            : "Error publicando producto")
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/" className="text-emerald-600">
        ← Volver al inicio
      </Link>

      <div className="mt-4 rounded-2xl border bg-white p-6">
        <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-emerald-100 grid place-items-center text-2xl text-emerald-700">
          {isEditing ? "✏️" : "⬆️"}
        </div>
        <h1 className="text-2xl font-bold text-center">
          {isEditing ? "Editar Producto" : "Crear Nueva Publicación"}
        </h1>
        <p className="mt-1 text-center text-slate-500">
          {isEditing
            ? "Actualiza los datos de tu producto"
            : "Completa la información de tu producto para publicarlo"}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
          <div>
            <label className="text-sm font-medium">Imagen del Producto</label>
            <div className="mt-2 grid gap-3 sm:grid-cols-[200px_1fr] items-start">
              <label className="relative grid h-40 w-full place-items-center rounded-xl border-2 border-dashed bg-slate-50 text-slate-500 hover:bg-slate-100 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  onChange={handleSelectImageFile}
                />
                <span>{imagePreview ? "Cambiar imagen" : "Subir imagen"}</span>
              </label>
              {imagePreview && (
                <div className="rounded-xl border overflow-hidden h-40">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm">Título del Producto</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2"
                value={formData.title}
                onChange={(e) => updateFieldValue("title", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm">Precio *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="mt-1 w-full rounded-xl border px-3 py-2"
                value={formData.price}
                onChange={(e) => updateFieldValue("price", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm">Stock *</label>
              <input
                type="number"
                min="0"
                step="1"
                className="mt-1 w-full rounded-xl border px-3 py-2"
                value={formData.stock}
                onChange={(e) => updateFieldValue("stock", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm">IVA *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="mt-1 w-full rounded-xl border px-3 py-2"
                value={formData.iva}
                onChange={(e) => updateFieldValue("iva", e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm">Descripción *</label>
              <textarea
                rows={5}
                className="mt-1 w-full rounded-xl border px-3 py-2"
                value={formData.description}
                onChange={(e) =>
                  updateFieldValue("description", e.target.value)
                }
              />
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="flex justify-end">
            <button
              disabled={isSubmitting}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-white disabled:opacity-60"
            >
              {isSubmitting
                ? isEditing
                  ? "Guardando…"
                  : "Publicando…"
                : isEditing
                ? "Guardar cambios"
                : "Publicar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
