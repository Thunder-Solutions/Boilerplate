# LOCALES

The locales folder is intended for two major purposes:

1. Preparing projects for the future possibility that there will be translations to other languages.
2. Separating content from component logic.
    - This will be especially helpful in the event that this layer is swapped out for a CMS.  Having all the content contained to one layer will make sure we're well-prepared.

## RULES

1. The folder and file structure is assumed to match the following pattern, so the API fetches data properly.
    - `locales/<group>/<id>/<locale>.json`
    - The `<group>` directory should contain many resources related to the same thing, like "page".
    - The `<id>` directory may contain multiple translations for the same resource, like "home".
    - `<locale>` follows the convention of `languageCode-countryCode` such as `en-US`.  For more information, refer to the lists of [ISO 639 language codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) and [ISO 3166 country codes](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
2. The exception to the above rule is the `locales/global` folder, which contains no subfolders, only the `<locale>.json` files.  As the name suggests, this is all the global content which should *always* be available, such as header and footer text.
3. The structure of each JSON file is somewhat arbitrary, as long as it isn't nested too deeply.  Try to stay as flat as possible.  Keys should be simple names, while values should represent the text content (or URLs) of that translation.
4. If multiple translations are available, the structure of each translation should be identical.  Any fields not filled out will default to the values found in the `en-US.json` file.

## FEATURES

1. Markdown syntax may be used in conjunction with the `<Markdown>` component.
2. The `locales/localeContext.js` file exports a React `createContext()` result, which is provided to all components by the `pages/_app.js` file.  It contains all the data in the `global/<locale>.json` file, and serves as a convenient way to access the text content without [prop-drilling](https://blogs.perficient.com/2021/12/03/understanding-react-context-and-property-prop-drilling/).
3. The `locales/variables.js` file is a mapping of computed values which can be used inside the text of any `<locale>.json` file.  The outermost keys correspond with the `<locale>`, while the values represent an object key-value mapping for the variables.
    >locales/variables.js
    ```js
    const variables = {
    'en-US': {
      year: new Date().getFullYear(),
    },
    }
    ```
    >locales/global/en-US.json
    ```json
    {
      "copyright": "© Thunder Solutions LLC {year} – ALL RIGHTS RESERVED"
    }
    ```
