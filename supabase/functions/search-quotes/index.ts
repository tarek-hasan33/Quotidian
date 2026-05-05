import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ZenQuotes free tier has no search API; filter server-side.
    const { query = "" } = await req.json().catch(() => ({ query: "" }));

    const response = await fetch("https://zenquotes.io/api/quotes");

    if (!response.ok) {
      throw new Error("Failed to fetch quotes");
    }

    const data = await response.json();
    const normalizedQuery = query.toLowerCase();
    const filtered = (data ?? []).filter((item: { q?: string; a?: string }) => {
      if (!normalizedQuery) {
        return true;
      }

      const content = item?.q ?? "";
      const author = item?.a ?? "";

      return (
        content.toLowerCase().includes(normalizedQuery) ||
        author.toLowerCase().includes(normalizedQuery)
      );
    });

    const mapped = filtered.map((item: { q?: string; a?: string }) => ({
      content: item?.q ?? "",
      author: item?.a ?? "",
      tags: [],
      sourceId: null,
    }));

    return new Response(JSON.stringify(mapped), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
