'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'
import { Menu } from 'lucide-react'
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
        <Button className="flex w-full items-center space-x-2 rounded-md border border-white/20 bg-white/10 px-4 py-2 text-left shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/20">
          <Menu className="text-white" />
          <span className="text-left">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row gap-4 py-4">
          <div className="items-center gap-4">
            <p>Dark Theme</p>
            <Switch defaultChecked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsDialog
