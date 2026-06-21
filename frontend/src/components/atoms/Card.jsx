import { cx } from "../../utils/classNames";

export default function Card({ children, className }) {
  return (
    <div className={cx("rounded-2xl border border-slate-200/70 bg-white p-6 shadow-card", className)}>
      {children}
    </div>
  );
}
