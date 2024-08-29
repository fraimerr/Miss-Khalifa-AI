'use client'
import React, { useState, useEffect, useRef } from 'react'
import Message from '@/components/chat/Message'  // Add this import
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
    data: { [key: string]: string | number }[]
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

        // Remove the loading message and add the actual response
        setMessages((prev) => [
          ...prev,
          {
            text: response.data.response,
            isBot: true,
            chart: response.data.chart,
          },
        ])
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

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isThinking])

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
    <div className={`flex flex-col h-screen overflow-hidden ${darkMode ? 'dark' : ''}`}>
      <main className="flex-1 overflow-hidden bg-gray-50 transition-all duration-300 ease-in-out dark:bg-[#0f0721]">
        <div className="h-full flex flex-col">
          <ChatMessages
            messages={messages}
            copiedIndex={copiedIndex}
            handleTextToSpeech={handleTextToSpeech}
            handleCopyText={handleCopyText}
            bottomRef={messagesEndRef}
            isThinking={isThinking}
          />
          <div className="relative p-4 md:p-6">
            {/* Add the fog effect container */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-300/30 to-transparent dark:from-pink-900/30 backdrop-blur-md rounded-t-3xl"></div>
            
            <motion.div
              className="relative mx-auto w-full max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ScrollArea className="w-full whitespace-nowrap mb-4">
                <div className="flex space-x-2">
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
                  className="w-full rounded-full bg-white/80 dark:bg-[#241242]/80 backdrop-blur-sm px-4 py-3 md:px-6 md:py-4 text-base text-gray-900 dark:text-gray-100 shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-purple-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-2 md:p-3 text-white transition-all duration-300 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-purple-500"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
              <div>
                <p></p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChatInterface
