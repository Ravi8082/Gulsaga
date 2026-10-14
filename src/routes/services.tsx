// Services route: preloads published services using the shared public query options.
import { createFileRoute } from "@tanstack/react-router";
import { Services } from "@/components/gulsags/pages";
import { pageHead } from "@/lib/gulsags/content";
import { publicQuery } from "@/lib/gulsags/api";
import { projects, services } from "@/lib/gulsags/content";
export const Route = createFileRoute("/services")({head:()=>pageHead("Services","Explore purposeful web development, custom software, UI/UX design and digital platforms."),loader:({context})=>context.queryClient.ensureQueryData(publicQuery("services",services)),component: Services});
