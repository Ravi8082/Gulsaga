// Innovation route: publishes metadata and mounts the innovation content page.
import { createFileRoute } from "@tanstack/react-router";
import { Innovation } from "@/components/gulsags/pages";
import { pageHead } from "@/lib/gulsags/content";
export const Route = createFileRoute("/innovation")({head:()=>pageHead("Innovation","Explore practical innovation and purposeful technology."),component: Innovation});
