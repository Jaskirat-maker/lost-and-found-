import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { http } from '../api/http.js'
import { getApiErrorMessage } from '../api/errors.js'
import StatusBadge from '../components/StatusBadge.jsx'
import { Modal } from '../ui/Modal.jsx'
import { Loader } from '../ui/Loader.jsx'

export default function AdminDashboard() {
  const [items, setItems] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')

  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectId, setRejectId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const [matchOpen, setMatchOpen] = useState(false)
  const [lostId, setLostId] = useState('')
  const [foundId, setFoundId] = useState('')

  const params = useMemo(() => {
    const p = {}
    if (status) p.status = status
    if (type) p.type = type
    return p
  }, [status, type])

  const load = async () => {
    setLoading(true)
    try {
      const res = await http.get('/api/admin/items', { params })
      setItems(res.data)
    } catch (e) {
      toast.error(getApiErrorMessage(e, 'Failed to load admin items'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, type])

  const approve = async (id) => {
    try {
      await http.put(`/api/admin/items/${id}/approve`)
      toast.success('Approved')
      load()
    } catch (e) {
      toast.error(getApiErrorMessage(e, 'Approve failed'))
    }
  }

  const openReject = (id) => {
    setRejectId(id)
    setRejectReason('')
    setRejectOpen(true)
  }

  const reject = async () => {
    if (!rejectId) return
    try {
      await http.put(`/api/admin/items/${rejectId}/reject`, { reason: rejectReason || undefined })
      toast.success('Rejected')
      setRejectOpen(false)
      load()
    } catch (e) {
      toast.error(getApiErrorMessage(e, 'Reject failed'))
    }
  }

  const match = async () => {
    if (!lostId || !foundId) {
      toast.error('Provide both lost and found IDs')
      return
    }
    try {
      await http.post('/api/admin/match', { lostItemId: Number(lostId), foundItemId: Number(foundId) })
      toast.success('Matched')
      setMatchOpen(false)
      setLostId('')
      setFoundId('')
      load()
    } catch (e) {
      toast.error(getApiErrorMessage(e, 'Match failed'))
    }
  }

  return (
    <div className="container-page py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Review reports, approve/reject, and match lost ↔ found items.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
          >
            <option value="">All statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="MATCHED">MATCHED</option>
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
          >
            <option value="">All types</option>
            <option value="LOST">LOST</option>
            <option value="FOUND">FOUND</option>
          </select>
          <button
            type="button"
            onClick={() => setMatchOpen(true)}
            className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Match items
          </button>
          <button
            type="button"
            onClick={load}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(items ?? []).map((i) => (
                  <tr key={i.id} className="border-b border-slate-200 last:border-0 dark:border-slate-800">
                    <td className="px-4 py-3 font-mono text-xs">{i.id}</td>
                    <td className="px-4 py-3 font-semibold">{i.type}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{i.itemName}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{i.category}</div>
                    </td>
                    <td className="px-4 py-3">{i.location}</td>
                    <td className="px-4 py-3">{i.date}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={i.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => approve(i.id)}
                          disabled={i.status !== 'PENDING'}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-40"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => openReject(i.id)}
                          disabled={i.status !== 'PENDING'}
                          className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-40"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (i.type === 'LOST') setLostId(String(i.id))
                            if (i.type === 'FOUND') setFoundId(String(i.id))
                            setMatchOpen(true)
                          }}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
                        >
                          Use for match
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(items ?? []).length === 0 ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-slate-600 dark:text-slate-300" colSpan={7}>
                      No items found for the current filter.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={rejectOpen}
        title={rejectId ? `Reject report #${rejectId}` : 'Reject report'}
        onClose={() => setRejectOpen(false)}
      >
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold">Reason (optional)</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
              placeholder="E.g. missing required details"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRejectOpen(false)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={reject}
              className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-500"
            >
              Reject
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={matchOpen} title="Match items" onClose={() => setMatchOpen(false)}>
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">Lost item ID</label>
              <input
                inputMode="numeric"
                value={lostId}
                onChange={(e) => setLostId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
                placeholder="e.g. 12"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Found item ID</label>
              <input
                inputMode="numeric"
                value={foundId}
                onChange={(e) => setFoundId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
                placeholder="e.g. 19"
              />
            </div>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Tip: click “Use for match” on any row to populate an ID.
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setMatchOpen(false)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={match}
              className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Match
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

