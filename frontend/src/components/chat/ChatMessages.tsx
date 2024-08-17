import React, { useState, useEffect } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import Message from './Message'
import {
  HelpCircle,
  Zap,
  Code,
  Book,
  Heart,
  Calendar,
  Info,
  Pill,
  Shield,
  Stethoscope,
  Users,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatMessagesProps {
  messages: { text: string; isBot: boolean }[]
  copiedIndex: number | null
  handleTextToSpeech: (text: string) => void
  handleCopyText: (text: string, index: number) => void
  bottomRef: React.RefObject<HTMLDivElement>
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  copiedIndex,
  handleTextToSpeech,
  handleCopyText,
  bottomRef,
}) => {
  const [gradientPosition, setGradientPosition] = useState(100)
  const [textColor, setTextColor] = useState('transparent')
  const [currentTip, setCurrentTip] = useState('')

  useEffect(() => {
    fetch('/tips.json')
      .then((response) => response.json())
      .then((data) => {
        const randomTip =
          data.tips[Math.floor(Math.random() * data.tips.length)]
        setCurrentTip(randomTip)
      })
      .catch((error) => {
        console.error('Error loading tips:', error)
        setCurrentTip(
          'Did you know? Regular check-ups are important for your health.'
        )
      })
  }, [])

  useEffect(() => {
    if (messages.length === 0) {
      const animationInterval = setInterval(() => {
        setGradientPosition((prev) => {
          if (prev <= 0) {
            clearInterval(animationInterval)
            setTimeout(() => setTextColor('currentColor'), 300)
            return 0
          }
          return prev - 2
        })
      }, 20)

      return () => clearInterval(animationInterval)
    }
  }, [messages.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  const gradientStyle = {
    backgroundImage:
      'linear-gradient(90deg, #ec4899, #8b5cf6, #ec4899, currentColor)',
    backgroundSize: '300% 100%',
    color: textColor,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    transition: 'color 0.5s ease',
  }

  return (
    <ScrollArea className="over relative flex-1 p-4">
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
            <div className="w-full max-w-4xl">
              <motion.h2
                variants={itemVariants}
                className="mb-8 text-center text-5xl font-bold"
              >
								👋
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Hello, Name
                </span>
                <br />
                <span style={gradientStyle}>
                  Welcome! How can I assist you today?
                </span>
              </motion.h2>
              <motion.div className="w-96 items-center">
                <div className="mb-8">
                  <h3 className="mb-2 text-sm font-semibold">Tips</h3>
                  <div className="rounded bg-white/10 p-3">
                    <p className="text-sm">{currentTip}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="messages"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col justify-end space-y-6"
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
  )
}

export default ChatMessages
