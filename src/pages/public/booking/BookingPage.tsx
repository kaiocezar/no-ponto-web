import { useParams } from 'react-router-dom'

// TODO: implementar na task MVP-P0-03
export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Agendar com: {slug}</h1>
      <p className="mt-2 text-gray-500">Implementar na task MVP-P0-03</p>
    </div>
  )
}
