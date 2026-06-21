import { cx } from "../../utils/classNames";

export default function Input({ className, hasError = false, icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      )}
      <input
        className={cx(
          "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500/30",
          Icon && "pl-10",
          hasError
            ? "border-red-300 focus:border-red-500"
            : "border-slate-200 hover:border-slate-300 focus:border-primary-500",
          className,
        )}
        {...props}
      />
    </div>
  );
}
