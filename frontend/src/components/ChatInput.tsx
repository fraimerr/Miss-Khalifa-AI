import React from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, handleSend }) => {
  return (
    <div className="max-w-2xl mx-auto w-full px-4 pb-4">
      <div className="flex space-x-2 bg-white dark:bg-[#241242] rounded-full p-1 shadow-md">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-transparent border-none focus:ring-transparent dark:text-gray-200 dark:placeholder-gray-400 text-sm"
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button
          onClick={handleSend}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-3 py-1 rounded-full transition-colors duration-150"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
