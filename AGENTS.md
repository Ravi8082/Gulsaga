<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Preserve the platform TanStack routing/bootstrap; implement new page bodies in JavaScript JSX because the hosted template requires TanStack.
- Keep the separately deployable Express/MySQL application outside the hosted import graph; the preview runtime cannot host the requested Node server.
- All business persistence, authorization, uploads and email belong to the external backend; frontend API errors must never become simulated success.

- Public settings and published content are read through shared TanStack Query options so administration changes affect the public site without local persistence.
- MySQL migrations and SMTP acceptance gates must remain explicitly unverified until exercised against genuine configured services.
