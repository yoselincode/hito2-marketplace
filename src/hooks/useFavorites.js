import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "../api/client";

const favoritesCacheByUser = new Map();

async function fetchUserFavorites(userId) {
  const response = await api(`/users/${userId}/favorites?page=1&pageSize=1000`);
  const list = (response?.items ?? response) || [];
  const favoriteProductIds = new Set(
    list.map((f) => Number(f.postId ?? f.product?.id)).filter(Boolean)
  );
  const favoriteIdByProductId = new Map();
  for (const item of list) {
    const productId = Number(item.postId ?? item.product?.id);
    const favoriteId = Number(item.favoriteId ?? item.id);
    if (productId && favoriteId)
      favoriteIdByProductId.set(productId, favoriteId);
  }
  return { favoriteProductIds, favoriteIdByProductId };
}

async function ensureFavoritesForUser(userId) {
  const cached = favoritesCacheByUser.get(userId);
  if (cached?.loaded) return cached;
  if (cached?.promise) return cached.promise;

  const promise = (async () => {
    const data = await fetchUserFavorites(userId);
    const payload = { loaded: true, ...data };
    favoritesCacheByUser.set(userId, payload);
    return payload;
  })();

  favoritesCacheByUser.set(userId, { promise });
  return promise;
}

export function useFavorites(userId) {
  const isMountedRef = useRef(true);
  const [isCheckingFavorites, setIsCheckingFavorites] = useState(false);
  const [isProcessingFavorite, setIsProcessingFavorite] = useState(false);
  const [favoriteProductIds, setFavoriteProductIds] = useState(new Set());

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const hydrateFromCacheIfAvailable = useCallback(() => {
    const cached = userId ? favoritesCacheByUser.get(userId) : null;
    if (cached?.loaded) {
      setFavoriteProductIds(new Set(cached.favoriteProductIds));
      return true;
    }
    return false;
  }, [userId]);

  const refreshFavorites = useCallback(async () => {
    if (!userId) return;
    if (hydrateFromCacheIfAvailable()) return;

    setIsCheckingFavorites(true);
    try {
      const data = await ensureFavoritesForUser(userId);
      if (isMountedRef.current)
        setFavoriteProductIds(new Set(data.favoriteProductIds));
    } finally {
      if (isMountedRef.current) setIsCheckingFavorites(false);
    }
  }, [userId, hydrateFromCacheIfAvailable]);

  useEffect(() => {
    if (!userId) return;
    if (!hydrateFromCacheIfAvailable()) {
      refreshFavorites();
    }
  }, [userId, hydrateFromCacheIfAvailable, refreshFavorites]);

  const isProductFavorite = useCallback(
    (productId) => favoriteProductIds.has(Number(productId)),
    [favoriteProductIds]
  );

  const toggleFavoriteForProduct = useCallback(
    async (productId) => {
      if (!userId || !productId || isProcessingFavorite) return;
      setIsProcessingFavorite(true);
      try {
        const store = await ensureFavoritesForUser(userId);

        if (!store.favoriteProductIds.has(productId)) {
          const created = await api("/favorites", {
            method: "POST",
            body: { userId, postId: productId },
          });
          const newFavoriteId = Number(created?.favoriteId ?? created?.id);
          store.favoriteProductIds.add(productId);
          if (newFavoriteId)
            store.favoriteIdByProductId.set(productId, newFavoriteId);
          favoritesCacheByUser.set(userId, store);
          setFavoriteProductIds(new Set(store.favoriteProductIds));
          return true;
        }

        const favoriteId = store.favoriteIdByProductId.get(productId);
        let removed = false;
        if (favoriteId) {
          await api(`/favorites/${favoriteId}`, { method: "DELETE" });
          removed = true;
        } else {
          try {
            await api(`/favorites`, {
              method: "DELETE",
              body: { userId, postId: productId },
            });
            removed = true;
          } catch {
            removed = false;
          }
        }
        if (removed) {
          store.favoriteProductIds.delete(productId);
          store.favoriteIdByProductId.delete(productId);
          favoritesCacheByUser.set(userId, store);
          setFavoriteProductIds(new Set(store.favoriteProductIds));
          return false;
        }
      } finally {
        setIsProcessingFavorite(false);
      }
    },
    [userId, isProcessingFavorite]
  );

  return {
    isCheckingFavorites,
    isProcessingFavorite,
    isProductFavorite,
    toggleFavoriteForProduct,
  };
}
