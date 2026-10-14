// Admin accounts route: super-admin UI for managing administrator accounts and permissions.
import { createFileRoute } from "@tanstack/react-router";
import { AdminList } from "@/components/gulsags/admin";
import { pageHead } from "@/lib/gulsags/content";
export const Route=createFileRoute("/admin/admins")({head:()=>({meta:[...pageHead("Manage Admins","Secure Gulsaga admins administration.").meta,{name:"robots",content:"noindex"}]}),component:()=> <AdminList resource="admins"/>});
