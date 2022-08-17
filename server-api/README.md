# SERVER API

A typical server may require heavy logic with many files and subfolders.  With Next.js, API routes are automatically handled in the `pages/api/` directory, so we should remain true to that goal by keeping the files in that area focused on *routes*, while this folder contains all the abstract code.  This is especially helpful for GraphQL structures because it only has a single endpoint, but inevitably spans across multiple files.

## RULES

1. All handlers for API methods should be contained in the `server-api/business-logic` folder.
2. All code which directly interacts with the database should be contained in the `server-api/data-access` folder.

Keeping these layers separate allows us to easily maintain and/or swap out pieces later on.
