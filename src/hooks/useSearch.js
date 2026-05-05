import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const useSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!query) {
      setResults([]);
      setLoading(false);
      setError(null);
      setHasSearched(false);
      return () => {
        isMounted = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      if (!isMounted) {
        return;
      }

      setLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const { data, error: invokeError } = await supabase.functions.invoke(
          "search-quotes",
          {
            body: { query },
          }
        );

        if (invokeError) {
          throw invokeError;
        }

        const mappedResults = (data ?? []).map((item) => ({
          sourceId: item?.sourceId ?? null,
          content: item?.content ?? "",
          author: item?.author ?? "",
          tags: item?.tags ?? [],
        }));

        if (isMounted) {
          setResults(mappedResults);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [query]);

  return { results, loading, error, hasSearched };
};
