import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const STORAGE_KEY = "quotidian_daily_quote";

const getTodayString = () => new Date().toISOString().slice(0, 10);

export const useDailyQuote = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadQuote = async () => {
      const today = getTodayString();

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.date === today) {
            if (isMounted) {
              setQuote({
                content: parsed.content,
                author: parsed.author,
                tags: parsed.tags ?? [],
                sourceId: parsed.sourceId,
              });
              setLoading(false);
            }
            return;
          }
        }

        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        const { data, error: invokeError } = await supabase.functions.invoke(
          "get-daily-quote"
        );

        if (invokeError) {
          throw invokeError;
        }

        const nextQuote = {
          content: data?.content ?? "",
          author: data?.author ?? "",
          tags: data?.tags ?? [],
          sourceId: data?.sourceId ?? null,
        };

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ date: today, ...nextQuote })
        );

        if (isMounted) {
          setQuote(nextQuote);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    loadQuote();

    return () => {
      isMounted = false;
    };
  }, []);

  return { quote, loading, error };
};
