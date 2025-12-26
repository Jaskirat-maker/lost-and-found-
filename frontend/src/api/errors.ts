import type { AxiosError } from 'axios'

type ApiErrorBody = {
  message?: string
  error?: string
}

export function getApiErrorMessage(err: unknown, fallback: string) {
  const e = err as AxiosError<ApiErrorBody> | undefined
  const msg = e?.response?.data?.message || e?.response?.data?.error
  return msg || fallback
}

