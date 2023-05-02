# BOILERPLATE THEME

This project is intended to be customized and reused as a ready-made website template.  It includes fundamental implementations and features, reducing future repetitive set-up so you can hit the ground running with new projects.

Each folder contains a `README.md` file which should be reviewed before contributing, and which contains standards we should be reviewing against when approving or denying pull requests.

---

## TECH STACK

- [Docker](https://www.docker.com) to maintain consistency with all environments
- [TypeScript](https://www.typescriptlang.org/) to provide better tooling and avoid common errors
- [Next.js](https://nextjs.org/) (React.js + Node.js)
- [Jest](https://jestjs.io/)
- [ESLint](https://eslint.org/) based on [StandardJS](https://standardjs.com/) rules with some customizations
- [Husky](https://typicode.github.io/husky/#/) (runs linters and tests on commit)
- [Mongo](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/docs/)
- [Apollo GraphQL](https://www.apollographql.com/)
- [Node JSON Web Token](https://github.com/auth0/node-jsonwebtoken#readme) for authentication/authorization
- [Nodemailer](https://nodemailer.com/about/) for automated emails

---

## ARCHITECTURE

Read each directory's respective `README.md` file before contributing.

- API
  - [Client](client-api)
  - [Server](server-api)
    - Business Logic
    - Data Access
- React Components
  - [Website Components](components)
  - [CMS Components](cmsComponents)
    ```diff
    ! The CMS is not yet fully implemented.  It is currently under development.
    ```
  - [Pages](pages)
- [Locales](locales)
- [Utilities](utilities)
  ```diff
  ! Needs more tests written, then we should contribute with TDD from now on.
  ```

---

## ENVIRONMENT SETUP

### Dependencies

- This project relies on Docker containers, so you'll need to make sure [Docker Desktop](https://www.docker.com/get-started/) is installed and running prior to setting up.

- This project was designed with the [VS Code](https://code.visualstudio.com/download) text editor in mind.  Between the `.vscode` and `.devcontainer` directories, you will already have everything you need to get running.  On Windows, the [`Remote - WSL`](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) extension is strongly encouraged to work with this codebase as it was intended.

- If you're running a Windows machine, you'll need to install [WSL](https://docs.microsoft.com/en-us/windows/wsl/install) and clone this repo into your Linux root.  Open Powershell and type the following command to install WSL.
  ```
  wsl --install
  ```
  - You must install a distro for WSL - [Ubuntu](https://www.microsoft.com/en-us/p/ubuntu/9pdxgncfsczv) is recommended. You can install it through the Microsoft store.
  - Activate WSL in Docker Desktop by navigating to `Settings -> Resources -> WSL Integration`. Enable the integration, and make sure the distro you installed is selected.
  >NOTE: If you want to use Windows explorer to view folders in WSL, you can do so by manually typing `\\wsl$` into the path.  If your chosen distro was Ubuntu, the full path of your home folder would be `\\wsl$\Ubuntu\home\<your username here>`.
  >
  > If you are unable to access the folder, try running WSL from the Windows search bar and then try again.

### Cloning the Repository

- Open a terminal and type the following commands (For Windows users and if chose ubuntu as your distro, search `Ubuntu` and choose "Run as administrator.") 

    First, either make a repos folder or navigate to your existing one.
    ```
    cd ~/
    mkdir repos
    cd repos
    ```
    Then clone the repo and open it with VSCode.
    ```
    git clone https://github.com/Thunder-Solutions/Boilerplate.git
    code Boilerplate
    ```

### Development

- Before writing any code, the first thing you'll want to do in VSCode is choose [reopen folder in container](https://code.visualstudio.com/docs/remote/containers#_quick-start-open-an-existing-folder-in-a-container) from the bottom-left corner, or hit `ctrl+shift+p` and choose the option.  *Docker Desktop must be running for this to work.*
    >NOTE: This may take a few minutes the first time.  Once the Docker image has been created, it will be cached so it won't take as long the next time.
- The best way to serve your local environment is to use the [Run and Debug](https://code.visualstudio.com/docs/editor/debugging) tab on the far left toolbar menu.  This was configured with `.vscode/launch.json` so you can add debug points from inside VSCode.

---

## ADDING ENVIRONMENT VARIABLES

Next.js now has native support for `.env`, however that is *not* what we want to use.  To keep behavior consistent between local servers and deployed code, we should add environment variables via `docker-compose.yml` and `Dockerfile`.  *Note the difference between build arguments and environment variables.*

- Why Dockerfile?
    -

    Docker is responsible for building and running the application front-to-back.  That means it has visibility to all environment variables and build arguments, as well as the ability to set them itself.  The `Dockerfile` will run in a deployed environment just as it runs locally, so *only add variables here when they directly concern the build.*  Otherwise, all environment variables should come from `docker-compose.yml`.

- Why Docker Compose?
    -

    Using Digital Ocean's App platform, `docker-compose.yml` does not run in deployed environments.  Instead, environment variables (and build arguments) will come directly from Digital Ocean's configurations.  That means Docker Compose effectively *simulates* the live environment.

- Why Not `.env`?
    -

    The `.env` file is deployed as the default context, and is overridden by Digital Ocean's configurations.  In most cases, we do not want local variables leaking into production, so this may present a small risk.  More importantly, however, it's just important to be consistent.  The subtle behavior differences of Docker and `.env` can create confusing scenarios, not to mention the maintenance issue of variables spread across multiple files.
