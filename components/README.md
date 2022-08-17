# COMPONENTS

Components bring a new kind of front-end architecture to light, where concerns are no longer separated by layers of content-style-script, but rather by dozens of tiny composable parts that can be combined to create larger things.  Each tiny part has a shared scope mixing content, styles, and scripts, but despite intuition, that doesn't make it any less disciplined.

For a detailed overview of best practices, read the [component development guidelines](./component-development-guidelines.md).

## RULES

1. Each component should be provided its own folder to contain both its code and css module as well as any other necessary abstractions related to that component.
    - CSS Modules encapsulate our styles so we can avoid global impact from tweaks intended for a very specific use case.  *This does not necessarily mean that we will have repetitious styles.*  We can keep styles to a minimum by utilizing component composition.
    For example:
      >components/card/card.js
      ```jsx
      import css from './card.module.css'
      const Card = ({ children, className = '', ...props }) => (
        <article className={`${css.card} ${className}`}>
          {children}
        </article>
      )
      ```
      >components/author/author.js
      ```jsx
      import Card from '../card/card'
      import css from './authorBio.module.css'
      const AuthorBio = ({ children, title, ...props }) => (
        <Card className={css.author}>
          <h2>{title}</h2>
          <p>{children}</p>
        </Card>
      )
      ```
      The `<AuthorBio>` component above reuses the style of `<Card>` while composing additional styles on top.
2. Each component should be exported from `components/index.js` to allow for single-line imports, eg:
    ```js
    import { Card, AuthorBio, ArticlePreview } from 'components'
    ```
3. Any component that imports other components should **not** import from the `components/index` file as in the example above.  This is because it will create a circular dependency and potentially cause issues with the order in which the compiler imports modules.  Imports from this layer are only to be used from outside this folder, namely the `pages/` directory.

## FEATURES

1. Within the dev container, a helpful bash script is provided for generating components.  From VSCode, open a new terminal with ``ctrl+` ``and type the following command.
    ```
    next-component demo
    ```
    This command will generate the following files.
    >components/demo/demo.js
    ```jsx
    import css from './demo.module.css'

    const Demo = ({ children }) => {
      return (
        <div className={css.demo}>{children}</div>
      )
    }

    export default Demo
    ```
    >components/demo/demo.module.css
    ```css
    .demo {
      
    }
    ```
    Additionally, the component will automatically be added to the list of exports in `components/index.js`.
    ```js
    export { default as Demo } from './demo/demo'
    ```
    The `next-component` command is also aliased as simply `nc`, making new components very easy to add quickly.
    ```
    nc demo
    ```
