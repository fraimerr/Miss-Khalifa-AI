'use client'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ChatMessages from '@/components/chat/ChatMessages'
import { motion } from 'framer-motion'
import {
  Send,
  Calendar,
  Shield,
  Stethoscope,
  Users,
} from 'lucide-react'
import { useToast } from '../ui/use-toast'
import { Button } from '../ui/button'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'

interface Message {
  text: string
  isBot: boolean
  chart?: {
    type: 'chart' | 'table'
    data: { year: string; value: number }[]
    title: string
  }
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [sessionId, setSessionId] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const storedSessionId = localStorage.getItem('chatSessionId')
    if (storedSessionId) {
      setSessionId(storedSessionId)
    }
  }, [])

  const handleTextToSpeech = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleTip = (text: string) => {
    setInput(text)
    setIsThinking(false)
  }

  const handleSend = async () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { text: input, isBot: false }])
      setInput('')
      setIsThinking(true)
      try {
        const response = await axios.post(
          'http://localhost:5000/api/v1/chat',
          {
            message: input,
            session_id: sessionId,
          }
        )

        console.log('Received response from backend:', response.data)

        if (response.data.session_id) {
          setSessionId(response.data.session_id)
          localStorage.setItem('chatSessionId', response.data.session_id)
        }

        if (response.data.chart) {
          setMessages((prev) => [
            ...prev,
            {
              text: response.data.response,
              isBot: true,
              chart: response.data.chart,
            },
          ])
        } else {
          setMessages((prev) => [
            ...prev,
            {
              text: response.data.response,
              isBot: true,
            },
          ])
        }
      } catch (error: any) {
        console.error('Error fetching bot response:', error)
        toast({
          description:
            'Error fetching bot response: ' +
            (error.response?.data || error.message || error),
          variant: 'destructive',
        })
      } finally {
        setIsThinking(false)
      }
    }
  }

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const tips = [
    {
      text: 'What are common STI symptoms?',
      icon: Stethoscope,
      gradient: 'from-red-400 to-pink-500',
    },
    {
      text: 'How often should I get tested?',
      icon: Calendar,
      gradient: 'from-green-400 to-blue-500',
    },
    {
      text: 'How can I practice safe sex?',
      icon: Shield,
      gradient: 'from-yellow-400 to-orange-500',
    },
    {
      text: 'How do I discuss STIs with a partner?',
      icon: Users,
      gradient: 'from-pink-300 to-purple-400',
    },
  ]

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length)
    }, 10000)

    return () => clearInterval(tipInterval)
  }, [tips.length])

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="flex h-full flex-1 flex-col bg-gray-50 transition-all duration-300 ease-in-out dark:bg-[#0f0721]">
          <ChatMessages
            messages={messages}
            copiedIndex={copiedIndex}
            handleTextToSpeech={handleTextToSpeech}
            handleCopyText={handleCopyText}
            bottomRef={bottomRef}
          />
          {isThinking && (
            <motion.div
              className="flex items-center justify-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="mr-1 h-3 w-3 rounded-full bg-blue-500"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              />
              <motion.div
                className="mr-1 h-3 w-3 rounded-full bg-blue-500"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                  delay: 0.1,
                }}
              />
              <motion.div
                className="h-3 w-3 rounded-full bg-blue-500"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                  delay: 0.2,
                }}
              />
            </motion.div>
          )}
          <div className="relative pb-6">
            <motion.div
              className="mx-auto w-full max-w-4xl px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ScrollArea className="border-lg w-full whitespace-nowrap">
                <div className="mb-2 flex space-x-2">
                  {tips.map((tip, index) => (
                    <Button
                      key={index}
                      onClick={() => handleTip(tip.text)}
                      className={`relative rounded-xl bg-gradient-to-r ${tip.gradient} p-[1px] text-white transition-all duration-300`}
                    >
                      <span className="m-[1px] block rounded-xl bg-[#0f0721] px-3 py-2 transition-all duration-300 hover:bg-transparent">
                        {tip.text}
                      </span>
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="h-0" />
              </ScrollArea>

              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Chat with Miss Khalifa..."
                  className="w-full rounded-full bg-white px-6 py-4 text-base text-gray-900 shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-[#241242] dark:text-gray-100 dark:focus:ring-purple-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-3 text-white transition-all duration-300 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-purple-500"
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ChatInterface
