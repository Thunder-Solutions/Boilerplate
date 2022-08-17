# UTILITIES

Oftentimes, functionality can be split into small reusable pieces.  That's the spirit of this layer - not simply abstraction for abstraction's sake.  If a function cannot potentially be reused, it does not belong here.  At least, not without swapping out the specificity for more general application.

## RULES

1. Each file in `utilities/` represents a logical grouping of utilities, mostly used just to make it easy to locate the code you're looking for.
2. Each file's contents should be exported from `utilities/index.js` to support one line imports from other files, eg:
    ```js
    import { checkType, mergeDeep, useDebounce } from 'utilities'
    ```
