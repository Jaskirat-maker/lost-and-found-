import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader } from '../ui/Loader'

export function AdminRoute() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />
  return <Outlet />
}

