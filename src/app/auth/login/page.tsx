'use client'

import { useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface FriendRequestProps {
  request: {
    id: string
    requester: {
      id: string
      full_name: string
      avatar_url: string
    }
  }
  onRequestHandled: () => void
}

export function FriendRequest({ request, onRequestHandled }: FriendRequestProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAccept = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const { error } = await supabase.rpc('accept_friend_request', {
        request_id: request.id
      })

      if (error) {
        throw error
      }

      console.log('Accepted friend request from', request.requester.full_name)
      onRequestHandled()
    } catch (err) {
      console.error('Error accepting friend request:', err)
      setError('Failed to accept friend request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecline = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const { error } = await supabase.rpc('decline_friend_request', {
        request_id: request.id
      })

      if (error) {
        throw error
      }

      console.log('Declined friend request from', request.requester.full_name)
      onRequestHandled()
    } catch (err) {
      console.error('Error declining friend request:', err)
      setError('Failed to decline friend request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col bg-white shadow rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Image
            src={request.requester.avatar_url || '/placeholder.svg?height=48&width=48'}
            alt={request.requester.full_name}
            width={48}
            height={48}
            className="rounded-full"
          />
          <span className="font-semibold">{request.requester.full_name}</span>
        </div>
        <div className="space-x-2">
          <button
            onClick={handleAccept}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-300 disabled:opacity-50"
          >
            Accept
          </button>
          <button
            onClick={handleDecline}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-300 disabled:opacity-50"
          >
            Decline
          </button>
        </div>
      </div>
      {error && (
        <div className="text-red-600 text-sm mt-2">{error}</div>
      )}
    </div>
  )
}