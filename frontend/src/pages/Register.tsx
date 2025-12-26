import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../api/errors'

const schema = z
  .object({
    name: z.string().min(2, 'Name is required').max(120),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Minimum 8 characters'),
    confirmPassword: z.string().min(8),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export function Register() {
  const { register: doRegister } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      await doRegister(values.name, values.email, values.password)
      navigate('/')
    } catch (e: unknown) {
      toast.error(getApiErrorMessage(e, 'Registration failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-md">
        <div className="card p-6">
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Registration requires a college email.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="text-sm font-semibold">Full name</label>
              <input
                {...register('name')}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
                placeholder="Jane Student"
              />
              {errors.name ? <div className="mt-1 text-sm text-rose-600">{errors.name.message}</div> : null}
            </div>
            <div>
              <label className="text-sm font-semibold">Email</label>
              <input
                {...register('email')}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
                placeholder="you@college.edu"
              />
              {errors.email ? <div className="mt-1 text-sm text-rose-600">{errors.email.message}</div> : null}
            </div>
            <div>
              <label className="text-sm font-semibold">Password</label>
              <input
                type="password"
                {...register('password')}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
              />
              {errors.password ? <div className="mt-1 text-sm text-rose-600">{errors.password.message}</div> : null}
            </div>
            <div>
              <label className="text-sm font-semibold">Confirm password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
              />
              {errors.confirmPassword ? (
                <div className="mt-1 text-sm text-rose-600">{errors.confirmPassword.message}</div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              {submitting ? 'Creating…' : 'Register'}
            </button>
          </form>

          <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            Already have an account?{' '}
            <Link className="font-semibold text-slate-900 underline dark:text-slate-100" to="/login">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

