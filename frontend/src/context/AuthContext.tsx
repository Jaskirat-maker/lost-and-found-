/* eslint-disable react-refresh/only-export-components */
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { http } from '../api/http'
import type { AuthResponse, User } from '../types'

type AuthContextValue = {
  token: string | null
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshMe: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_KEY = 'lf_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const setSession = (auth: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, auth.token)
    setToken(auth.token)
    setUser(auth.user)
  }

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  const refreshMe = async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      clearSession()
      return
    }
    const res = await http.get<User>('/api/auth/me')
    setUser(res.data)
  }

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        if (localStorage.getItem(TOKEN_KEY)) {
          await refreshMe()
        }
      } catch {
        clearSession()
      } finally {
        if (alive) setIsLoading(false)
      }
    })()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (email: string, password: string) => {
    const res = await http.post<AuthResponse>('/api/auth/login', { email, password })
    setSession(res.data)
    toast.success('Welcome back!')
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await http.post<AuthResponse>('/api/auth/register', { name, email, password })
    setSession(res.data)
    toast.success('Account created!')
  }

  const logout = () => {
    clearSession()
    toast('Logged out')
  }

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, register, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

