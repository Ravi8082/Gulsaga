// Admin exports route: request allowlisted XLSX files for permitted resources.
import { createFileRoute } from "@tanstack/react-router";
import { AdminExports } from "@/components/gulsags/admin";
import { pageHead } from "@/lib/gulsags/content";
export const Route=createFileRoute("/admin/exports")({head:()=>({meta:[...pageHead("Manage Exports","Secure Gulsaga exports administration.").meta,{name:"robots",content:"noindex"}]}),component:()=> <AdminExports/>});
