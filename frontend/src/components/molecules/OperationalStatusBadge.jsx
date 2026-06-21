import Badge from "../atoms/Badge";
import { OPERATIONAL_STATUS_OPTIONS, findLabel } from "../../constants/schedules";

const TONE_BY_STATUS = {
  waiting: "amber",
  in_progress: "blue",
  completed: "green",
  cancelled: "red",
  postponed: "purple",
};

export default function OperationalStatusBadge({ status }) {
  return (
    <Badge tone={TONE_BY_STATUS[status] ?? "slate"}>
      {findLabel(OPERATIONAL_STATUS_OPTIONS, status)}
    </Badge>
  );
}
