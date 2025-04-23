"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

interface Message {
  id: number;
  content: string;
  isAI: boolean;
}

const openrouter = createOpenRouter({
  apiKey:
    "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",
});

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMessages = localStorage.getItem("chatMessages");
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      content: input.trim(),
      isAI: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await streamText({
        model: openrouter("microsoft/mai-ds-r1:free"),
        messages: [{ role: "user", content: input.trim() }],
      });

      const aiMessage: Message = {
        id: Date.now() + 1,
        content:
          '<div class="loading-dots"><span></span><span></span><span></span></div>',
        isAI: true,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);

      let isFirstChunk = true;
      for await (const delta of response.textStream) {
        if (isFirstChunk) {
          aiMessage.content = delta;
          isFirstChunk = false;
        } else {
          aiMessage.content += delta;
        }

        setMessages((prev) => {
          const prevMessages = prev.filter((m) => m.id !== aiMessage.id);
          return [...prevMessages, aiMessage];
        });
      }
    } catch (error) {
      console.error("API请求失败:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          content: "请求失败，请稍后重试",
          isAI: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const clearChatHistory = () => {
    setMessages([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("chatMessages");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <style>{`
        .loading-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 25px;
        }
        .loading-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #000;
          animation: loading-dots 1.4s infinite;
          margin: 0 5px;
        }
        .loading-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .loading-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes loading-dots {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start ${
              message.isAI ? "justify-start" : "justify-end"
            }`}
          >
            {message.isAI ? (
              <div className="flex items-start gap-3 max-w-2xl w-full">
                <div className="flex-shrink-0 w-12 h-12 mt-2">
                  <Image
                    src="/StreamAI.png"
                    alt="StreamAI"
                    width={32}
                    height={32}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div
                  className="flex-1 p-4 rounded-lg bg-white shadow-sm border border-gray-200 min-h-[50px] flex items-center"
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
              </div>
            ) : (
              <div className="flex items-start gap-3 max-w-2xl w-full justify-end">
                <div className="flex-1 p-4 rounded-lg bg-blue-600 text-white">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                </div>
                <div className="flex-shrink-0 w-12 h-12 mt-2">
                  <Image
                    src="/head.png"
                    alt="User"
                    width={32}
                    height={32}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 max-w-4xl w-full">
            <div className="flex-shrink-0 w-12 h-12 mt-2">
              <Image
                src="/StreamAI.png"
                alt="StreamAI"
                width={32}
                height={32}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex-1 p-4 rounded-lg bg-white shadow-sm border border-gray-200 min-h-[50px] flex items-center justify-center">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
        <div className="backdrop-blur-sm fixed bottom-0 left-0 right-0 border-t border-gray-200">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex gap-2 items-center">
              <button
                onClick={clearChatHistory}
                className="h-14 w-28 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none dark:focus:ring-red-800"
              >
                清空会话
              </button>
              <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
                <textarea
                  value={input}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入你的问题..."
                  className="text-base bg-white resize-none p-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-14 max-h-14 overflow-y-auto w-full"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-14 w-24 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  发送
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
