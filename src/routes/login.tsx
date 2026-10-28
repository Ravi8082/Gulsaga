// Administrator sign-in route; authentication itself is handled by the external API.
import { createFileRoute } from "@tanstack/react-router";
import { Login } from "@/components/gulsags/forms";
import { pageHead } from "@/lib/gulsags/content";
export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      ...pageHead("Login", "Secure Gulsaga administrator sign in.").meta,
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Login,
});
