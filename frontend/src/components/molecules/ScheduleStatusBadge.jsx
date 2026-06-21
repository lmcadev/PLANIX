import Badge from "../atoms/Badge";
import { SCHEDULE_STATUS_OPTIONS, findLabel } from "../../constants/schedules";

const TONE_BY_STATUS = {
  available: "green",
  busy: "blue",
  cancelled: "red",
  completed: "slate",
};

export default function ScheduleStatusBadge({ status }) {
  return (
    <Badge tone={TONE_BY_STATUS[status] ?? "slate"}>
      {findLabel(SCHEDULE_STATUS_OPTIONS, status)}
    </Badge>
  );
}
