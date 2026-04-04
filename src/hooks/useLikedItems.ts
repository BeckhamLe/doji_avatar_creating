import { useState, useCallback } from 'react';

export function useLikedItems() {
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const toggleLike = useCallback((itemId: string) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  }, []);

  const isLiked = useCallback((itemId: string) => {
    return likedItems.has(itemId);
  }, [likedItems]);

  return { likedItems, count: likedItems.size, toggleLike, isLiked };
}
