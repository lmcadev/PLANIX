import { cx } from "../../utils/classNames";

export default function Checkbox({ label, className, ...props }) {
  return (
    <label className={cx("inline-flex cursor-pointer items-center gap-2.5 text-sm text-slate-700", className)}>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-slate-300 text-primary-600 transition-colors focus:ring-2 focus:ring-primary-500/30 focus:ring-offset-0"
        {...props}
      />
      {label}
    </label>
  );
}
