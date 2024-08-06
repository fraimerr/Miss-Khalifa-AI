import React from "react";
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
			className="w-full max-w-4xl mx-auto px-4"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="relative">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type your message..."
					className="w-full px-6 py-4 bg-white dark:bg-[#241242] text-gray-900 dark:text-gray-100 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-purple-500 transition-all duration-300 text-base"
					onKeyPress={(e) => e.key === "Enter" && handleSend()}
				/>
				<button
					onClick={handleSend}
					className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-purple-500"
					aria-label="Send message"
				>
					<Send className="h-5 w-5" />
				</button>
			</div>
		</motion.div>
	);
};

export default ChatInput;
