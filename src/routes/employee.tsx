import { createFileRoute } from "@tanstack/react-router";
import { EmployeeDashboard } from "@/components/gulsags/employee-dashboard";
import { pageHead } from "@/lib/gulsags/content";

export const Route = createFileRoute("/employee")({
  head: () => ({
    meta: [...pageHead("Employee Portal", "Private Gulsaga employee workspace.").meta, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: EmployeeDashboard,
});
