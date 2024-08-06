import React from "react";
import { Button } from "../components/ui/button";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
	input: string;
	setInput: (value: string) => void;
	handleSend: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
	input,
	setInput,
	handleSend,
}) => {
	return (
		<motion.div
			className="max-w-2xl mx-auto w-full px-4 py-4"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="flex items-center space-x-2 bg-white dark:bg-[#241242] rounded-full p-2 shadow-md">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type your message..."
					className="flex-1 p-2 bg-transparent border-none focus:outline-none focus:ring-0 dark:text-gray-200 dark:placeholder-gray-400 text-sm"
					onKeyPress={(e) => e.key === "Enter" && handleSend()}
				/>
				<Button
					onClick={handleSend}
					className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-2 rounded-full transition-colors duration-150"
					aria-label="Send message"
				>
					<Send className="h-4 w-4" />
				</Button>
			</div>
		</motion.div>
	);
};

export default ChatInput;
