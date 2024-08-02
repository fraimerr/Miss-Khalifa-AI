// pages/index.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "@/components/Header";
import ChatInput from "@/components/ChatInput";
import ChatMessages from "../components/ChatMessages";

interface Message {
  text: string;
  isBot: boolean;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleTextToSpeech = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSend = async () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { text: input, isBot: false }]);
      setInput("");
      setIsTyping(true);

      try {
        const response = await axios.post("http://localhost:5000/chat", {
          message: input,
        });
        const botReply = response.data.response;

        if (botReply) {
          setMessages((prev) => [...prev, { text: botReply, isBot: true }]);
        } else {
          console.error("Unexpected response format:", response.data);
          setMessages((prev) => [
            ...prev,
            { text: "Unexpected response format from the bot.", isBot: true },
          ]);
        }
      } catch (error: any) {
        console.error(
          "Error fetching bot response:",
          error.response || error.message || error
        );
        setMessages((prev) => [
          ...prev,
          {
            text:
              "Error communicating with the bot.\n\nError message: " +
              (error.message || "Unknown error"),
            isBot: true,
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} font-sans`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1 flex flex-col h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0f0721]">
        <ChatMessages
          messages={messages}
          copiedIndex={copiedIndex}
          handleTextToSpeech={handleTextToSpeech}
          handleCopyText={handleCopyText}
          bottomRef={bottomRef}
        />
        <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
      </main>
    </div>
  );
};

export default ChatInterface;
