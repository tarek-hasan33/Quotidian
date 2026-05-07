import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_INSTRUCTION =
  "You are a quote assistant for Quotidian. You ONLY discuss topics related to quotes — their meaning, historical context, the authors who said them, themes, similar quotes, and how quotes relate to life. If asked about anything unrelated to quotes, politely decline and redirect the conversation back to quotes. Keep responses concise and thoughtful — 2 to 4 sentences unless more detail is asked for.";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

const callGroq = async (messages: any[], systemInstruction: string) => {
  const groqMessages = [
    { role: "system", content: systemInstruction },
    ...messages.map((m) => ({
      role: m.role === "model" ? "assistant" : m.role,
      content: m.content,
    })),
  ];

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Groq request failed");
  }

  const data = await response.json();
  return data.choices[0].message.content ?? "";
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    const contents = messages.map((message) => ({
      role: message.role,
      parts: [{ text: message.content }],
    }));

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent" +
        `?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents,
        }),
      }
    );

    // --- Groq silent fallback on Gemini rate-limit ---
    if (response.status === 429) {
      if (!GROQ_API_KEY) {
        return new Response(
          JSON.stringify({
            data: "I'm a bit busy right now. Please try again in a moment!",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const groqText = await callGroq(messages, SYSTEM_INSTRUCTION);
      return new Response(JSON.stringify({ data: groqText }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to get a response. Please try again." }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const responseText = await response.text();
    const data = JSON.parse(responseText);
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return new Response(JSON.stringify({ data: text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred. Please try again.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
