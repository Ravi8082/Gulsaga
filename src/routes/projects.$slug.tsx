// Project detail route: loads the shared project collection and selects the URL's slug.
import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetail } from "@/components/gulsags/pages";
import { pageHead } from "@/lib/gulsags/content";
import { publicQuery } from "@/lib/gulsags/api";
export const Route=createFileRoute("/projects/$slug")({head:({params})=>pageHead("Project — "+params.slug,"Discover projects at Gulsaga."),loader:({context})=>context.queryClient.ensureQueryData({...publicQuery("projects"),revalidateIfStale:true}),component:Page});
function Page(){const params=Route.useParams();return <ProjectDetail slug={params.slug}/>;}
