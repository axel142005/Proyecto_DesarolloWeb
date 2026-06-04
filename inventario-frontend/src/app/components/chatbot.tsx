"use client";
import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../api/auth_handler";

interface Message { role: "user" | "assistant"; text: string; }

const SUGGESTIONS = [
  "¿Qué productos tienen stock bajo?",
  "¿Cuánto vale el inventario?",
  "¿Qué helados tenemos?",
  "¿Qué me recomiendas reponer?",
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "¡Hola! Soy el asistente de la heladería 🍦 Puedo responder preguntas sobre el inventario. ¿En qué te ayudo?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text }]);
    setLoading(true);
    try {
      const response = await sendChatMessage(text);
      setMessages(prev => [...prev, { role: "assistant", text: response }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Error al conectar con la IA. Verifica que el ANTHROPIC_API_KEY esté configurado en el .env del backend." }]);
    } finally { setLoading(false); }
  }

  return (
    <>
      {/* Botón flotante */}
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl z-50 transition-all hover:scale-110 active:scale-95"
        style={{ background: open ? "#f4647a" : "linear-gradient(135deg, #f4647a, #ff8fa3)", color: "white", boxShadow: "0 4px 20px rgba(244,100,122,0.4)" }}>
        {open ? "✕" : "🤖"}
      </button>

      {/* Panel del chat */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 rounded-2xl flex flex-col z-50"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", height: "460px", boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>

          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3 rounded-t-2xl"
            style={{ borderBottom: "1px solid var(--border-subtle)", background: "linear-gradient(135deg, rgba(244,100,122,0.06), rgba(78,205,196,0.06))" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "linear-gradient(135deg, #f4647a, #ff8fa3)" }}>🤖</div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Asistente IA</p>
              <p className="text-xs font-medium" style={{ color: "var(--mint)" }}>● Conectado al inventario</p>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: msg.role === "user" ? "linear-gradient(135deg, #f4647a, #ff8fa3)" : "var(--bg-base)",
                    color: msg.role === "user" ? "white" : "var(--text-primary)",
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    border: msg.role === "assistant" ? "1px solid var(--border-subtle)" : "none",
                  }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl text-sm" style={{ background: "var(--bg-base)", color: "var(--text-tertiary)", border: "1px solid var(--border-subtle)" }}>
                  Pensando...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Sugerencias */}
          {messages.length === 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)}
                  className="text-xs px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
                  style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(244,100,122,0.2)", fontWeight: 500 }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 flex gap-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(input)}
              placeholder="Pregunta algo..."
              className="flex-1 px-3 py-2 rounded-xl text-sm"
              style={{ background: "var(--bg-base)", border: "1.5px solid var(--border-default)", color: "var(--text-primary)" }} />
            <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
              className="px-3 py-2 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: input.trim() ? "linear-gradient(135deg, #f4647a, #ff8fa3)" : "var(--border-default)", cursor: input.trim() ? "pointer" : "not-allowed" }}>
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
