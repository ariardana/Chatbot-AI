"use client";
import { useState, useRef, useEffect } from "react";
import TypingDots from "../components/TypingDots";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    // auto scroll to bottom
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    if (!res.ok) {
      setMessages((m) => [...newMessages, { role: "assistant", content: "Error: gagal terhubung ke API" }]);
      setIsTyping(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let reply = "";
    let firstChunk = true;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      reply += chunk;

      // On first chunk, replace typing indicator bubble by assistant bubble
      if (firstChunk) {
        setMessages((m) => [...newMessages, { role: "assistant", content: reply }]);
        firstChunk = false;
      } else {
        setMessages((m) => {
          // replace last assistant message with updated content
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: reply };
          return copy;
        });
      }
    }

    setIsTyping(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-4">
        <div ref={chatRef} className="h-96 overflow-y-auto mb-4 border p-2 rounded">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block px-3 py-2 rounded-lg ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                {msg.content}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="text-left mb-2">
              <span className="inline-block px-3 py-2 rounded-lg bg-gray-200">
                <TypingDots />
              </span>
            </div>
          )}
        </div>

        <div className="flex">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-l px-3 py-2"
            placeholder="Tulis pesan..."
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
          />
          <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded-r">
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
}
