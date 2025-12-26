import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { http } from '../api/http.js'

const AuthContext = createContext(undefined)
const TOKEN_KEY = 'lf_token'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const setSession = (auth) => {
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
    const res = await http.get('/api/auth/me')
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

  const login = async (email, password) => {
    const res = await http.post('/api/auth/login', { email, password })
    setSession(res.data)
    toast.success('Welcome back!')
  }

  const register = async (name, email, password) => {
    const res = await http.post('/api/auth/register', { name, email, password })
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

