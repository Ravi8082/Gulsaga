// Admin route for composing, editing, and publishing blog posts.
import { createFileRoute } from "@tanstack/react-router";
import { AdminList } from "@/components/gulsags/admin";
import { pageHead } from "@/lib/gulsags/content";
export const Route=createFileRoute("/admin/blogs")({head:()=>({meta:[...pageHead("Manage Blogs","Secure Gulsaga blog management.").meta,{name:"robots",content:"noindex"}]}),component:()=> <AdminList resource="blogs"/>});
