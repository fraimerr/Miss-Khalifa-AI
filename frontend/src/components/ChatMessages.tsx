import React, { useState, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import Message from "./Message";
import { HelpCircle, Zap, Code, Book, Heart, Calendar, Info, Pill, Shield, Stethoscope, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
	const tips = [
		{
			text: "What are common STI symptoms?",
			icon: Stethoscope,
			gradient: "from-red-400 to-pink-500",
		},
		{
			text: "How often should I get tested?",
			icon: Calendar,
			gradient: "from-green-400 to-blue-500",
		},
		{
			text: "How can I practice safe sex?",
			icon: Shield,
			gradient: "from-yellow-400 to-orange-500",
		},
		{
			text: "How do I discuss STIs with a partner?",
			icon: Users,
			gradient: "from-blue-400 to-teal-500",
		}
	];

	const [currentTipIndex, setCurrentTipIndex] = useState(0);
	const [gradientPosition, setGradientPosition] = useState(100);
	const [textColor, setTextColor] = useState("transparent");

	useEffect(() => {
		const tipInterval = setInterval(() => {
			setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
		}, 10000);

		return () => clearInterval(tipInterval);
	}, [tips.length]);

	useEffect(() => {
		if (messages.length === 0) {
			const animationInterval = setInterval(() => {
				setGradientPosition((prev) => {
					if (prev <= 0) {
						clearInterval(animationInterval);
						setTimeout(() => setTextColor("currentColor"), 300);
						return 0;
					}
					return prev - 2;
				});
			}, 20);

			return () => clearInterval(animationInterval);
		}
	}, [messages.length]);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				when: "beforeChildren",
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
		},
	};

	const gradientStyle = {
		backgroundImage:
			"linear-gradient(90deg, #ec4899, #8b5cf6, #ec4899, currentColor)",
		backgroundSize: "300% 100%",
		backgroundPosition: `${gradientPosition}% 0`,
		color: textColor,
		WebkitBackgroundClip: "text",
		backgroundClip: "text",
		transition: "color 0.5s ease",
	};

	return (
		<ScrollArea className="flex-1 p-4 relative over">
			<AnimatePresence mode="wait">
				{messages.length === 0 ? (
					<motion.div
						key="welcome"
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={containerVariants}
						className="absolute inset-0 flex items-center justify-center"
					>
						<div className="max-w-4xl w-full">
							<motion.h2
								variants={itemVariants}
								className="text-5xl font-bold text-center mb-8"
							>
								<span style={gradientStyle}>
									Welcome! How can I assist you today?
								</span>
							</motion.h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								{tips.map((tip, index) => (
									<motion.div
										key={index}
										variants={itemVariants}
										className={`bg-gradient-to-br ${tip.gradient} p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group`}
									>
										<div className="flex items-center space-x-4">
											<div className="bg-white bg-opacity-20 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
												<tip.icon className="h-8 w-8 text-white" />
											</div>
											<p className="text-lg font-semibold text-white group-hover:scale-105 transition-transform duration-300">
												{tip.text}
											</p>
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</motion.div>
				) : (
					<motion.div
						key="messages"
						initial="hidden"
						animate="visible"
						variants={containerVariants}
						className="max-w-3xl mx-auto space-y-6 min-h-[calc(100vh-8rem)] flex flex-col justify-end"
					>
						{messages.map((message, index) => (
							<motion.div key={index} variants={itemVariants}>
								<Message
									message={message}
									index={index}
									copiedIndex={copiedIndex}
									handleTextToSpeech={handleTextToSpeech}
									handleCopyText={handleCopyText}
								/>
							</motion.div>
						))}
						<div ref={bottomRef} />
					</motion.div>
				)}
			</AnimatePresence>
		</ScrollArea>
	);
};

export default ChatMessages;
