import { NextResponse } from "next/server";

export async function POST(req) {
  const { message } = await req.json();

  // Adjust endpoint/model for your DeepSeek-compatible API
  const upstream = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: message }],
      stream: true
    }),
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    return new Response(JSON.stringify({ error: "Upstream error", details: text }), { status: 502 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          // forward raw chunk to client
          controller.enqueue(value);
        }
      } catch (err) {
        console.error("Stream error:", err);
      } finally {
        controller.close();
      }
    }
  });

  return new NextResponse(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
