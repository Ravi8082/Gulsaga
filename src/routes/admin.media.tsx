// Admin media route: manage private uploads and explicitly published public-site images.
import { createFileRoute } from "@tanstack/react-router";
import { AdminList } from "@/components/gulsags/admin";
import { pageHead } from "@/lib/gulsags/content";
export const Route=createFileRoute("/admin/media")({head:()=>({meta:[...pageHead("Manage Media","Secure Gulsaga media administration.").meta,{name:"robots",content:"noindex"}]}),component:()=> <AdminList resource="media"/>});
