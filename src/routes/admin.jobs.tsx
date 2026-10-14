// Admin jobs route: mounts the shared jobs and internships manager.
import { createFileRoute } from "@tanstack/react-router";
import { AdminList } from "@/components/gulsags/admin";
import { pageHead } from "@/lib/gulsags/content";
export const Route=createFileRoute("/admin/jobs")({head:()=>({meta:[...pageHead("Manage Jobs","Secure Gulsaga jobs administration.").meta,{name:"robots",content:"noindex"}]}),component:()=> <AdminList resource="jobs"/>});
