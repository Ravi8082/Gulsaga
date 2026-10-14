// Terms route: renders the shared legal-content page in terms-of-use mode.
import { createFileRoute } from "@tanstack/react-router";
import { Legal } from "@/components/gulsags/pages";
import { pageHead } from "@/lib/gulsags/content";
export const Route=createFileRoute("/terms")({head:()=>pageHead("Terms of Use","Information about using Gulsaga and submitting personal details."),component:()=> <Legal terms={true}/>});
