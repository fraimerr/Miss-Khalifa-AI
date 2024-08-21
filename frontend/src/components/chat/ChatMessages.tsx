import React, { useState, useEffect } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import Message from './Message'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

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
            <div className="w-full text-center max-w-4xl">
              <motion.h2
                variants={itemVariants}
                className="mb-8 text-5xl font-bold"
              >
                👋
                <span style={gradientStyle}>
                  Welcome!
                  <br />
                  How can I assist you today?
                </span>
              </motion.h2>
              <motion.div className="mb-8 flex items-center justify-center p-4">
                <div className="w-full rounded-md border border-purple-500/75 bg-gradient-to-r from-violet-950/40 to-purple-900/10 p-4">
                  <div className="flex space-x-2">
                    <Sparkles strokeWidth={3} />
                    <h3 className="mb-2 text-lg font-semibold">Tip</h3>
                  </div>
                  <div className="">
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
