import Card from "../atoms/Card";
import { cx } from "../../utils/classNames";

const TONE_TEXT = {
  slate: "text-slate-900",
  green: "text-green-600",
  red: "text-red-600",
  amber: "text-amber-600",
  blue: "text-blue-600",
};

const TONE_CHIP = {
  slate: "bg-slate-100 text-slate-500",
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-blue-50 text-blue-600",
};

export default function StatCard({ label, value, tone = "slate", icon: Icon }) {
  return (
    <Card className="transition-shadow duration-150 hover:shadow-popover">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className={cx("mt-2 text-3xl font-bold tracking-tight", TONE_TEXT[tone])}>{value}</p>
        </div>
        {Icon && (
          <div className={cx("flex h-10 w-10 items-center justify-center rounded-xl", TONE_CHIP[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </Card>
  );
}
