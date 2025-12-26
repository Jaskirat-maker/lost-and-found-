import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { http } from '../api/http.js'
import { getApiErrorMessage } from '../api/errors.js'
import ItemCard from '../components/ItemCard.jsx'
import { Loader } from '../ui/Loader.jsx'

export default function MyReports() {
  const [items, setItems] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await http.get('/api/items/me')
      setItems(res.data)
    } catch (e) {
      toast.error(getApiErrorMessage(e, 'Failed to load your reports'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="container-page py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Reports</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Track approval and match status for your reports.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(items ?? []).map((i) => (
            <ItemCard key={i.id} item={i} />
          ))}
          {(items ?? []).length === 0 ? (
            <div className="text-sm text-slate-600 dark:text-slate-300">No reports yet.</div>
          ) : null}
        </div>
      )}
    </div>
  )
}

