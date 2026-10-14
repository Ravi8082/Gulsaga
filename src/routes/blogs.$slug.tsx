// Blog article route; only published slugs resolve through the public API.
import { createFileRoute } from "@tanstack/react-router";
import { BlogArticle } from "@/components/gulsags/pages";
import { pageHead } from "@/lib/gulsags/content";
import { publicQuery } from "@/lib/gulsags/api";

function BlogArticleRoute() {
  const { slug } = Route.useParams();
  return <BlogArticle slug={slug} />;
}

export const Route = createFileRoute("/blogs/$slug")({
  head: ({ loaderData }) =>
    pageHead(
      loaderData?.title || "Gulsaga Journal",
      loaderData?.excerpt || "Read the latest article from Gulsaga.",
    ),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(publicQuery(`blogs/${params.slug}`)),
  component: BlogArticleRoute,
});
