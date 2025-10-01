# Docker Custom Static Website with Professional CI/CD Pipeline

This project was created as a demonstration of a modern static website, which was built with MkDocs and a custom theme. A professional, automated CI/CD pipeline was implemented using GitHub Actions, configured to containerize the application and deploy it to a live server environment (Play with Docker).

The core focus was placed on best practices, which included:
*   A multi-stage Docker build, designed for a small and secure production image.
*   Automated build processes that were set up for CSS pre-processing, typography, and HTML minification.
*   Two distinct, production-ready deployment strategies that were managed by GitHub Actions.

## Automated CI/CD Deployment Pipelines

This project was configured with two distinct GitHub Actions workflows to automate deployment to a [Play with Docker](https://labs.play-with-docker.com/) instance.

### **Required Configuration: GitHub Secrets**
For the workflows to run successfully, the following secrets had to be configured in the project's GitHub repository under `Settings` > `Secrets and variables` > `Actions`:

*   `DOCKERHUB_USERNAME`: The username for Docker Hub. (Needed for Workflow 1)
*   `DOCKERHUB_TOKEN`: An access token from a Docker Hub account. (Needed for Workflow 1)
*   `PWD_HOST`: The hostname or IP address of the Play with Docker instance.
*   `PWD_USER`: The username for the server (e.g., `root`).
*   `PWD_PASSWORD`: The password for the Play with Docker instance.

---

### **Workflow 1: Deploy via Docker Hub (`deploy-with-docker-hub.yml`)**

This was implemented as a robust and efficient deployment strategy suitable for production environments. The build process was designed to occur on GitHub's runners, and only the final, lightweight artifact was sent to the server.

**Trigger:**
*   It was configured to run automatically on every `push` to the `main` branch.
*   It could also be triggered manually from the "Actions" tab in GitHub.

**Process:**
1.  **Build:** The code was checked out by the workflow, and the `Dockerfile` was used to build a multi-stage Docker image. During this process, all assets were compiled, resulting in a minimal Nginx image containing only the static `site/` files.
2.  **Push:** The newly built image was tagged and pushed to the designated Docker Hub registry.
3.  **Deploy:** A secure SSH connection to the Play with Docker instance was established by the workflow, and the following actions were performed:
    *   The latest version of the image was pulled from Docker Hub.
    *   The previously running container was stopped and removed.
    *   A new container was started from the updated image.

---

### **Workflow 2: Direct Deploy (`deploy-without-docker-hub.yml`)**

This method was implemented as a simpler alternative that bypassed the need for a container registry. The source code was copied directly to the server, and the build was performed there.

**Trigger:**
*   This workflow was configured to run **only when triggered manually** from the "Actions" tab. This was done to prevent it from running automatically and conflicting with the primary workflow.

**Process:**
1.  **Copy Source:** The entire project directory (including the `Dockerfile` and `docker-compose.yml`) was securely copied to the Play with Docker instance by the workflow using SCP.
2.  **Build and Deploy on Server:** A connection was then established to the server via SSH, and a single command was executed: `docker-compose up -d --build`.
    *   The `--build` flag was used to instruct Docker Compose to rebuild the image with the newly copied source code.
    *   The container was started in detached mode using the `up -d` command.

## Containerization Explained

### `Dockerfile`
A **multi-stage build** approach was used in the `Dockerfile`, which is a best practice for creating optimized and secure container images.
*   **Stage 1 (`builder`):** An initial image was created using `node:18-alpine`. This image contained the complete development environment, including Node.js, Python, and all dependencies needed for building the static site. The `npm run build` command was executed in this stage.
*   **Stage 2 (Final):** A second, clean image was started from `nginx:1.25-alpine`, a lightweight web server. Only the static files from the `site/` directory were copied from the `builder` stage into this final image. All development tools and source code were discarded, which resulted in a minimal and secure production image.

### `docker-compose.yml`
The `docker-compose.yml` file was created to provide a simple way to define and run the application. It was primarily used by the "Direct Deploy" workflow to build the image and run the container on the remote server with the correct port mappings. The modern `name` attribute was used to define the project's identity within Docker.