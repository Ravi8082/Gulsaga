// Project directory route: loads published project data before showing filters and search.
import { createFileRoute } from "@tanstack/react-router";
import { Projects } from "@/components/gulsags/pages";
import { pageHead } from "@/lib/gulsags/content";
import { publicQuery } from "@/lib/gulsags/api";
export const Route = createFileRoute("/projects/")({head:()=>pageHead("Projects","Discover the Gulsaga project ecosystem."),loader:({context})=>context.queryClient.ensureQueryData({...publicQuery("projects"),revalidateIfStale:true}),component: Projects});
