import { useState, useCallback } from 'react';

export function useTryOnQueue() {
  const [shortlist, setShortlist] = useState<Set<string>>(new Set());

  const toggleItem = useCallback((itemId: string) => {
    setShortlist((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const isInShortlist = useCallback((itemId: string) => {
    return shortlist.has(itemId);
  }, [shortlist]);

  const count = shortlist.size;

  return { shortlist, count, toggleItem, isInShortlist };
}
