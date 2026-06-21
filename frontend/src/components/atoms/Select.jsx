import { ChevronDown } from "lucide-react";
import { cx } from "../../utils/classNames";

export default function Select({ className, hasError = false, options = [], placeholder, ...props }) {
  return (
    <div className="relative">
      <select
        className={cx(
          "w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-9 text-sm text-slate-900 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500/30",
          hasError
            ? "border-red-300 focus:border-red-500"
            : "border-slate-200 hover:border-slate-300 focus:border-primary-500",
          className,
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
