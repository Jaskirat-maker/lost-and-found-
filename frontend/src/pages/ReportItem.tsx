import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { http } from '../api/http'
import { getApiErrorMessage } from '../api/errors'
import type { ItemType } from '../types'

const schema = z.object({
  itemName: z.string().min(2, 'Item name is required').max(255),
  category: z.string().min(2, 'Category is required').max(120),
  description: z.string().min(10, 'Add a bit more detail').max(4000),
  location: z.string().min(2, 'Location is required').max(255),
  date: z.string().min(10, 'Date is required'),
})

type FormValues = z.infer<typeof schema>

const categories = ['Electronics', 'ID / Card', 'Clothing', 'Books', 'Keys', 'Wallet', 'Bag', 'Other']

export function ReportItem() {
  const params = useParams()
  const navigate = useNavigate()
  const type = (params.type?.toUpperCase() as ItemType) || 'LOST'

  const title = type === 'FOUND' ? 'Report Found Item' : 'Report Lost Item'

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { category: categories[0] },
  })

  const description = watch('description')
  const descCount = useMemo(() => (description ? description.length : 0), [description])

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      let imageUrl: string | undefined = undefined
      if (file) {
        const fd = new FormData()
        fd.append('file', file)
        const up = await http.post<{ url: string }>('/api/files/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        imageUrl = up.data.url
      }

      await http.post('/api/items', {
        ...values,
        date: values.date,
        imageUrl,
        type,
      })

      toast.success('Report submitted (pending approval)')
      navigate('/my-reports')
    } catch (e: unknown) {
      toast.error(getApiErrorMessage(e, 'Failed to submit report'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl">
        <div className="card p-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Reports are reviewed by the registrar before being publicly visible.
          </p>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold">Item name</label>
                <input
                  {...register('itemName')}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
                  placeholder="Black umbrella"
                />
                {errors.itemName ? <div className="mt-1 text-sm text-rose-600">{errors.itemName.message}</div> : null}
              </div>
              <div>
                <label className="text-sm font-semibold">Category</label>
                <select
                  {...register('category')}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category ? <div className="mt-1 text-sm text-rose-600">{errors.category.message}</div> : null}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">Description</label>
              <textarea
                {...register('description')}
                rows={5}
                className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
                placeholder="Add identifying details (brand, color, marks, etc.)"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{errors.description ? <span className="text-rose-600">{errors.description.message}</span> : null}</span>
                <span>{descCount}/4000</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold">Location</label>
                <input
                  {...register('location')}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
                  placeholder="Library, 2nd floor"
                />
                {errors.location ? <div className="mt-1 text-sm text-rose-600">{errors.location.message}</div> : null}
              </div>
              <div>
                <label className="text-sm font-semibold">{type === 'FOUND' ? 'Date found' : 'Date lost'}</label>
                <input
                  type="date"
                  {...register('date')}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
                />
                {errors.date ? <div className="mt-1 text-sm text-rose-600">{errors.date.message}</div> : null}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 md:items-center">
              <div>
                <label className="text-sm font-semibold">Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null
                    setFile(f)
                    if (preview) URL.revokeObjectURL(preview)
                    setPreview(f ? URL.createObjectURL(f) : null)
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                />
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">JPG/PNG up to ~5MB.</div>
              </div>
              <div className="flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-28 w-28 rounded-2xl object-cover" />
                ) : (
                  <div className="h-28 w-28 rounded-2xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950" />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              {submitting ? 'Submitting…' : 'Submit report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

