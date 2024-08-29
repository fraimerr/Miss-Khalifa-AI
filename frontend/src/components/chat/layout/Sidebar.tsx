'use client'
import React, { useState, useEffect } from 'react'
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
  const { theme } = useTheme()

  const toggleCollapse = () => setCollapsed(!collapsed)

  const SidebarContent = (
    <div
      className={`flex h-full flex-col bg-white/30 dark:bg-[#190933]/30 backdrop-blur-md transition-all duration-500 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
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
          {!collapsed && (
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              Miss Khalifa AI
            </span>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link href={item.href} key={item.name} passHref>
              <Button
                variant="ghost"
                className={`w-full justify-start px-4 py-4 text-lg font-medium text-gray-700 transition-colors hover:bg-pink-100/50 hover:text-pink-600 dark:text-gray-300 dark:hover:bg-pink-900/30 dark:hover:text-pink-400 ${
                  collapsed ? 'items-center' : ''
                }`}
              >
                <item.icon className={`h-6 w-6 ${collapsed ? '' : 'mr-4'}`} />
                {!collapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
        {!collapsed && (
          <>
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
          </>
        )}
      </div>
    </div>
  )

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isDesktop) {
    return (
      <div className="relative h-full">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className={`absolute top-4 ${
            collapsed ? '-right-4' : 'right-4'
          } z-10 text-gray-600 transition-all duration-500 ease-in-out hover:bg-pink-100/50 hover:text-pink-600 dark:text-gray-300 dark:hover:bg-pink-900/30 dark:hover:text-pink-400`}
        >
          {collapsed ? (
            <ChevronRight className="h-6 w-6" />
          ) : (
            <ChevronLeft className="h-6 w-6" />
          )}
        </Button>
        {SidebarContent}
      </div>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-transparent">
        {SidebarContent}
      </SheetContent>
    </Sheet>
  )
}

export default Sidebar