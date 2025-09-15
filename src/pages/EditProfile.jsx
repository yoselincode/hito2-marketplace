import React, { useEffect, useState } from "react";
import { API_URL } from "../api/client";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

import ProfileFavoritesTab from "./profile/ProfileFavoritesTab";
import ProfilePurchasesTab from "./profile/ProfilePurchasesTab";
import ProfileProductsTab from "./profile/ProfileProductsTab";

export default function ProfilePage() {
  const { currentUserId } = useAuth();
  const [activeTab, setActiveTab] = useState("products");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!currentUserId) return;
    (async () => {
      try {
        const response = await fetch(`${API_URL}/users/${currentUserId}`);
        const user = await response.json();
        setCurrentUser(user);
      } catch {}
    })();
  }, [currentUserId]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-slate-100 overflow-hidden">
            {currentUser?.image ? (
              <img
                src={currentUser.image}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {currentUser
                ? `${currentUser.name || ""} ${
                    currentUser.surname || ""
                  }`.trim() || "Mi perfil"
                : "Mi perfil"}
            </h1>
            {currentUser?.phone && (
              <div className="text-sm text-slate-500">{currentUser.phone}</div>
            )}
          </div>
        </div>
        <Link
          to="/profile/edit"
          className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
        >
          Editar perfil
        </Link>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setActiveTab("products")}
          className={`rounded-xl px-3 py-1.5 ${
            activeTab === "products" ? "bg-slate-900 text-white" : "border"
          }`}
        >
          Mis productos
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`rounded-xl px-3 py-1.5 ${
            activeTab === "favorites" ? "bg-slate-900 text-white" : "border"
          }`}
        >
          Mis favoritos
        </button>
        <button
          onClick={() => setActiveTab("purchases")}
          className={`rounded-xl px-3 py-1.5 ${
            activeTab === "purchases" ? "bg-slate-900 text-white" : "border"
          }`}
        >
          Mis compras
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "products" && (
          <ProfileProductsTab userId={currentUserId} />
        )}
        {activeTab === "favorites" && (
          <ProfileFavoritesTab userId={currentUserId} />
        )}
        {activeTab === "purchases" && (
          <ProfilePurchasesTab userId={currentUserId} />
        )}
      </div>
    </div>
  );
}
