// Careers directory route: preloads active job and internship postings.
import { createFileRoute } from "@tanstack/react-router";
import { Careers } from "@/components/gulsags/pages";
import { pageHead } from "@/lib/gulsags/content";
import { publicQuery } from "@/lib/gulsags/api";
import { projects, services } from "@/lib/gulsags/content";
export const Route = createFileRoute("/careers/")({head:()=>pageHead("Careers","Explore careers and internships at Gulsaga."),loader:({context})=>context.queryClient.ensureQueryData(publicQuery("jobs",[])),component: Careers});
