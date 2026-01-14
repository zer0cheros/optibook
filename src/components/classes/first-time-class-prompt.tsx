'use client'

import { useEffect, useState } from 'react'
import { User } from '../../../generated/prisma/browser'
import { JoinClassModal } from './join-class-modal'

export function FirstTimeClassPrompt({ user }: { user: User }) {
  const [showPrompt, setShowPrompt] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkIfStudentNeedsClass()
  }, [])

  const checkIfStudentNeedsClass = async () => {
    // Only check for USER role (students)
    if (user.role !== 'USER') {
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/classes')
      const data = await res.json()
      const classes = data.classes || []

      // If student has no classes, show the prompt
      if (classes.length === 0) {
        setShowPrompt(true)
      }
    } catch (error) {
      console.error('Failed to check classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = () => {
    setShowPrompt(false)
  }

  if (loading || user.role !== 'USER') {
    return null
  }

  return (
    <JoinClassModal
      open={showPrompt}
      onOpenChange={setShowPrompt}
      onJoin={handleJoin}
    />
  )
}
