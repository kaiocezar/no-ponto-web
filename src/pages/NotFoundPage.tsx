import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="mt-4 text-xl font-medium text-gray-700">Página não encontrada</p>
      <p className="mt-2 text-gray-500">A página que você está procurando não existe.</p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700"
      >
        Voltar ao início
      </Link>
    </div>
  )
}
