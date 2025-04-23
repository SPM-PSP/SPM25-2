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

// 初始化OpenRouter客户端
const openrouter = createOpenRouter({
  apiKey:
    "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",
});

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
    setIsLoading(true); // 开始加载时设为true

    try {
      const response = await streamText({
        model: openrouter("microsoft/mai-ds-r1:free"),
        messages: [{ role: "user", content: input.trim() }],
      });

      // 创建初始AI消息（此时立即显示）
      const aiMessage: Message = {
        id: Date.now() + 1,
        content: "▌", // 使用光标效果表示正在输入
        isAI: true,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false); // 开始接收流时立即关闭加载状态

      // 流式更新消息内容
      for await (const delta of response.textStream) {
        aiMessage.content =
          aiMessage.content === "▌" ? delta : aiMessage.content + delta;

        setMessages((prev) => {
          const prevMessages = prev.filter((m) => m.id !== aiMessage.id);
          return [...prevMessages, aiMessage];
        });
      }

      // 移除最后的光标符号
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMessage.id
            ? { ...m, content: m.content.replace(/▌$/, "") }
            : m
        )
      );
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
      setIsLoading(false); // 确保最终状态重置
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 消息容器 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start ${
              message.isAI ? "justify-start" : "justify-end"
            }`}
          >
            {/* AI消息结构 */}
            {message.isAI ? (
              <div className="flex items-start gap-3 max-w-2xl w-full">
                {/* AI图标（消息框左侧） */}
                <div className="flex-shrink-0 w-12 h-12 mt-2">
                  <Image
                    src="/StreamAI.png"
                    alt="StreamAI"
                    width={32}
                    height={32}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                {/* 消息气泡 */}
                <div className="flex-1 p-4 rounded-lg bg-white shadow-sm border border-gray-200">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            ) : (
              /* 用户消息结构 */
              <div className="flex items-start gap-3 max-w-2xl w-full justify-end">
                {/* 消息气泡 */}
                <div className="flex-1 p-4 rounded-lg bg-blue-600 text-white">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                </div>
                {/* 用户图标（消息框右侧） */}
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

        {/* 加载状态指示器 */}
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
            <div className="flex-1 p-4 rounded-lg bg-white shadow-sm border border-gray-200">
              <div className="flex gap-2">
                {/* 可简化为单个光标动画 */}
                <div className="h-7 w-1 bg-gray-400 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* 固定输入区域（保持原样） */}
        <div ref={messagesEndRef} />
        <div className="backdrop-blur-sm fixed bottom-0 ml-50 left-0 right-0 border-t border-gray-200">
          <div className="max-w-4xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入你的问题..."
                  className="text-base bg-white resize-none p-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  min-h-14 max-h-14 overflow-y-auto w-full"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-14 w-24 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  发送
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
