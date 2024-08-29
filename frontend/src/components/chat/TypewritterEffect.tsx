import React, { useState, useEffect, useRef } from "react";

const useTypewriter = (text: string, speed: number = 20) => {
  const [displayedText, setDisplayedText] = useState("");
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
    setDisplayedText("");
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < textRef.current.length) {
        setDisplayedText((prev) => textRef.current.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed]);

  return displayedText;
};

const TypewriterEffect: React.FC<{ text: string }> = ({ text }) => {
  const displayedText = useTypewriter(text);
  return <>{displayedText}</>;
};

export default TypewriterEffect;
