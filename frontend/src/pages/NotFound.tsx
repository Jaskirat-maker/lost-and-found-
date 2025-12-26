import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="text-5xl font-bold">404</div>
        <h1 className="mt-3 text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          The page you’re looking for doesn’t exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

