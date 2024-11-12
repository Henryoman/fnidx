import Link from 'next/link'
import Image from 'next/image'

interface Event {
  id: string
  title: string
  description: string
  location: string
  image_url: string
  start_date: string
}

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`}>
      <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48">
          <Image
            src={event.image_url || '/placeholder.svg?height=200&width=300'}
            alt={event.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-xl mb-2">{event.title}</h3>
          <p className="text-gray-600 mb-2">{event.location}</p>
          <p className="text-gray-500 text-sm">{new Date(event.start_date).toLocaleDateString()}</p>
          <p className="text-gray-700 mt-2 line-clamp-2">{event.description}</p>
        </div>
      </div>
    </Link>
  )
}