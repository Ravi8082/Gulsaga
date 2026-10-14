// Home route: preloads projects and services into the shared query cache before rendering the homepage.
import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/components/gulsags/site";
import { pageHead, description, services } from "@/lib/gulsags/content";
import { publicQuery } from '@/lib/gulsags/api';
export const Route = createFileRoute("/")({ head: () => pageHead("Ideas. Technology. Impact.", description), loader:({context})=>Promise.all([context.queryClient.ensureQueryData(publicQuery('projects'),{revalidateIfStale:true}),context.queryClient.ensureQueryData(publicQuery('services',services))]),component: Home });
