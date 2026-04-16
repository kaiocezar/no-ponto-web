import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

import { usePublicProfile } from '@features/providers/hooks/usePublicProfile'
import type { Service } from '@/types/api'

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatBRL = (value: string) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(value))

// ── Subcomponentes ────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-pulse">
      <div className="flex gap-4 items-center mb-6">
        <div className="h-20 w-20 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  )
}

interface ServiceCardProps {
  service: Service
  slug: string
}

function ServiceCard({ service, slug }: ServiceCardProps) {
  const canBookOnline = service.is_active && service.is_online
  return (
    <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{service.name}</p>
        {service.description && (
          <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">{service.duration_minutes} min</p>
      </div>
      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
        {service.price && (
          <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
            {formatBRL(service.price)}
          </span>
        )}
        {canBookOnline && (
          <Link
            to={`/${slug}/agendar?service_id=${service.id}`}
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-primary-700"
          >
            Agendar
          </Link>
        )}
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function ProviderProfilePage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: profile, isLoading, error } = usePublicProfile(slug ?? '')
  const services = profile?.services ?? []

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (error) {
    const is404 = axios.isAxiosError(error) && error.response?.status === 404
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {is404 ? 'Perfil não encontrado' : 'Erro ao carregar perfil'}
        </h1>
        <p className="mt-2 text-gray-500">
          {is404
            ? 'O endereço que você acessou não existe ou foi removido.'
            : 'Tente novamente mais tarde.'}
        </p>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Cabeçalho */}
      <div className="flex gap-4 items-center mb-8">
        {profile.logo_url ? (
          <img
            src={profile.logo_url}
            alt={`Logo de ${profile.business_name}`}
            className="h-20 w-20 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold border border-primary-200">
            {profile.business_name.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h1 className="text-xl font-bold text-gray-900">{profile.business_name}</h1>
          {profile.specialty && (
            <p className="text-sm text-gray-500 mt-0.5">{profile.specialty}</p>
          )}
          {(profile.address_city ?? profile.address_state) && (
            <p className="text-sm text-gray-400 mt-0.5">
              {[profile.address_city, profile.address_state].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Sobre
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
        </div>
      )}

      {/* Servicos */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Servicos
        </h2>
        {services.length > 0 ? (
          <div className="rounded-lg border border-gray-200 divide-y divide-gray-100">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} slug={profile.slug} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nenhum serviço cadastrado.</p>
        )}
      </div>

      {/* Contato */}
      {profile.whatsapp_number && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Contato
          </h2>
          <a
            href={`https://wa.me/${profile.whatsapp_number.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-green-700 hover:underline"
          >
            <span>WhatsApp: {profile.whatsapp_number}</span>
          </a>
        </div>
      )}
    </div>
  )
}
