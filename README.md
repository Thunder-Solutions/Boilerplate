# BOILERPLATE THEME

This project is intended to be customized and reused as a template for clients of [Thunder Solutions](https://thunder.solutions).  It includes fundamental implementations and features, reducing future repetitive set-up so we can hit the ground running with new clients.

Each folder contains a `README.md` file which should be reviewed before contributing, and which contains standards we should be reviewing against when approving or denying pull requests.

This project uses [jsdoc](https://jsdoc.app/) comments for documentation, and potentially for TypeScript type checking without the full commitment to the TypeScript syntax.  These comments also assist with intellisense, so we can read more about the functions we're calling without opening a dozen tabs.

---

## TECH STACK

>This section will be updated as more of the main architecture is set in motion.

- [Docker](https://www.docker.com)
- [Next.js](https://nextjs.org/) (React.js + Node.js)

---

## ENVIRONMENT SETUP

>This section will be updated as more of the main architecture is set in motion.

### Dependencies

- This project relies on Docker containers, so you'll need to make sure [Docker Desktop](https://www.docker.com/get-started/) is installed and running prior to setting up.

- This project was designed with the [VS Code](https://code.visualstudio.com/download) text editor in mind.  Between the `.vscode` and `.devcontainer` directories, you will already have everything you need to get running.  On Windows, the [`Remote - WSL` extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) is strongly encouraged to work with this codebase as it was intended.

- If you're running a Windows machine, you'll need to install [WSL](https://docs.microsoft.com/en-us/windows/wsl/install) and clone this repo into your Linux root.  Open Powershell and type the following command to install WSL.
    ```
    wsl --install
    ```
    >NOTE: If you want to use Windows explorer to view folders in WSL, you can do so by manually typing `\\wsl$` into the path.  If your chosen distro was Ubuntu, the full path of your home folder would be `\\wsl$\Ubuntu\home\<user>` where `<user>` is whatever username you set up.

- You need to make sure you install a distro for WSL. The recomended distro is Ubuntu, you can install it through the Microsoft store. [Ubuntu](https://www.microsoft.com/en-us/p/ubuntu/9pdxgncfsczv)

- After you install Ubuntu you need to activate WSL within Docker Desktop. That is done under Settings -> Resources -> WSL Integration. You need to both enable the integration, and make sure the distro you installed is also selected. (If you chose to install the above distro is should be Ubuntu)

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

- Before writing any code, the first thing you'll want to do is choose [reopen folder in container](https://code.visualstudio.com/docs/remote/containers#_quick-start-open-an-existing-folder-in-a-container) from the bottom-left corner, or hit `ctrl+shift+p` and choose the option.  *Docker Desktop must be running for this to work.*
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
