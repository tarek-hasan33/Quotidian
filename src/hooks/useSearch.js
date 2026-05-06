import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

const PAGE_SIZE = 10;

const mapResult = (item) => ({
  sourceId: item?.id ?? null,
  content: item?.content ?? "",
  author: item?.author ?? "",
  tags: item?.tags ?? [],
});

export const useSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const pageRef = useRef(0);
  const queryRef = useRef(query);

  useEffect(() => {
    let isMounted = true;

    if (!query || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      setHasSearched(false);
      setHasMore(true);
      setPage(0);
      pageRef.current = 0;
      return () => {
        isMounted = false;
      };
    }

    queryRef.current = query;
    setResults([]);
    setPage(0);
    pageRef.current = 0;
    setHasMore(true);
    setHasSearched(false);
    setError(null);

    const timeoutId = setTimeout(async () => {
      if (!isMounted) return;

      setLoading(true);
      setHasSearched(true);

      try {
        const { data, error: invokeError } = await supabase.functions.invoke(
          "search-quotes",
          {
            body: { query: query.trim(), page_number: 0, page_size: PAGE_SIZE },
          }
        );

        if (invokeError) throw invokeError;

        const mapped = (data?.results ?? []).map(mapResult);

        if (isMounted) {
          setResults(mapped);
          setHasMore(mapped.length === PAGE_SIZE);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [query]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;

    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        "search-quotes",
        {
          body: {
            query: queryRef.current.trim(),
            page_number: nextPage,
            page_size: PAGE_SIZE,
          },
        }
      );

      if (invokeError) throw invokeError;

      const mapped = (data?.results ?? []).map(mapResult);

      setResults((prev) => [...prev, ...mapped]);
      pageRef.current = nextPage;
      setPage(nextPage);
      setHasMore(mapped.length === PAGE_SIZE);
    } catch (err) {
      setError(err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore]);

  return {
    results,
    loading,
    loadingMore,
    error,
    hasSearched,
    hasMore,
    loadMore,
  };
};
