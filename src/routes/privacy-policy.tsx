// Privacy policy route: renders the shared legal-content page in privacy mode.
import { createFileRoute } from "@tanstack/react-router";
import { Legal } from "@/components/gulsags/pages";
import { pageHead } from "@/lib/gulsags/content";
export const Route=createFileRoute("/privacy-policy")({head:()=>pageHead("Privacy Policy","Information about using Gulsaga and submitting personal details."),component:()=> <Legal terms={false}/>});
