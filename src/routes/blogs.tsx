// Blog route layout shared by the published article list and article pages.
import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
export const Route=createFileRoute("/blogs")({component:()=> <Outlet/>});
