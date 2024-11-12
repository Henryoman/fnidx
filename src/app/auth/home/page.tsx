'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { EventCard } from '@/components/events/EventCard'
import { FriendRequest } from '@/components/profile/FriendRequest'

interface Event {
  id: string
  title: string
  location: string
  image: string
  date: string
}

interface FriendRequest {
  id: string
  requester: {
    id: string
    full_name: string
    avatar_url: string
  }
}

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])

  useEffect(() => {
    fetchEvents()
    fetchFriendRequests()
  }, [])

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
      .limit(4)

    if (error) {
      console.error('Error fetching events:', error)
    } else {
      setUpcomingEvents(data)
    }
  }

  async function fetchFriendRequests() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('friend_requests')
      .select(`
        id,
        requester:users!friend_requests_requester_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('receiver_id', user.id)
      .eq('status', 'pending')

    if (error) {
      console.error('Error fetching friend requests:', error)
    } else {
      setFriendRequests(data)
    }
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Welcome to Function</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <Link href="/events" className="mt-4 inline-block text-primary hover:text-primary/80">
            View all events
          </Link>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
          <div className="space-y-4">
            {friendRequests.map((request) => (
              <FriendRequest key={request.id} request={request} />
            ))}
          </div>
          <Link href="/friends" className="mt-4 inline-block text-primary hover:text-primary/80">
            View all friend requests
          </Link>
        </div>
      </div>
    </div>
  )
}