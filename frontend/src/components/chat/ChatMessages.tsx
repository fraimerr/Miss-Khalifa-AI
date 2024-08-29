import React, { useState, useEffect } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import Message from './Message'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Lightbulb } from 'lucide-react'

interface ChatMessagesProps {
  messages: { text: string; isBot: boolean; isLoading?: boolean }[]
  copiedIndex: number | null
  handleTextToSpeech: (text: string) => void
  handleCopyText: (text: string, index: number) => void
  bottomRef: React.RefObject<HTMLDivElement>
  isThinking: boolean
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  copiedIndex,
  handleTextToSpeech,
  handleCopyText,
  bottomRef,
  isThinking,
}) => {
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

  return (
    <ScrollArea className="relative flex-1 p-4 bg-white dark:bg-[#0f0721]">
      <AnimatePresence mode="wait">
        {messages.length === 0 ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-full max-w-2xl text-center">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 text-3xl font-semibold text-gray-800 dark:text-white"
              >
                Welcome to Miss Khalifa AI
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8 text-lg text-gray-600 dark:text-gray-300"
              >
                How can I assist you with sexual health information today?
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-6 bg-white dark:bg-[#2d1854] rounded-lg shadow-md"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Lightbulb className="text-pink-500" />
                  <h3 className="text-xl font-medium text-gray-800 dark:text-white">Tip</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{currentTip}</p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="messages"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
            className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col justify-end space-y-4"
          >
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Message
                  message={message}
                  index={index}
                  copiedIndex={copiedIndex}
                  handleTextToSpeech={handleTextToSpeech}
                  handleCopyText={handleCopyText}
                />
              </motion.div>
            ))}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Message
                  message={{ text: '', isBot: true, isLoading: true }}
                  index={messages.length}
                  copiedIndex={null}
                  handleTextToSpeech={() => {}}
                  handleCopyText={() => {}}
                />
              </motion.div>
            )}
            <div ref={bottomRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </ScrollArea>
  )
}

export default ChatMessages
