ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID
ARG NEXT_PUBLIC_ORIGIN

FROM node:16-buster AS base
ARG USERNAME
RUN rm -rf /opt/yarn-v$YARN_VERSION/ \
  && unlink /usr/local/bin/yarn \
  && unlink /usr/local/bin/yarnpkg \
  && unset YARN_VERSION \
  && npm install -g npm@8

USER root

# NOTE: Tini fixes issues with Node signals (see https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#handling-kernel-signals)
RUN apt-get update -y && apt-get install -y tini \
  #
  # Clean up (makes Docker image smaller)
  && apt-get autoremove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
RUN chown $USERNAME:$USERNAME .

USER $USERNAME
RUN mkdir .next
# ^ ensure we have a .next folder owned by the $USERNAME user
# (if it were to be created without this, it would be owned by root - causing permission issues)


# ---

FROM base as development
ARG USERNAME
ARG USER_UID
ARG USER_GID
ARG NEXT_PUBLIC_ORIGIN
ENV NODE_ENV=development
ENV ENVIRONMENT=development
ENV NEXT_PUBLIC_ORIGIN=$NEXT_PUBLIC_ORIGIN

# Configure Git to use VIM for editing by default (can override these with VS Code)
ENV VISUAL=vim
ENV EDITOR="$VISUAL"

# Need root to do the following...
USER root

RUN echo '#!/bin/bash\nset -o pipefail; npm i; export NODE_OPTIONS='--inspect=0.0.0.0:9229'; exec "$@"' > /usr/local/bin/docker-entrypoint.sh \
  && chown $USERNAME:$USERNAME /usr/local/bin/docker-entrypoint.sh \
  && chmod +x /usr/local/bin/docker-entrypoint.sh

RUN apt-get update \
  #
  # Install VIM (set as default editor for git above)
  && apt-get -y install vim \
  #
  # Update a non-root user to UID/GID if needed.
  && if [ "$USER_GID" != "1000" ] || [ "$USER_UID" != "1000" ]; then \
    groupmod --gid $USER_GID $USERNAME \
    && usermod --uid $USER_UID --gid $USER_GID $USERNAME \
    && chown -R $USER_UID:$USER_GID /home/$USERNAME; \
  fi \
  #
  # Add sudo support for non-root user
  && apt-get install -y sudo \
  && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
  && chmod 0440 /etc/sudoers.d/$USERNAME \
  #
  # Clean up (makes Docker image smaller)
  && apt-get autoremove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

USER $USERNAME
COPY .bashrc /home/$USERNAME/
COPY --chown=$USERNAME:$USERNAME package*.json ./
RUN npm ci --only=production
ENTRYPOINT ["tini", "--", "docker-entrypoint.sh"]
CMD ["node", "./node_modules/.bin/next", "dev"]


# ---

FROM base as production
ARG USERNAME
ARG NEXT_PUBLIC_ORIGIN
ENV NODE_ENV=production
ENV ENVIRONMENT=production
ENV NEXT_PUBLIC_ORIGIN=$NEXT_PUBLIC_ORIGIN

# Need root to do the following...
USER root

RUN echo '#!/bin/bash\nset -o pipefail; echo "${MONGO_CERT}" > ca-certificate.crt; exec "$@"' > /usr/local/bin/docker-entrypoint.sh \
  && chown $USERNAME:$USERNAME /usr/local/bin/docker-entrypoint.sh \
  && chmod +x /usr/local/bin/docker-entrypoint.sh

USER $USERNAME
COPY --chown=$USERNAME:$USERNAME . .
RUN npm ci --only=production
RUN NODE_OPTIONS=--max_old_space_size=6144 npm run build
ENTRYPOINT ["tini", "--", "docker-entrypoint.sh"]
CMD ["node", "./node_modules/.bin/next", "start", "--hostname=0.0.0.0", "--port=$PORT"]
