// Career detail route: loads current openings and selects the requested posting by slug.
import { createFileRoute } from "@tanstack/react-router";
import { JobDetail } from "@/components/gulsags/pages";
import { pageHead, projects } from "@/lib/gulsags/content";
import { publicQuery } from "@/lib/gulsags/api";
export const Route=createFileRoute("/careers/$slug")({head:({params})=>pageHead("Opportunity — "+params.slug,"Discover jobs at Gulsaga."),loader:({context})=>context.queryClient.ensureQueryData(publicQuery("jobs",[])),component:Page});
function Page(){const params=Route.useParams();return <JobDetail slug={params.slug}/>;}
