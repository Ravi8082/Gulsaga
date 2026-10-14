// Admin email route: monitor outbox notifications and request retries for failed messages.
import { createFileRoute } from "@tanstack/react-router";
import { AdminList } from "@/components/gulsags/admin";
import { pageHead } from "@/lib/gulsags/content";
export const Route=createFileRoute("/admin/emails")({head:()=>({meta:[...pageHead("Manage Emails","Secure Gulsaga emails administration.").meta,{name:"robots",content:"noindex"}]}),component:()=> <AdminList resource="emails"/>});
