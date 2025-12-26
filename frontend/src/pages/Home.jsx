import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { http } from '../api/http.js'
import { Loader } from '../ui/Loader.jsx'
import ItemCard from '../components/ItemCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getApiErrorMessage } from '../api/errors.js'

export default function Home() {
  const { user } = useAuth()
  const [lost, setLost] = useState(null)
  const [found, setFound] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [lostRes, foundRes] = await Promise.all([
          http.get('/api/items/public', { params: { type: 'LOST' } }),
          http.get('/api/items/public', { params: { type: 'FOUND' } }),
        ])
        if (!alive) return
        setLost(lostRes.data)
        setFound(foundRes.data)
      } catch (e) {
        toast.error(getApiErrorMessage(e, 'Failed to load reports'))
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  return (
    <div>
      <section className="border-b border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="container-page">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Report lost items, return found items—fast.
              </h1>
              <p className="mt-4 text-slate-600 dark:text-slate-300">
                A secure college Lost &amp; Found system for students and the registrar. Submit reports, track status,
                and get notified when a match is found.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {user ? (
                  <>
                    <Link
                      to="/report/lost"
                      className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                    >
                      Report Lost
                    </Link>
                    <Link
                      to="/report/found"
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-900"
                    >
                      Report Found
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                    >
                      Create account
                    </Link>
                    <Link
                      to="/login"
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-900"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="card p-5">
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Students</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  <li>Register with a college email</li>
                  <li>Report lost/found items</li>
                  <li>Track approval + match status</li>
                </ul>
              </div>
              <div className="card p-5">
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Registrar Admin</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  <li>Approve / reject reports</li>
                  <li>Match lost ↔ found items</li>
                  <li>Send email notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Approved reports</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Visible after registrar approval.</p>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="mt-6 grid gap-10">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Lost</h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(lost ?? []).slice(0, 6).map((i) => (
                    <ItemCard key={i.id} item={i} />
                  ))}
                  {(lost ?? []).length === 0 ? (
                    <div className="text-sm text-slate-600 dark:text-slate-300">No approved lost reports yet.</div>
                  ) : null}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Found</h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(found ?? []).slice(0, 6).map((i) => (
                    <ItemCard key={i.id} item={i} />
                  ))}
                  {(found ?? []).length === 0 ? (
                    <div className="text-sm text-slate-600 dark:text-slate-300">No approved found reports yet.</div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

