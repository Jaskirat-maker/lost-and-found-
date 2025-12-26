import { motion } from 'framer-motion'

export function Loader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <motion.div
        className="h-10 w-10 rounded-full border-4 border-slate-300 border-t-slate-900 dark:border-slate-700 dark:border-t-slate-100"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      />
    </div>
  )
}

