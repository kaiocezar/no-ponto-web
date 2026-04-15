import { ProfileWizard } from '@features/providers/components/ProfileWizard'

export default function ProfileSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Configure seu perfil</h1>
          <p className="mt-2 text-sm text-gray-600">
            Preencha as informações para que seus clientes possam te encontrar
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <ProfileWizard />
        </div>
      </div>
    </div>
  )
}
