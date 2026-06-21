import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cx } from "../../utils/classNames";

const TONE_CONFIG = {
  error: {
    classes: "bg-red-50 text-red-700 border-red-200",
    icon: AlertTriangle,
  },
  success: {
    classes: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
  info: {
    classes: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Info,
  },
};

export default function Alert({ children, tone = "info", className }) {
  if (!children) return null;
  const { classes, icon: Icon } = TONE_CONFIG[tone];
  return (
    <div className={cx("flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm", classes, className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
