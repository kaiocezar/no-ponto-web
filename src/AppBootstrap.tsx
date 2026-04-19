import { RouterProvider } from 'react-router-dom'

import { useClientAuth } from '@features/auth'
import { router } from '@/router'

export function AppBootstrap() {
  useClientAuth()
  return <RouterProvider router={router} />
}
