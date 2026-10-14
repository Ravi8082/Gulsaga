// Admin route for editing and publishing founder profiles.
import { createFileRoute } from "@tanstack/react-router";
import { AdminList } from "@/components/gulsags/admin";
import { pageHead } from "@/lib/gulsags/content";
export const Route=createFileRoute("/admin/team")({head:()=>({meta:[...pageHead("Manage Founder Profiles","Secure Gulsaga founder profile management.").meta,{name:"robots",content:"noindex"}]}),component:()=> <AdminList resource="team"/>});
