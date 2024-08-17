"use client";

import React, { useState, useEffect } from "react";
import {
	ArrowRight,
	Moon,
	Sun,
	Menu,
	Heart,
	Shield,
	Book,
	User,
	MessageCircle,
	Lock,
	Github,
	Linkedin,
	Twitter,
	PersonStanding,
	CheckCircle,
	RefreshCw,
	Search,
	Building,
	Users,
	Target
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Logo from "../../public/miss_khalifa_ai.png";


const HomePage = () => {
	const [darkMode, setDarkMode] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const prefersDarkMode = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		setDarkMode(prefersDarkMode);
	}, []);

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [darkMode]);

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	const fadeIn = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 0.5 } },
	};

	if (!mounted) return null;

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={darkMode ? "dark" : "light"}
				initial="hidden"
				animate="visible"
				exit="hidden"
				variants={fadeIn}
				className={`min-h-screen ${
					darkMode ? "bg-[#0f0721]" : "bg-gray-50"
				} text-neutral-100 flex flex-col justify-between font-sans transition-all duration-500`}
			>
				<header
					className={`fixed w-full z-50 p-4 ${
						darkMode
							? "bg-gradient-to-r from-[#190933] to-[#2d1854] bg-opacity-80 backdrop-blur-md"
							: "bg-gradient-to-r from-white to-purple-50 bg-opacity-80 backdrop-blur-md"
					} shadow-lg`}
				>
					<div className="max-w-7xl mx-auto flex justify-between items-center">
						<div className="flex items-center space-x-2">
							<Image
								src={Logo} // Replace with the path to your logo image
								alt="Miss Khalifa AI Logo"
								width={40}
								height={40}
								className="rounded-full"
							/>
							<motion.h1
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600"
							>
								Miss Khalifa AI
							</motion.h1>
						</div>
						<nav className="hidden md:flex items-center space-x-6">
							<ul className="flex space-x-6 text-base">
								{["Features", "Team", "Contact"].map((item) => (
									<motion.li key={item} whileHover={{ scale: 1.1 }}>
										<Link
											href={`#${item.toLowerCase()}`}
											className={`${
												darkMode
													? "text-gray-200 hover:text-pink-400"
													: "text-gray-800 hover:text-purple-600"
											} font-medium`}
										>
											{item}
										</Link>
									</motion.li>
								))}
							</ul>
							<motion.button
								whileTap={{ scale: 0.95 }}
								onClick={() => setDarkMode(!darkMode)}
								className={`p-2 rounded-full ${
									darkMode ? "bg-purple-800" : "bg-purple-100"
								}`}
							>
								{darkMode ? (
									<Sun className="text-yellow-400 h-5 w-5" />
								) : (
									<Moon className="text-purple-600 h-5 w-5" />
								)}
							</motion.button>
						</nav>
						<button
							className={`md:hidden ${
								darkMode ? "text-white" : "text-gray-800"
							}`}
							onClick={toggleMobileMenu}
						>
							<Menu className="h-6 w-6" />
						</button>
					</div>
				</header>

				<AnimatePresence>
					{mobileMenuOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className={`md:hidden fixed top-16 left-0 right-0 z-40 ${
								darkMode ? "bg-[#190933]" : "bg-white"
							} shadow-lg`}
						>
							<nav className="flex flex-col items-center py-6 space-y-4">
								{["Features", "Team", "Contact"].map((item) => (
									<Link
										key={item}
										href={`#${item.toLowerCase()}`}
										className={`${
											darkMode
												? "text-gray-200 hover:text-pink-400"
												: "text-gray-800 hover:text-purple-600"
										} text-lg font-medium`}
										onClick={() => setMobileMenuOpen(false)}
									>
										{item}
									</Link>
								))}
							</nav>
						</motion.div>
					)}
				</AnimatePresence>

				<main className="flex-grow flex items-center p-6 md:p-12 mt-16">
					<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5 }}
							className="text-left"
						>
							<h2 className="text-5xl md:text-6xl font-bold mb-6">
								<span className="text-purple-300">Your personal</span>{" "}
								<span className="text-pink-400">
									Sex Health Assistant Chatbot
								</span>
							</h2>
							<p
								className={`text-xl mb-8 ${
									darkMode ? "text-gray-300" : "text-gray-700"
								}`}
							>
								Meet your go-to buddy for all things sexual health.
							</p>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Link href="/chat" passHref>
									<motion.button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-full text-xl transition duration-300 ease-in-out hover:from-pink-600 hover:to-purple-700 hover:shadow-lg">
										Start Chatting Now
										<ArrowRight className="ml-2 h-6 w-6 inline" />
									</motion.button>
								</Link>
							</motion.div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5 }}
							className="relative"
						>
							{/* <div className="bg-gradient-to-br from-pink-400 to-purple-600 rounded-2xl h-80 md:h-full w-full opacity-20"></div> */}
							<div className="absolute inset-0 flex items-center justify-center">
								{/* <svg
									className="w-3/4 h-3/4"
									viewBox="0 0 200 200"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill={darkMode ? "#6B46C1" : "#9F7AEA"}
										d="M45.7,-78.3C58.9,-71.1,69.2,-58.3,76.4,-44.1C83.6,-29.9,87.8,-14.9,87.8,0C87.8,14.9,83.7,29.8,76.4,43.8C69.2,57.8,58.9,71,45.6,78.5C32.3,86,16.2,87.9,0.1,87.7C-15.9,87.5,-31.8,85.3,-45.7,77.8C-59.6,70.3,-71.5,57.5,-78.6,43C-85.7,28.5,-88,14.3,-87.4,0.3C-86.9,-13.6,-83.5,-27.2,-76.4,-39.7C-69.2,-52.2,-58.3,-63.6,-45.3,-70.9C-32.2,-78.3,-16.1,-81.6,0.3,-82.1C16.7,-82.6,33.5,-80.3,45.7,-78.3Z"
										transform="translate(100 100)"
									/>
								</svg> */}
								<Image
									src={Logo}
									width={400}
									height={400}
									alt="Miss Khalifa AI"
								/>
								{/* <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">
									AI
								</div> */}
							</div>
						</motion.div>
					</div>
				</main>

				<section
				id="company"
				className={`py-20 bg-gradient-to-b ${
					darkMode 
					? "from-[#0f0721] to-[#73214c]" 
					: "from-gray-50 to-pink-200"
				}`}
				>
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="max-w-6xl mx-auto text-center px-4"
				>
					<h2 className="text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
					Discover Our Reason {"Why?"}
					</h2>
					<h2 className="text-3xl font-bold italic mb-12 text-transparent bg-clip-text bg-gradient-to-b from-pink-300 to-purple-300">
					For Teens, By Teens
					</h2>
					<p className={`text-xl mb-10 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
					We are a team of teens who often felt embarrassed discussing sex with adults, relying on Google as our only source of information. Recognizing the gaps and discomfort in our own experiences, we decided to create a better solution—a chatbot dedicated to sex education. Our goal is to provide the teens of tomorrow with a safe, reliable, and discreet way to access essential knowledge. By building this chatbot, we aim to break down barriers of awkwardness and misinformation, empowering our peers to make informed decisions about their sexual health and relationships. 
					</p>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
					{[
						{
						icon: <Building size={56} />,
						title: "Our Mission",
						description: "To provide teens with a safe, accessible, and non-judgmental platform for learning about sexual health and relationships."
						},
						{
						icon: <Users size={56} />,
						title: "Our Team",
						description: "Idiots with a goal."
						},
						{
						icon: <Target size={56} />,
						title: "Our Vision",
						description: "A world where every teenager has the confidence and knowledge to make informed decisions about their sexual health, free from stigma or shame."
						}
					].map((feature, index) => (
						<motion.div
						key={index}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: index * 0.15 }}
						className={`flex flex-col items-center p-8 rounded-2xl ${
							darkMode 
							? "bg-[#502c4f] bg-opacity-50" 
							: "bg-white bg-opacity-60"
						} backdrop-blur-sm shadow-lg`}
						>
						<motion.div
							whileHover={{ scale: 1.1, rotate: 5 }}
							className={`mb-6 ${darkMode ? "text-pink-600" : "text-blue-500"}`}
						>
							{feature.icon}
						</motion.div>
						<h3
							className={`text-2xl font-bold mb-4 ${
							darkMode ? "text-white" : "text-gray-800"
							}`}
						>
							{feature.title}
						</h3>
						<p
							className={`text-base text-center ${
							darkMode ? "text-gray-300" : "text-gray-600"
							}`}
						>
							{feature.description}
						</p>
						</motion.div>
					))}
					</div>
				</motion.div>
				</section>

				<section
				className={`h-32 bg-gradient-to-b ${
					darkMode 
					? "from-[#73214c] to-[#241242]" 
					: "from-pink-200 to-purple-50"
				}`}
				aria-hidden="true"
				>
				{/* This section intentionally left empty for visual transition */}
				</section>
				
				<section
				id="features"
				className={`${darkMode ? "bg-[#241242]" : "bg-purple-50"} py-16`}
				>
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="max-w-7xl mx-auto text-left px-6"
				>
					<h3 className="text-4xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
					Teen-Friendly Experience
					</h3>
					<p className="text-xl mb-12 text-gray-600 dark:text-gray-300">
					Our platform offers an avenue to empower teens with the knowledge and confidence to make informed and benefitical decisions related to sexual health. No judgment, just support.
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<motion.div
						whileHover={{ scale: 1.05 }}
						className={`p-6 rounded-xl ${
						darkMode ? "bg-[#2d1854] text-gray-200" : "bg-white text-gray-800"
						} shadow-lg`}
					>
						<h4 className="text-2xl font-bold mb-4 text-pink-500">Features</h4>
						<ul className="space-y-2">
						{[
							"Get answers to sensitive questions",
							"Learn about safe practices",
							"Explore relationships and emotions",
							"Understand your body better",
						].map((item, index) => (
							<motion.li
							key={index}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.1 }}
							className="flex items-center"
							>
							<CheckCircle className="h-5 w-5 text-green-500 mr-2" />
							<span>{item}</span>
							</motion.li>
						))}
						</ul>
						<motion.div
						whileHover={{ scale: 1.1 }}
						className="mt-6"
						>
						<Link href="/evm-docs" className="text-pink-500 hover:text-pink-600 font-medium">
							Learn more <ArrowRight className="inline-block ml-1" />
						</Link>
						</motion.div>
					</motion.div>
					
					<motion.div
						whileHover={{ scale: 1.05 }}
						className={`p-6 rounded-xl ${
						darkMode ? "bg-[#2d1854] text-gray-200" : "bg-white text-gray-800"
						} shadow-lg`}
					>
						<h4 className="text-2xl font-bold mb-4 text-purple-500">Assurances</h4>
						<ul className="space-y-2">
						{[
							"Access reliable health information",
							"Chat safely and anonymously",
							"Receive Sexual Health Tips Regularly",
							"Access Multilingual Support"
						].map((item, index) => (
							<motion.li
							key={index}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.1 }}
							className="flex items-center"
							>
							<CheckCircle className="h-5 w-5 text-green-500 mr-2" />
							<span>{item}</span>
							</motion.li>
						))}
						</ul>
						<motion.div
						whileHover={{ scale: 1.1 }}
						className="mt-6"
						>
						<Link href="/cadence-docs" className="text-purple-500 hover:text-purple-600 font-medium">
							Learn more <ArrowRight className="inline-block ml-1" />
						</Link>
						</motion.div>
					</motion.div>
					</div>
				</motion.div>
				</section>

				<section
      id="glossary"
      className={`${darkMode ? "bg-[#0f0721]" : "bg-white"} py-20`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto text-left px-6"
      >
        <h3 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
          Explore Our Tailored Glossary
        </h3>
        <p className={`text-lg mb-12 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Dive into our comprehensive glossary of Sexual Education terms, created to support teens at all stages.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <Book size={48} />,
              title: "Extensive Definitions",
              description: "Clear, concise explanations of key Sex ED concepts."
            },
            {
              icon: <Search size={48} />,
              title: "Easy Navigation",
              description: "Quickly find the terms you need with our user-friendly search and filter options."
            },
            {
              icon: <RefreshCw size={48} />,
              title: "Regular Updates",
              description: "Stay current with the latest health terms through our commitment to frequent updates."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex flex-col items-center p-6 rounded-xl ${
                darkMode ? "bg-[#190933]" : "bg-purple-50"
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`mb-4 ${darkMode ? "text-purple-400" : "text-purple-600"}`}
              >
                {feature.icon}
              </motion.div>
              <h4
                className={`text-xl font-bold mb-2 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {feature.title}
              </h4>
              <p
                className={`text-sm text-center ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/Glossary" passHref>
              <motion.button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-full text-xl transition duration-300 ease-in-out hover:from-pink-600 hover:to-purple-700 hover:shadow-lg flex items-center">
                Explore
                <ArrowRight className="ml-2 h-6 w-6" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>

				<section
                    id="team"
                    className={`${darkMode ? "bg-[#241242]" : "bg-purple-50"} py-16`}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-7xl mx-auto text-left px-6"
                    >
                        <h3 className="text-4xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                            Meet Our Team
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Fraimer De La Cruz",
                                    role: "Team Leader, Code Whisperer, UI Designer, Presenter",
                                    image: "",
                                },
                                {
                                    name: "Osei Francis",
                                    role: "Code Whisperer",
                                    image: "",
                                },
                                {
                                    name: "Israel Seaton",
                                    role: "Code Whisperer",
                                    image: "",
                                },
                                {
                                    name: "Mahish Dora",
                                    role: "Researcher, UI Designer, Presenter, Bot Persona Developer",
                                    image: "",
                                },
                                {
                                    name: "Keshawn Jones",
                                    role: "Researcher, Data Manager",
                                    image: "",
                                },
                                {
                                    name: "Ziara Rogers",
                                    role: "UI Designer, Bot Persona Developer",
                                    image: "",
                                },
                                {
                                    name: "Christopher France",
                                    role: "Data Manager",
                                    image: "",
                                },
								{
                                    name: "Adebona Josiah",
                                    role: "Data Manager",
                                    image: "",
                                },
                            ].map((member, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className={`flex flex-col items-center p-6 rounded-xl ${
                                        darkMode ? "bg-[#2d1854] text-gray-200" : "bg-white text-gray-800"
                                    }`}
                                >
                                    {member.image ? (
                                        <Image
                                            src={member?.image}
                                            alt={member.name}
                                            className="w-32 h-32 rounded-full mb-4"
                                            width={32}
                                            height={32}
                                        />
                                    ) : (
                                        <PersonStanding className="w-32 h-32 rounded-full mb-4" />
                                    )}
                                    <h4
                                        className={`text-xl font-bold ${
                                            darkMode ? "text-white" : "text-gray-800"
                                        }`}
                                    >
                                        {member.name}
                                    </h4>
                                    <p
                                        className={`text-sm ${
                                            darkMode ? "text-gray-300" : "text-gray-600"
                                        }`}
                                    >
                                        {member.role}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

				<footer
					id="contact"
					className={`${
						darkMode ? "bg-[#190933] border-t border-purple-800" : "bg-gray-800"
					} text-white py-12`}
				>
					<div className="max-w-7xl mx-auto text-center px-6">
						<p className="text-2xl font-bold mb-6">
							© 2024 Miss Khalifa AI. All rights reserved.
						</p>
						<p className="text-xl mb-8">
							Got questions? Hit us up at:{" "}
							<a
								href="mailto:support@misskhalifa.ai"
								className="underline hover:text-pink-300 transition duration-300"
							>
								support@misskhalifa.ai
							</a>
						</p>
						<div className="flex justify-center space-x-6">
							{[
								{ icon: <Github />, link: "https://github.com/misskhalifaai" },
								{
									icon: <Linkedin />,
									link: "https://linkedin.com/company/misskhalifaai",
								},
								{
									icon: <Twitter />,
									link: "https://twitter.com/misskhalifaai",
								},
							].map((social, index) => (
								<motion.a
									key={index}
									href={social.link}
									target="_blank"
									rel="noopener noreferrer"
									whileHover={{ scale: 1.2 }}
									className="text-gray-400 hover:text-white transition-colors duration-300"
								>
									{social.icon}
								</motion.a>
							))}
						</div>
					</div>
				</footer>
			</motion.div>
		</AnimatePresence>
	);
};

export default HomePage;
