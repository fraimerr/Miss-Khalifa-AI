'use client'
import React, { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMediaQuery } from '@/hooks/use-media-query'
import {
  Home,
  Settings,
  HelpCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MessageCircle,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '../../../../public/miss_khalifa_ai.png'
import { useTheme } from 'next-themes'

const navItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Chat', icon: MessageCircle, href: '/chat' },
  { name: 'Glossary', icon: BookOpen, href: '/glossary' },
  { name: 'Settings', icon: Settings, href: '/settings' },
  { name: 'Help', icon: HelpCircle, href: '/help' },
]

export const Sidebar = () => {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const toggleCollapse = () => setCollapsed(!collapsed)

  const SidebarContent = (
    <div
      className={`flex h-full flex-col backdrop-blur-md backdrop-filter transition-all duration-500 ease-in-out dark:bg-[#190933] ${
        collapsed ? 'w-0 overflow-hidden opacity-0' : 'w-72 opacity-100'
      }`}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Image
            src={Logo}
            alt="Miss Khalifa AI"
            className="h-10 w-10 rounded-full"
            height={40}
            width={40}
          />
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
            Miss Khalifa AI
          </span>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link href={item.href} key={item.name} passHref>
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-4 text-lg font-medium text-gray-700 transition-colors hover:bg-white/20 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <item.icon className="mr-4 h-6 w-6" />
                <span>{item.name}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; 2024 Miss Khalifa AI</p>
        <div className="mt-2 space-x-2">
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <span>·</span>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
        </div>
      </div>
    </div>
  )

  if (isDesktop) {
    return (
      <div className="relative h-full">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className={`absolute top-4 ${
            collapsed ? 'left-4' : 'right-4'
          } z-10 text-gray-600 transition-all duration-500 ease-in-out hover:bg-white/20 dark:text-gray-300 dark:hover:bg-white/10`}
        >
          {collapsed ? (
            <ChevronRight className="h-6 w-6" />
          ) : (
            <ChevronLeft className="h-6 w-6" />
          )}
        </Button>
        <div
          className={`transition-all duration-500 ease-in-out ${
            collapsed ? 'w-0' : 'w-72'
          }`}
        >
          {SidebarContent}
        </div>
      </div>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        {SidebarContent}
      </SheetContent>
    </Sheet>
  )
}

export default Sidebar
