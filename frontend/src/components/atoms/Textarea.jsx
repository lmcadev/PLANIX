import { cx } from "../../utils/classNames";

export default function Textarea({ className, hasError = false, rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      className={cx(
        "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500/30",
        hasError
          ? "border-red-300 focus:border-red-500"
          : "border-slate-200 hover:border-slate-300 focus:border-primary-500",
        className,
      )}
      {...props}
    />
  );
}
