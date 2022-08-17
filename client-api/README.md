# CLIENT API

This API is in charge of all queries and mutations requested from the client-side, whether it's from internal or external resources.  The logic in this layer should be kept isolated from the rest of the application.  This comes with many benefits, notably:

- It keeps the component logic simple and clean
- It decouples the components from the data to make it easier to maintain and troubleshoot
- It's easily swappable and composable with any method of getting data

## RULES

1. All requests should be added as `client-api/queries/<action>.js`, where `<action>` is a descriptive name after what it does.
2. All queries should be exported from `client-api/index.js`.
    - This allows one-line imports, eg:
        ```js
        import { getThis, getThat, updateThis } from 'client-api'
        ```
3. Any query may have multiple requests if necessary, but avoid excessive HTTP traffic.
