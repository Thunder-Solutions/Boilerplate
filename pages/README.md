# PAGES

As per the [Next.js documentation](https://nextjs.org/docs/basic-features/pages), the files in this directory correspond to route names, with the exception of a few special cases.

- [`_app.js`](https://nextjs.org/docs/advanced-features/custom-app) is the entrypoint for every single landing page, and will run prior to any page logic.
- [`_document.js`](https://nextjs.org/docs/advanced-features/custom-document) gives us access to top-level tags like `<html>`, `<head>`, and `<body>`.  It may be used for many reasons, but primarily it's used here because [stylesheets are likely to misbehave in the `next/head` component](https://nextjs.org/docs/messages/no-stylesheets-in-head-component).
- [`api/`](https://nextjs.org/docs/api-routes/introduction) and all its contents represent Node.js endpoints for handling requests.

## Rules

1. Avoid adding any bare HTML markup at this layer.  Pages should be made up of only components, and markup should be contained within those.
2. No CSS at the page level.  In relation to rule 1, pages should only contain components, and all styles should be handled by components.
3. Try not to bloat the pages with excessive logic.  Reusable utilities should be abstracted away into the `utilities/` folder, and if it only concerns certain components, isolate the logic down the tree as specifically as possible.  Page logic should mostly concern data fetching via the `client-api` queries, if anything.  [Read more about `getInitialProps` in the documentation](https://nextjs.org/docs/api-reference/data-fetching/get-initial-props).
