'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.replace('/admin/login')
      setAuthorized(false)
    } else {
      setAuthorized(true)
    }
  }, [router])

  if (authorized === null || !authorized) return null
  return <>{children}</>
}
