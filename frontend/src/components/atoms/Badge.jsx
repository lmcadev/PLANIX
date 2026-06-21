import { cx } from "../../utils/classNames";

const TONE_CLASSES = {
  slate: "bg-slate-100 text-slate-600 ring-slate-500/10",
  green: "bg-green-50 text-green-700 ring-green-600/10",
  red: "bg-red-50 text-red-700 ring-red-600/10",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/10",
  blue: "bg-blue-50 text-blue-700 ring-blue-600/10",
  purple: "bg-purple-50 text-purple-700 ring-purple-600/10",
};

export default function Badge({ children, tone = "slate", className }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
