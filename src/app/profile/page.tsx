'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

interface UserProfile {
  id: string
  username: string
  full_name: string
  avatar_url: string
  bio: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else {
        setProfile(data)
      }
    }
  }

  if (!profile) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-6 mb-4">
          <Image
            src={profile.avatar_url || '/placeholder.svg?height=100&width=100'}
            alt={profile.full_name}
            width={100}
            height={100}
            className="rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold">{profile.full_name}</h2>
            <p className="text-gray-600">@{profile.username}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{profile.bio}</p>
        {/* Add more profile information and edit functionality here */}
      </div>
    </div>
  )
}