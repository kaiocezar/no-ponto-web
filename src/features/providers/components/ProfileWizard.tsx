import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'

import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { Alert } from '@components/ui/Alert'
import { SlugPreview } from './SlugPreview'
import { useProviderProfile } from '../hooks/useProviderProfile'
import { useCategories } from '../hooks/useCategories'
import { cn } from '@utils/cn'

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface WizardData {
  business_name: string
  specialty: string
  category: string
  whatsapp_number: string
  address_street: string
  address_city: string
  address_state: string
  address_zip: string
}

interface WizardState {
  step: 1 | 2 | 3
  data: WizardData
}

const STORAGE_KEY = 'provider_wizard_state'

const emptyData: WizardData = {
  business_name: '',
  specialty: '',
  category: '',
  whatsapp_number: '',
  address_street: '',
  address_city: '',
  address_state: '',
  address_zip: '',
}

// ── Schemas Zod ───────────────────────────────────────────────────────────────

const step1Schema = z.object({
  business_name: z.string().min(2, 'Nome do negócio obrigatório (mínimo 2 caracteres)'),
  specialty: z.string().optional().default(''),
  category: z.string().optional().default(''),
  whatsapp_number: z.string().optional().default(''),
})

const step2Schema = z.object({
  address_street: z.string().optional().default(''),
  address_city: z.string().optional().default(''),
  address_state: z.string().optional().default(''),
  address_zip: z.string().optional().default(''),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { num: 1, label: 'Negócio' },
    { num: 2, label: 'Endereço' },
    { num: 3, label: 'Publicar' },
  ]

  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, idx) => (
        <div key={s.num} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors',
                step > s.num
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : step === s.num
                    ? 'border-primary-600 text-primary-600 bg-white'
                    : 'border-gray-300 text-gray-400 bg-white',
              )}
            >
              {step > s.num ? '✓' : s.num}
            </div>
            <span
              className={cn(
                'text-xs mt-1',
                step === s.num ? 'text-primary-600 font-medium' : 'text-gray-400',
              )}
            >
              {s.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={cn(
                'h-0.5 flex-1 mb-5 transition-colors',
                step > s.num + 1 ? 'bg-primary-600' : 'bg-gray-200',
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Step 1 ────────────────────────────────────────────────────────────────────

interface Step1Props {
  defaultValues: WizardData
  onNext: (data: Partial<WizardData>) => void
}

function Step1({ defaultValues, onNext }: Step1Props) {
  const { data: categories } = useCategories()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      business_name: defaultValues.business_name,
      specialty: defaultValues.specialty,
      category: defaultValues.category,
      whatsapp_number: defaultValues.whatsapp_number,
    },
  })

  const businessName = watch('business_name')

  const onSubmit = (data: Step1Data) => {
    onNext(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Input
          label="Nome do negócio"
          type="text"
          placeholder="Ex: Clínica Bem Estar"
          error={errors.business_name?.message}
          {...register('business_name')}
        />
        <div className="mt-2">
          <SlugPreview businessName={businessName ?? ''} />
        </div>
      </div>

      <Input
        label="Especialidade"
        type="text"
        placeholder="Ex: Fisioterapia, Manicure..."
        error={errors.specialty?.message}
        {...register('specialty')}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="category" className="text-sm font-medium text-gray-700">
          Categoria
        </label>
        <select
          id="category"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          {...register('category')}
        >
          <option value="">Selecione uma categoria</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="WhatsApp"
        type="tel"
        placeholder="(11) 99999-9999"
        error={errors.whatsapp_number?.message}
        {...register('whatsapp_number')}
      />

      <Button type="submit" className="w-full mt-2">
        Próximo
      </Button>
    </form>
  )
}

// ── Step 2 ────────────────────────────────────────────────────────────────────

interface Step2Props {
  defaultValues: WizardData
  onNext: (data: Partial<WizardData>) => void
  onBack: () => void
  onSkip: () => void
}

function Step2({ defaultValues, onNext, onBack, onSkip }: Step2Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      address_street: defaultValues.address_street,
      address_city: defaultValues.address_city,
      address_state: defaultValues.address_state,
      address_zip: defaultValues.address_zip,
    },
  })

  const onSubmit = (data: Step2Data) => {
    onNext(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Rua / Logradouro"
        type="text"
        placeholder="Rua das Flores, 123"
        error={errors.address_street?.message}
        {...register('address_street')}
      />

      <Input
        label="Cidade"
        type="text"
        placeholder="São Paulo"
        error={errors.address_city?.message}
        {...register('address_city')}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Estado"
          type="text"
          placeholder="SP"
          error={errors.address_state?.message}
          {...register('address_state')}
        />
        <Input
          label="CEP"
          type="text"
          placeholder="01310-100"
          error={errors.address_zip?.message}
          {...register('address_zip')}
        />
      </div>

      <div className="flex gap-3 mt-2">
        <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
          Voltar
        </Button>
        <Button type="button" variant="ghost" onClick={onSkip} className="flex-1">
          Pular etapa
        </Button>
        <Button type="submit" className="flex-1">
          Próximo
        </Button>
      </div>
    </form>
  )
}

// ── Step 3 ────────────────────────────────────────────────────────────────────

interface Step3Props {
  data: WizardData
  onBack: () => void
  onPublish: () => void
  onSaveDraft: () => void
  isPublishing: boolean
  isSaving: boolean
  error: string | null
}

function Step3({ data, onBack, onPublish, onSaveDraft, isPublishing, isSaving, error }: Step3Props) {
  const rows: Array<{ label: string; value: string }> = [
    { label: 'Nome do negócio', value: data.business_name },
    { label: 'Especialidade', value: data.specialty },
    { label: 'WhatsApp', value: data.whatsapp_number },
    { label: 'Endereço', value: [data.address_street, data.address_city, data.address_state].filter(Boolean).join(', ') },
    { label: 'CEP', value: data.address_zip },
  ].filter((r) => r.value)

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-gray-200 divide-y divide-gray-100">
        {rows.length === 0 ? (
          <p className="px-4 py-3 text-sm text-gray-500">Nenhuma informação preenchida.</p>
        ) : (
          rows.map((row) => (
            <div key={row.label} className="flex justify-between px-4 py-3">
              <span className="text-sm text-gray-500">{row.label}</span>
              <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
                {row.value}
              </span>
            </div>
          ))
        )}
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          onClick={onPublish}
          isLoading={isPublishing}
          disabled={isSaving}
          className="w-full"
        >
          Publicar perfil
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onSaveDraft}
          isLoading={isSaving}
          disabled={isPublishing}
          className="w-full"
        >
          Salvar e publicar depois
        </Button>
        <Button type="button" variant="ghost" onClick={onBack} className="w-full">
          Voltar
        </Button>
      </div>
    </div>
  )
}

// ── Wizard principal ──────────────────────────────────────────────────────────

export function ProfileWizard() {
  const navigate = useNavigate()
  const { update, publish } = useProviderProfile()

  const [wizardState, setWizardState] = useState<WizardState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as WizardState
        return parsed
      }
    } catch {
      // ignora erro de parse
    }
    return { step: 1, data: emptyData }
  })

  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wizardState))
  }, [wizardState])

  const goToStep = (step: 1 | 2 | 3, partialData?: Partial<WizardData>) => {
    setWizardState((prev) => ({
      step,
      data: { ...prev.data, ...(partialData ?? {}) },
    }))
  }

  const handleStep1Next = (data: Partial<WizardData>) => {
    goToStep(2, data)
  }

  const handleStep2Next = (data: Partial<WizardData>) => {
    goToStep(3, data)
  }

  const handleStep2Skip = () => {
    goToStep(3)
  }

  const buildPayload = () => {
    const { data } = wizardState
    return {
      business_name: data.business_name,
      specialty: data.specialty || undefined,
      whatsapp_number: data.whatsapp_number || undefined,
      address_street: data.address_street || undefined,
      address_city: data.address_city || undefined,
      address_state: data.address_state || undefined,
      address_zip: data.address_zip || undefined,
    }
  }

  const handlePublish = async () => {
    setSubmitError(null)
    try {
      await update.mutateAsync(buildPayload())
      await publish.mutateAsync()
      localStorage.removeItem(STORAGE_KEY)
      void navigate('/painel')
    } catch {
      setSubmitError('Erro ao publicar perfil. Tente novamente.')
    }
  }

  const handleSaveDraft = async () => {
    setSubmitError(null)
    try {
      await update.mutateAsync(buildPayload())
      localStorage.removeItem(STORAGE_KEY)
      void navigate('/painel')
    } catch {
      setSubmitError('Erro ao salvar perfil. Tente novamente.')
    }
  }

  return (
    <div>
      <ProgressBar step={wizardState.step} />

      {wizardState.step === 1 && (
        <Step1
          defaultValues={wizardState.data}
          onNext={handleStep1Next}
        />
      )}

      {wizardState.step === 2 && (
        <Step2
          defaultValues={wizardState.data}
          onNext={handleStep2Next}
          onBack={() => goToStep(1)}
          onSkip={handleStep2Skip}
        />
      )}

      {wizardState.step === 3 && (
        <Step3
          data={wizardState.data}
          onBack={() => goToStep(2)}
          onPublish={() => { void handlePublish() }}
          onSaveDraft={() => { void handleSaveDraft() }}
          isPublishing={update.isPending || publish.isPending}
          isSaving={update.isPending && !publish.isPending}
          error={submitError}
        />
      )}
    </div>
  )
}
