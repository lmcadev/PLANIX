export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-primary-300/30 blur-3xl" />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200/70 bg-white p-8 shadow-popover animate-fade-in">
        <div className="flex flex-col items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-lg font-bold text-white shadow-soft">
            P
          </div>
          <p className="mt-3 text-xl font-bold tracking-tight text-slate-900">PLANIX</p>
          <p className="mt-1 text-center text-sm text-slate-500">{subtitle}</p>
        </div>
        <h1 className="mt-7 text-lg font-semibold text-slate-900">{title}</h1>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
