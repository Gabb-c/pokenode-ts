# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon)
ARG VARIANT=20
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${VARIANT}

# Update package lists and upgrade existing packages
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
