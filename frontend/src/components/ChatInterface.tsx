"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "@/components/Header";
import ChatInput from "@/components/ChatInput";
import ChatMessages from "../components/ChatMessages";
import { motion, useAnimation } from "framer-motion";

interface TipDisplayProps {
  tip: string;
}

const TipDisplay: React.FC<TipDisplayProps> = ({ tip }) => (
  <motion.div
    className="bg-blue-100 dark:bg-blue-900 p-2 text-center text-sm font-medium text-blue-800 dark:text-blue-200 rounded-b-md"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    Tip: {tip}
  </motion.div>
);

interface Message {
  text: string;
  isBot: boolean;
  image?: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [currentTip, setCurrentTip] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarControls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX <= 20 && !isSidebarOpen) {
        setIsSidebarOpen(true);
        sidebarControls.start({ x: 0 });
      } else if (e.clientX > 250 && isSidebarOpen) {
        setIsSidebarOpen(false);
        sidebarControls.start({ x: -250 });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [sidebarControls, isSidebarOpen]);

  useEffect(() => {
    fetch('/tips.json')
      .then(response => response.json())
      .then(data => {
        const randomTip = data.tips[Math.floor(Math.random() * data.tips.length)];
        setCurrentTip(randomTip);
      })
      .catch(error => {
        console.error('Error loading tips:', error);
        setCurrentTip("Did you know? Regular check-ups are important for your health.");
      });
  }, []);

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
      setIsThinking(true);
      try {
        const response = await axios.post("http://localhost:5001/chat", {
          message: input,
        });
        const botReply = response.data.response;
        if (botReply) {
          setMessages((prev) => [
            ...prev,
            {
              text: botReply,
              isBot: true,
              image: response.data.image
            },
          ]);
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
        setIsThinking(false);
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
    <div className={`h-screen overflow-hidden ${darkMode ? "dark" : ""}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <TipDisplay tip={currentTip} />
      <div className="flex">
        <motion.div
          className="w-64 h-[calc(100vh-96px)] bg-gray-200 dark:bg-gray-800 fixed top-24 left-0 z-10 shadow-lg"
          initial={{ x: -250 }}
          animate={sidebarControls}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex flex-col items-center mt-8 space-y-4">
            <img src="/miss_khalifa_ai.png" alt="Logo" className="w-32 h-32 object-contain rounded-full shadow-md" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Miss Khalifa AI</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center px-4">Your friendly AI assistant for sexual health information</p>
          </div>
        </motion.div>
        <main className={`flex-1 flex flex-col h-[calc(100vh-96px)] bg-gray-50 dark:bg-[#0f0721] transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
          <ChatMessages
            messages={messages}
            copiedIndex={copiedIndex}
            handleTextToSpeech={handleTextToSpeech}
            handleCopyText={handleCopyText}
            bottomRef={bottomRef}
          />
          {isThinking && (
            <motion.div
              className="flex justify-center items-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-3 h-3 bg-blue-500 rounded-full mr-1"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop" }}
              />
              <motion.div
                className="w-3 h-3 bg-blue-500 rounded-full mr-1"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop", delay: 0.1 }}
              />
              <motion.div
                className="w-3 h-3 bg-blue-500 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
              />
            </motion.div>
          )}
          <div className="pb-6 pt-4 bg-gray-100 dark:bg-[#1a0e33]">
            <ChatInput
              input={input}
              setInput={setInput}
              handleSend={handleSend}
            />
            <motion.p
              className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-3 px-4 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Disclaimer: This sexual health chatbot provides general information
              for educational purposes only.
            </motion.p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatInterface;