import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'

import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { Alert } from '@components/ui/Alert'
import { SlugPreview } from './SlugPreview'
import { AvatarUpload } from './AvatarUpload'
import { useProviderProfile } from '../hooks/useProviderProfile'
import { useCategories } from '../hooks/useCategories'
import { useServices } from '../hooks/useServices'
import { cn } from '@utils/cn'

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface WizardData {
  business_name: string
  specialty: string
  category: string
  whatsapp_number: string
  logo_url: string
  address_street: string
  address_city: string
  address_state: string
  address_zip: string
}

type WizardStep = 1 | 2 | 3 | 4

interface WizardState {
  step: WizardStep
  data: WizardData
}

const STORAGE_KEY = 'provider_wizard_state'

const emptyData: WizardData = {
  business_name: '',
  specialty: '',
  category: '',
  whatsapp_number: '',
  logo_url: '',
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
  logo_url: z.string().optional().default(''),
})

const step2Schema = z.object({
  address_street: z.string().optional().default(''),
  address_city: z.string().optional().default(''),
  address_state: z.string().optional().default(''),
  address_zip: z.string().optional().default(''),
})

const serviceSchema = z.object({
  name: z.string().min(1, 'Nome do serviço obrigatório'),
  description: z.string().optional().default(''),
  price: z
    .string()
    .min(1, 'Preço obrigatório')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Preço deve ser maior que zero'),
  duration_minutes: z
    .number({ invalid_type_error: 'Duração obrigatória' })
    .int()
    .positive('Duração deve ser maior que zero'),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type ServiceFormData = z.infer<typeof serviceSchema>

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: WizardStep }) {
  const steps = [
    { num: 1, label: 'Negócio' },
    { num: 2, label: 'Endereço' },
    { num: 3, label: 'Serviços' },
    { num: 4, label: 'Publicar' },
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
    setValue,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      business_name: defaultValues.business_name,
      specialty: defaultValues.specialty,
      category: defaultValues.category,
      whatsapp_number: defaultValues.whatsapp_number,
      logo_url: defaultValues.logo_url,
    },
  })

  const businessName = watch('business_name')

  const onSubmit = (data: Step1Data) => {
    onNext(data)
  }

  const handleLogoChange = (url: string) => {
    setValue('logo_url', url)
  }

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e)
      }}
      className="flex flex-col gap-4"
    >
      <AvatarUpload
        currentUrl={defaultValues.logo_url || undefined}
        initials={defaultValues.business_name || 'N'}
        onUrlChange={handleLogoChange}
      />

      <div>
        <Input
          label="Nome do negócio"
          type="text"
          placeholder="Ex: Clínica Bem Estar"
          error={errors.business_name?.message}
          {...register('business_name')}
        />
        <div className="mt-2">
          <SlugPreview businessName={businessName} />
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
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e)
      }}
      className="flex flex-col gap-4"
    >
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

// ── Step 3 — Serviços ─────────────────────────────────────────────────────────

interface Step3ServicesProps {
  onNext: () => void
  onBack: () => void
}

function Step3Services({ onNext, onBack }: Step3ServicesProps) {
  const { services, isLoading, create, remove } = useServices()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      duration_minutes: 60,
    },
  })

  const onAddService = (data: ServiceFormData) => {
    create.mutate(
      {
        name: data.name,
        description: data.description || undefined,
        price: data.price,
        duration_minutes: data.duration_minutes,
        is_active: true,
      },
      {
        onSuccess: () => { reset() },
      },
    )
  }

  const handleRemove = (id: string) => {
    remove.mutate(id)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Aviso quando não há serviços */}
      {!isLoading && services.length === 0 && (
        <Alert variant="warning">
          Adicione pelo menos 1 serviço antes de publicar o perfil.
        </Alert>
      )}

      {/* Lista de serviços */}
      {services.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-700">Serviços cadastrados</h3>
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{service.name}</p>
                  <p className="text-xs text-gray-500">
                    {service.duration_minutes} min
                    {service.price
                      ? ` · ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(service.price))}`
                      : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { handleRemove(service.id) }}
                  disabled={remove.isPending}
                  className="ml-3 text-xs text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                  aria-label={`Remover serviço ${service.name}`}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulário inline para adicionar serviço */}
      <form
        onSubmit={(e) => {
          void handleSubmit(onAddService)(e)
        }}
        className="flex flex-col gap-3"
      >
        <h3 className="text-sm font-semibold text-gray-700">Adicionar serviço</h3>

        <Input
          label="Nome do serviço"
          type="text"
          placeholder="Ex: Corte de cabelo"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Descrição (opcional)"
          type="text"
          placeholder="Ex: Inclui lavagem e finalização"
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Preço (R$)"
            type="text"
            placeholder="Ex: 80.00"
            error={errors.price?.message}
            {...register('price')}
          />
          <Input
            label="Duração (min)"
            type="number"
            placeholder="Ex: 60"
            min={1}
            error={errors.duration_minutes?.message}
            {...register('duration_minutes', { valueAsNumber: true })}
          />
        </div>

        {create.isError && (
          <Alert variant="error">Erro ao adicionar serviço. Tente novamente.</Alert>
        )}

        <Button
          type="submit"
          variant="secondary"
          isLoading={create.isPending}
          className="w-full"
        >
          Adicionar serviço
        </Button>
      </form>

      {/* Navegação */}
      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
          Voltar
        </Button>
        <Button type="button" onClick={onNext} className="flex-1">
          Próximo
        </Button>
      </div>
    </div>
  )
}

// ── Step 4 — Resumo e publicação ──────────────────────────────────────────────

interface Step4Props {
  data: WizardData
  onBack: () => void
  onPublish: () => void
  onSaveDraft: () => void
  isPublishing: boolean
  isSaving: boolean
  error: string | null
}

function Step4({
  data,
  onBack,
  onPublish,
  onSaveDraft,
  isPublishing,
  isSaving,
  error,
}: Step4Props) {
  const rows: Array<{ label: string; value: string }> = [
    { label: 'Nome do negócio', value: data.business_name },
    { label: 'Especialidade', value: data.specialty },
    { label: 'WhatsApp', value: data.whatsapp_number },
    {
      label: 'Endereço',
      value: [data.address_street, data.address_city, data.address_state]
        .filter(Boolean)
        .join(', '),
    },
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

  const goToStep = (step: WizardStep, partialData?: Partial<WizardData>) => {
    setWizardState((prev) => ({
      step,
      data: { ...prev.data, ...(partialData ?? {}) },
    }))
  }

  const buildPayload = () => {
    const { data } = wizardState
    return {
      business_name: data.business_name,
      specialty: data.specialty || undefined,
      whatsapp_number: data.whatsapp_number || undefined,
      logo_url: data.logo_url || undefined,
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

  const handleStep1Next = (data: Partial<WizardData>) => { goToStep(2, data) }
  const handleStep2Next = (data: Partial<WizardData>) => { goToStep(3, data) }
  const handleStep2Back = () => { goToStep(1) }
  const handleStep2Skip = () => { goToStep(3) }
  const handleStep3Next = () => { goToStep(4) }
  const handleStep3Back = () => { goToStep(2) }
  const handleStep4Back = () => { goToStep(3) }
  const handlePublishVoid = () => { void handlePublish() }
  const handleSaveDraftVoid = () => { void handleSaveDraft() }

  return (
    <div>
      <ProgressBar step={wizardState.step} />

      {wizardState.step === 1 && (
        <Step1 defaultValues={wizardState.data} onNext={handleStep1Next} />
      )}

      {wizardState.step === 2 && (
        <Step2
          defaultValues={wizardState.data}
          onNext={handleStep2Next}
          onBack={handleStep2Back}
          onSkip={handleStep2Skip}
        />
      )}

      {wizardState.step === 3 && (
        <Step3Services onNext={handleStep3Next} onBack={handleStep3Back} />
      )}

      {wizardState.step === 4 && (
        <Step4
          data={wizardState.data}
          onBack={handleStep4Back}
          onPublish={handlePublishVoid}
          onSaveDraft={handleSaveDraftVoid}
          isPublishing={update.isPending || publish.isPending}
          isSaving={update.isPending && !publish.isPending}
          error={submitError}
        />
      )}
    </div>
  )
}
