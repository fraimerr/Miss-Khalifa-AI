'use client'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'
import { Settings } from 'lucide-react'
import { Button } from '../../ui/button'
import { Switch } from '@/components/ui/switch'

interface SettingsDialogProps {
  darkMode: boolean
  setDarkMode: (darkMode: boolean) => void
}

const SettingsDialog = ({ darkMode, setDarkMode }: SettingsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className={`flex w-full items-center justify-start space-x-2 rounded-md border px-4 py-2 text-left shadow-lg backdrop-blur-md transition-all duration-300 ${
            darkMode
              ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
              : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Settings className={darkMode ? 'text-white' : 'text-gray-900'} />
          <span>Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[425px] ${darkMode ? 'bg-[#190933] text-white' : 'bg-white text-gray-900'}`}>
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row items-center justify-between gap-4 py-4">
          <p>Dark Theme</p>
          <Switch 
            checked={darkMode} 
            onCheckedChange={setDarkMode}
            className={darkMode ? 'bg-purple-600' : 'bg-gray-200'}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsDialog