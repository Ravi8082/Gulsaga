// Admin overview route: dashboard metrics and authorized shortcuts.
import { createFileRoute } from "@tanstack/react-router";
import { AdminOverview } from "@/components/gulsags/admin";
import { pageHead } from "@/lib/gulsags/content";
export const Route=createFileRoute("/admin/")({head:()=>({...pageHead("Administration Overview","Gulsaga administration workspace."),meta:[...pageHead("Administration Overview","Gulsaga administration workspace.").meta,{name:"robots",content:"noindex"}]}),component:AdminOverview});
