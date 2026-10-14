// Application route: loads active opportunities and passes the selected job ID into the verified submission flow.
import { createFileRoute } from "@tanstack/react-router";
import { SubmissionForm } from "@/components/gulsags/forms";
import { pageHead, projects } from "@/lib/gulsags/content";
import { publicQuery } from "@/lib/gulsags/api";
export const Route=createFileRoute("/apply/$jobId")({head:({params})=>pageHead("Opportunity — "+params.jobId,"Discover jobs at Gulsaga."),loader:({context})=>context.queryClient.ensureQueryData(publicQuery("jobs",[])),component:Page});
function Page(){const params=Route.useParams();return <SubmissionForm jobId={params.jobId}/>;}
