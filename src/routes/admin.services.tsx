// Admin services route: mounts the shared service editor/list view.
import { createFileRoute } from "@tanstack/react-router";
import { AdminList } from "@/components/gulsags/admin";
import { pageHead } from "@/lib/gulsags/content";
export const Route=createFileRoute("/admin/services")({head:()=>({meta:[...pageHead("Manage Services","Secure Gulsaga services administration.").meta,{name:"robots",content:"noindex"}]}),component:()=> <AdminList resource="services"/>});
