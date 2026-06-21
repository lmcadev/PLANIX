import { cx } from "../../utils/classNames";

const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0) ?? "";
  const last = lastName?.charAt(0) ?? "";
  return `${first}${last}`.toUpperCase() || "?";
};

export default function Avatar({ firstName, lastName, size = 36, className }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cx(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 font-semibold text-white ring-2 ring-white",
        className,
      )}
    >
      <span style={{ fontSize: Math.max(11, size * 0.36) }}>{getInitials(firstName, lastName)}</span>
    </div>
  );
}
