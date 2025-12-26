import StatusBadge from './StatusBadge.jsx'

export default function ItemCard({ item }) {
  return (
    <div className="card overflow-hidden">
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.itemName} className="h-44 w-full object-cover" />
      ) : (
        <div className="h-44 w-full bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900" />
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
              {item.type} • {item.category}
            </div>
            <h3 className="mt-1 text-lg font-semibold">{item.itemName}</h3>
          </div>
          <StatusBadge status={item.status} />
        </div>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Location</div>
            <div className="truncate">{item.location}</div>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Date</div>
            <div>{item.date}</div>
          </div>
        </div>

        {item.matchedItemId ? (
          <div className="mt-3 text-sm text-indigo-700 dark:text-indigo-300">Matched with #{item.matchedItemId}</div>
        ) : null}
      </div>
    </div>
  )
}

