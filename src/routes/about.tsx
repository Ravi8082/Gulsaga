// About route: supplies page metadata and mounts the About page body.
import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/gulsags/about-page";
import { pageHead } from "@/lib/gulsags/content";
export const Route = createFileRoute("/about")({head:()=>pageHead("About","Technology with Purpose. Innovation with Impact."),component: AboutPage});
