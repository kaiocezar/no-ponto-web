import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { useClientAuth } from '@features/auth'
import { router } from '@/router'

export function AppBootstrap() {
  useClientAuth()
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
      <RouterProvider router={router} />
    </>
  )
}
