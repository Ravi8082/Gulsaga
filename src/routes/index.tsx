// Home route: preload public content used by the homepage into the shared query cache.
import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/components/gulsags/site";
import { pageHead, description, services } from "@/lib/gulsags/content";
import { publicQuery } from "@/lib/gulsags/api";
export const Route = createFileRoute("/")({
  head: () => pageHead("Web Development & Software Company", description),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(publicQuery("projects"), {
        revalidateIfStale: true,
      }),
      context.queryClient.ensureQueryData(publicQuery("services", services)),
      context.queryClient.ensureQueryData(publicQuery("jobs", [])),
    ]),
  component: Home,
});
