// Admin projects route: mounts the project manager and excludes it from search indexing.
import { createFileRoute } from "@tanstack/react-router";
import { AdminList } from "@/components/gulsags/admin";
import { pageHead } from "@/lib/gulsags/content";
export const Route=createFileRoute("/admin/projects")({head:()=>({meta:[...pageHead("Manage Projects","Secure Gulsaga projects administration.").meta,{name:"robots",content:"noindex"}]}),component:()=> <AdminList resource="projects"/>});
