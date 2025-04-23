"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  content: string;
  isAI: boolean;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now(),
      content: input.trim(),
      isAI: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        content: "这是AI的回复内容。这是一个模拟回复，实际应用中会连接AI接口。",
        isAI: true,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 消息容器 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isAI ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-3xl p-4 rounded-lg ${
                message.isAI
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "bg-blue-600 text-white"
              }`}
            >
              <div className="flex items-start gap-3">
                {message.isAI && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
                )}
                <div className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-3xl p-4 rounded-lg bg-white shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="h-3 w-3 bg-gray-400 rounded-full animate-bounce" />
                <div className="h-3 w-3 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="h-3 w-3 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入你的问题..."
              className="flex-1 p-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              发送
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
