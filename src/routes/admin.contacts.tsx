// Admin contacts route: mounts enquiry review and status-management tools.
import { createFileRoute } from "@tanstack/react-router";
import { AdminList } from "@/components/gulsags/admin";
import { pageHead } from "@/lib/gulsags/content";
export const Route=createFileRoute("/admin/contacts")({head:()=>({meta:[...pageHead("Manage Contacts","Secure Gulsaga contacts administration.").meta,{name:"robots",content:"noindex"}]}),component:()=> <AdminList resource="contacts"/>});
