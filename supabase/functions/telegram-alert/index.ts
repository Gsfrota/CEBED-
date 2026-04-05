import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "8505886580:AAF0xs6kdlo-Rsm_cffqz4Jsh9VjG1_y-Bc";
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") ?? "7354814208";

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: { record?: Record<string, unknown>; type?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (body.type !== "INSERT" || !body.record) {
    return new Response("Ignored", { status: 200 });
  }

  const r = body.record as {
    nome?: string;
    whatsapp?: string;
    localizacao?: string;
    prescricao?: string;
    apoio_juridico?: string;
    created_at?: string;
  };

  const createdAt = r.created_at
    ? new Date(r.created_at).toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        dateStyle: "short",
        timeStyle: "short",
      })
    : new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        dateStyle: "short",
        timeStyle: "short",
      });

  const message = [
    "🌿 *Novo Pré-Cadastro CEBEDÊ*",
    "",
    `👤 *Nome:* ${r.nome ?? "—"} `,
    `📱 *WhatsApp:* ${r.whatsapp ?? "—"} `,
    `📍 *Localização:* ${r.localizacao ?? "—"} `,
    `💊 *Prescrição Médica:* ${r.prescricao ?? "—"} `,
    `⚖️ *Apoio Jurídico:* ${r.apoio_juridico ?? "—"} `,
    `🕐 *Recebido em:* ${createdAt}`,
  ].join("\n");

  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const telegramRes = await fetch(telegramUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    }),
  });

  if (!telegramRes.ok) {
    const err = await telegramRes.text();
    console.error("Telegram error:", err);
    return new Response("Telegram error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
});
