export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-10 dark:border-slate-800">
      <div className="container-page flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="font-medium text-slate-900 dark:text-slate-100">College Lost &amp; Found</span> — a secure
          portal for reporting and recovering items.
        </div>
        <div>© {new Date().getFullYear()} Registrar Office</div>
      </div>
    </footer>
  )
}

