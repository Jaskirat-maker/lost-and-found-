import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean
  title?: string
  children: ReactNode
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
            initial={{ y: 16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {(title ?? '').length > 0 ? (
              <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
            ) : null}
            <div className="px-5 py-4">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

