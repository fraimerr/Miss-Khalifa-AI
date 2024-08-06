import React from "react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Volume2, Clipboard, Check, Bot, User } from "lucide-react";
import TypewriterEffect from "./TypewritterEffect";
import { motion } from "framer-motion";

interface MessageProps {
	message: { text: string; isBot: boolean };
	index: number;
	copiedIndex: number | null;
	handleTextToSpeech: (text: string) => void;
	handleCopyText: (text: string, index: number) => void;
}

const Message: React.FC<MessageProps> = ({
	message,
	index,
	copiedIndex,
	handleTextToSpeech,
	handleCopyText,
}) => {
	const messageVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<motion.div
			className={`flex ${message.isBot ? "justify-start" : "justify-end"} mb-4`}
			variants={messageVariants}
			initial="hidden"
			animate="visible"
			transition={{ duration: 0.3, delay: index * 0.1 }}
		>
			{message.isBot ? (
				<div className="flex items-start space-x-3 max-w-2xl">
					<Avatar className="bg-gradient-to-r from-pink-500 to-purple-600 h-10 w-10 shadow-md">
						<AvatarFallback className="flex items-center justify-center text-white">
							<Bot className="h-5 w-5" />
						</AvatarFallback>
					</Avatar>
					<div className="bg-white dark:bg-[#241242] text-gray-800 dark:text-gray-200 px-4 py-3 rounded-xl shadow-md">
						<TypewriterEffect text={message.text} />
						<div className="flex mt-2 space-x-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleTextToSpeech(message.text)}
								className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 p-1 rounded-full transition-colors duration-200"
							>
								<Volume2 className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleCopyText(message.text, index)}
								className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 p-1 rounded-full transition-colors duration-200"
							>
								{copiedIndex === index ? (
									<Check className="h-4 w-4 text-green-500" />
								) : (
									<Clipboard className="h-4 w-4" />
								)}
							</Button>
						</div>
					</div>
				</div>
			) : (
				<div className="flex items-start space-x-3 max-w-2xl flex-row-reverse">
					<Avatar className="bg-gradient-to-r from-pink-400 to-purple-500 h-10 w-10 shadow-md">
						<AvatarFallback className="flex items-center justify-center text-white">
							<User className="h-5 w-5" />
						</AvatarFallback>
					</Avatar>
					<div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-3 rounded-xl shadow-md">
						<p className="text-base leading-relaxed">{message.text}</p>
					</div>
				</div>
			)}
		</motion.div>
	);
};

export default Message;
