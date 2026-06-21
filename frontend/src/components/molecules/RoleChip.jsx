import Badge from "../atoms/Badge";

export default function RoleChip({ role }) {
  return <Badge tone="purple">{role.name}</Badge>;
}
