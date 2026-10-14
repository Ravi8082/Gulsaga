// Admin settings route: edits shared website copy, contact details, imagery, and verified links.
import { createFileRoute } from "@tanstack/react-router";
import { AdminSettings } from "@/components/gulsags/admin";
import { pageHead } from "@/lib/gulsags/content";
export const Route=createFileRoute("/admin/settings")({head:()=>({meta:[...pageHead("Manage Settings","Secure Gulsaga settings administration.").meta,{name:"robots",content:"noindex"}]}),component:()=> <AdminSettings/>});
