// Contact route: preloads active-job data for the shared enquiry form and its application variant.
import { createFileRoute } from "@tanstack/react-router";
import { SubmissionForm } from "@/components/gulsags/forms";
import { pageHead } from "@/lib/gulsags/content";
import { publicQuery } from "@/lib/gulsags/api";
import { projects, services } from "@/lib/gulsags/content";
export const Route = createFileRoute("/contact")({head:()=>pageHead("Contact","Start a conversation with Gulsaga."),loader:({context})=>context.queryClient.ensureQueryData(publicQuery("jobs",[])),component: () => <SubmissionForm />});
