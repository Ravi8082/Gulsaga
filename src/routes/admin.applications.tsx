// Admin applications route: mounts recruitment review and status-management tools.
import { createFileRoute } from "@tanstack/react-router";
import { AdminList } from "@/components/gulsags/admin";
import { pageHead } from "@/lib/gulsags/content";
export const Route=createFileRoute("/admin/applications")({head:()=>({meta:[...pageHead("Manage Applications","Secure Gulsaga applications administration.").meta,{name:"robots",content:"noindex"}]}),component:()=> <AdminList resource="applications"/>});
