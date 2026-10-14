// Admin audit route: review recorded privileged actions; authorization is enforced by the API.
import { createFileRoute } from "@tanstack/react-router";
import { AdminList } from "@/components/gulsags/admin";
import { pageHead } from "@/lib/gulsags/content";
export const Route=createFileRoute("/admin/audit-logs")({head:()=>({meta:[...pageHead("Manage Audit-Logs","Secure Gulsaga audit-logs administration.").meta,{name:"robots",content:"noindex"}]}),component:()=> <AdminList resource="audit-logs"/>});
