import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader } from '../ui/Loader'

export function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <Loader />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

