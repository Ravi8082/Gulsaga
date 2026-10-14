// Blog directory route for published company articles.
import { createFileRoute } from "@tanstack/react-router";
import { Blogs } from "@/components/gulsags/pages";
import { pageHead } from "@/lib/gulsags/content";
import { publicQuery } from "@/lib/gulsags/api";

export const Route=createFileRoute("/blogs/")({
  head:()=>pageHead("Blogs","Ideas, perspectives and updates from Gulsaga."),
  loader:({context})=>context.queryClient.ensureQueryData(publicQuery("blogs")),
  component:Blogs,
});
