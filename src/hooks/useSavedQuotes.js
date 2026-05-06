import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export const useSavedQuotes = () => {
  const { user } = useAuth();
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSavedQuotes = useCallback(async () => {
    if (!user) {
      setSavedQuotes([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("saved_quotes")
        .select("*")
        .eq("user_id", user.id)
        .order("saved_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setSavedQuotes(data ?? []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedQuotes();
  }, [fetchSavedQuotes]);

  const saveQuote = useCallback(
    async ({ content, author, tags, sourceId }) => {
      if (!user) {
        return;
      }

      setError(null);

      const newQuote = {
        user_id: user.id,
        content,
        author,
        tags,
        source_id: sourceId,
      };

      const { data, error: saveError } = await supabase
        .from("saved_quotes")
        .insert(newQuote)
        .select("*")
        .single();

      if (saveError) {
        setError(saveError);
        return;
      }

      if (data) {
        setSavedQuotes((prev) => [data, ...prev]);
      }
    },
    [user]
  );

  const unsaveQuote = useCallback(
    async (quoteId) => {
      if (!user) {
        return;
      }

      setError(null);

      const { error: deleteError } = await supabase
        .from("saved_quotes")
        .delete()
        .eq("id", quoteId)
        .eq("user_id", user.id);

      if (deleteError) {
        setError(deleteError);
        return;
      }

      setSavedQuotes((prev) => prev.filter((quote) => quote.id !== quoteId));
    },
    [user]
  );

  const isSaved = useCallback(
    (sourceId) => {
      if (!sourceId) {
        return false;
      }

      return savedQuotes.some((quote) => quote.source_id === sourceId);
    },
    [savedQuotes]
  );

  const getSavedId = useCallback(
    (sourceId) => {
      if (!sourceId) {
        return null;
      }

      return (
        savedQuotes.find((quote) => quote.source_id === sourceId)?.id ?? null
      );
    },
    [savedQuotes]
  );

  return useMemo(
    () => ({
      savedQuotes,
      saveQuote,
      unsaveQuote,
      isSaved,
      getSavedId,
      loading,
      error,
    }),
    [savedQuotes, saveQuote, unsaveQuote, isSaved, getSavedId, loading, error]
  );
};
