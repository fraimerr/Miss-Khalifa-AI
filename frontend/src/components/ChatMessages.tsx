// components/ChatMessages.tsx
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import Message from "./Message";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion"

interface ChatMessagesProps {
  messages: { text: string; isBot: boolean }[];
  copiedIndex: number | null;
  handleTextToSpeech: (text: string) => void;
  handleCopyText: (text: string, index: number) => void;
  bottomRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  copiedIndex,
  handleTextToSpeech,
  handleCopyText,
  bottomRef,
}) => {
  return (
    <ScrollArea className="flex-1 p-4 relative">
      {messages.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Try asking about current events!", "I can help with coding questions.", "Feel free to ask for explanations on complex topics.", "Need creative writing ideas? Just ask!", "Curious about science? Let's explore together!", "Sex is good for your health."].map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border border-purple-200 dark:border-purple-800 p-4 rounded-lg bg-white dark:bg-[#241242] shadow-sm"
                >
                  <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
                    <HelpCircle className="h-4 w-4 text-pink-500" />
                    <p className="text-sm">{tip}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4 min-h-[calc(100vh-8rem)] flex flex-col justify-end">
          {messages.map((message, index) => (
            <Message
              key={index}
              message={message}
              index={index}
              copiedIndex={copiedIndex}
              handleTextToSpeech={handleTextToSpeech}
              handleCopyText={handleCopyText}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </ScrollArea>
  );
};

export default ChatMessages;
