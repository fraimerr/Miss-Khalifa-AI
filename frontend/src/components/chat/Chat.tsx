'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Send, Shield, Stethoscope, Users } from 'lucide-react'
import { motion } from 'framer-motion'

type Message = {
  id: number
  text: string
  sender: 'user' | 'ai'
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

const ChatArea = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (input.trim() === '') return

    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
    }

    setMessages((prevMessages) => [...prevMessages, newMessage])
    setInput('')

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now(),
        text: 'This is a simulated AI response.',
        sender: 'ai',
      }
      setMessages((prevMessages) => [...prevMessages, aiResponse])
    }, 1000)
  }
  const handleTip = (text: string) => {
    setInput(text)
  }

  return (
    <div className="flex h-screen flex-col">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex max-w-[70%] items-start rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {message.sender === 'ai' && (
                <Avatar className="mr-3">
                  <AvatarImage src="/miss_khalifa_ai.png" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="border-t p-4">
        <div className="relative pb-2">
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
      </div>
    </div>
  )
}

export default ChatArea
