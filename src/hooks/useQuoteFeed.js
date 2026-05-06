import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

const PAGE_SIZE = 10;
// Pick a random start point once per session so the feed feels fresh each visit
const RANDOM_START = Math.floor(Math.random() * 490000);

export const useQuoteFeed = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const pageRef = useRef(0);

  const fetchPage = useCallback(async (pageNumber) => {
    const from = RANDOM_START + pageNumber * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error: fetchError } = await supabase
      .from("quotes")
      .select("id, content, author, tags")
      .range(from, to);

    if (fetchError) throw fetchError;
    return data ?? [];
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadInitial = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPage(0);
        if (isMounted) {
          setQuotes(data);
          setHasMore(data.length === PAGE_SIZE);
          setPage(0);
          pageRef.current = 0;
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    loadInitial();
    return () => {
      isMounted = false;
    };
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;
    try {
      const data = await fetchPage(nextPage);
      setQuotes((prev) => [...prev, ...data]);
      pageRef.current = nextPage;
      setPage(nextPage);
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      setError(err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, fetchPage]);

  return { quotes, loading, loadingMore, error, hasMore, loadMore };
};
