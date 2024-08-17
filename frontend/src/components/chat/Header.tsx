import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/miss_khalifa_ai.png";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
  return (
    <header className={`p-4 ${darkMode ? "bg-[#190933]" : "bg-white"} shadow-md`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={Logo} // Replace with the path to your logo image
            alt="Miss Khalifa AI Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
            Miss Khalifa AI
          </h1>
        </Link>
        <div className="flex items-center space-x-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? "bg-purple-800" : "bg-purple-100"}`}
          >
            {darkMode ? (
              <Sun className="text-yellow-400 h-5 w-5" />
            ) : (
              <Moon className="text-purple-600 h-5 w-5" />
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;