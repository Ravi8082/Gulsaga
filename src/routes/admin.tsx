// Admin layout route: mounts the authenticated dashboard shell around nested admin pages.
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/gulsags/admin";
export const Route=createFileRoute("/admin")({component:AdminShell});
