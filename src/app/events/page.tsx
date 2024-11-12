'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { EventCard } from '@/components/events/EventCard'

interface Event {
  id: string
  title: string
  description: string
  location: string
  image_url: string
  start_date: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true })

      if (error) {
        throw error
      }

      setEvents(data || [])
    } catch (err) {
      console.error('Error fetching events:', err)
      setError('Failed to load events. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center mt-8">Loading events...</div>
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-600">{error}</p>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => fetchEvents()}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
      {events.length === 0 ? (
        <p className="text-center">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}