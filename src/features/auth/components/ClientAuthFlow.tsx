import { useState } from 'react'

import { useCompleteProfile } from '../hooks/useCompleteProfile'
import { useRequestOTP } from '../hooks/useRequestOTP'
import { useVerifyOTP } from '../hooks/useVerifyOTP'
import { CompleteNameStep } from './CompleteNameStep'
import { OTPVerificationStep } from './OTPVerificationStep'
import { PhoneInputStep } from './PhoneInputStep'

type ClientAuthStep = 'phone' | 'otp' | 'name'

interface ClientAuthFlowProps {
  onAuthenticated: (payload: { phone: string; fullName?: string }) => void
}

export function ClientAuthFlow({ onAuthenticated }: ClientAuthFlowProps) {
  const [step, setStep] = useState<ClientAuthStep>('phone')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [verifiedPayload, setVerifiedPayload] = useState<{ phone: string } | null>(null)

  const requestOTPMutation = useRequestOTP()
  const verifyOTPMutation = useVerifyOTP()
  const completeProfileMutation = useCompleteProfile()

  const handleRequestOTP = (phoneE164: string) => {
    setError(null)
    requestOTPMutation.mutate(phoneE164, {
      onSuccess: () => {
        setPhone(phoneE164)
        setStep('otp')
      },
      onError: () => {
        setError('Nao foi possivel enviar o codigo agora. Tente novamente.')
      },
    })
  }

  const handleVerifyOTP = (code: string) => {
    if (!phone) return
    setError(null)
    verifyOTPMutation.mutate(
      { phone, code },
      {
        onSuccess: (data) => {
          if (data.is_new_user) {
            setVerifiedPayload({ phone })
            setStep('name')
            return
          }
          onAuthenticated({ phone })
        },
        onError: () => {
          setError('Codigo invalido ou expirado. Confira e tente novamente.')
        },
      },
    )
  }

  const handleCompleteProfile = (fullName: string) => {
    if (!verifiedPayload) return
    setError(null)
    completeProfileMutation.mutate(fullName, {
      onSuccess: () => {
        onAuthenticated({ phone: verifiedPayload.phone, fullName })
      },
      onError: () => {
        setError('Nao foi possivel completar seu cadastro agora.')
      },
    })
  }

  return (
    <div className="space-y-3">
      {step === 'phone' && (
        <PhoneInputStep isPending={requestOTPMutation.isPending} onSubmit={handleRequestOTP} />
      )}

      {step === 'otp' && (
        <OTPVerificationStep
          phone={phone}
          isPending={verifyOTPMutation.isPending}
          onSubmit={handleVerifyOTP}
          onResend={() => {
            if (!phone) return
            requestOTPMutation.mutate(phone)
          }}
        />
      )}

      {step === 'name' && (
        <CompleteNameStep
          isPending={completeProfileMutation.isPending}
          onSubmit={handleCompleteProfile}
        />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
