import React, { useState, useEffect } from "react";

const useTypewriter = (text: string, speed: number = 10) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [text, currentIndex, speed]);

  return displayedText;
};

const TypewriterEffect: React.FC<{ text: string }> = ({ text }) => {
  const displayedText = useTypewriter(text);
  return <>{displayedText}</>;
};

export default TypewriterEffect;
