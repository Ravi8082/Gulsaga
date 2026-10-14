// Innovation route: publishes metadata and mounts the innovation content page.
import { createFileRoute } from "@tanstack/react-router";
import { Innovation } from "@/components/gulsags/pages";
import { pageHead } from "@/lib/gulsags/content";
import { publicQuery } from "@/lib/gulsags/api";
export const Route = createFileRoute("/innovation")({
  head: () =>
    pageHead(
      "Innovation",
      "Explore practical innovation through people-first design and useful technology.",
    ),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(publicQuery("projects")),
  component: Innovation,
});
