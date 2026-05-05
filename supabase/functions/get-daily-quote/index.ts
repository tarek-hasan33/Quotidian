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
    const response = await fetch("https://zenquotes.io/api/random");

    if (!response.ok) {
      throw new Error("Failed to fetch daily quote");
    }

    const data = await response.json();

    const payload = {
      content: data?.[0]?.q ?? "",
      author: data?.[0]?.a ?? "",
      tags: [],
      sourceId: null,
    };

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
