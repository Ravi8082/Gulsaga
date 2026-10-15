// Private employee records are available only inside the authenticated admin workspace.
import { createFileRoute } from "@tanstack/react-router";
import { EmployeeManager } from "@/components/gulsags/employees";
import { pageHead } from "@/lib/gulsags/content";

export const Route = createFileRoute("/admin/employees")({
  head: () => ({
    meta: [...pageHead("Employees", "Private employee profiles and administration.").meta, { name: "robots", content: "noindex" }],
  }),
  component: EmployeeManager,
});
