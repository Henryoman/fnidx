'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

interface Event {
  id: string
  title: string
  description: string
  location: string
  image_url: string
  start_date: string
  end_date: string
  creator_id: string
}

export default function EventPage() {
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [isAttending, setIsAttending] = useState(false)

  useEffect(() => {
    fetchEvent()
    checkAttendance()
  }, [id])

  async function fetchEvent() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching event:', error)
    } else {
      setEvent(data)
    }
  }

  async function checkAttendance() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('event_id', id)
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error checking attendance:', error)
      } else {
        setIsAttending(!!data)
      }
    }
  }

  async function toggleAttendance() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      if (isAttending) {
        const { error } = await supabase
          .from('event_attendees')
          .delete()
          .eq('event_id', id)
          .eq('user_id', user.id)

        if (error) {
          console.error('Error removing attendance:', error)
        } else {
          setIsAttending(false)
        }
      } else {
        const { error } = await supabase
          .from('event_attendees')
          .insert({ event_id: id, user_id: user.id })

        if (error) {
          console.error('Error adding attendance:', error)
        } else {
          setIsAttending(true)
        }
      }
    }
  }

  if (!event) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="relative h-64 sm:h-96">
          <Image
            src={event.image_url || '/placeholder.svg?height=400&width=800'}
            alt={event.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          <p className="text-gray-600 mb-4">{event.location}</p>
          <p className="text-gray-700 mb-4">{event.description}</p>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-600">Start: {new Date(event.start_date).toLocaleString()}</p>
              {event.end_date && (
                <p className="text-gray-600">End: {new Date(event.end_date).toLocaleString()}</p>
              )}
            </div>
            <button
              onClick={toggleAttendance}
              className={`px-4 py-2 rounded ${
                isAttending
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isAttending ? 'Cancel Attendance' : 'Attend Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}