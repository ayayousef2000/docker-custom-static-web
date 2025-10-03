# Docker Custom Static Website with Professional CI/CD Pipeline

This project was created as a demonstration of a modern static website, which was built with MkDocs and a custom theme.

The core focus was placed on best practices, which included:
*   A multi-stage Docker build, designed for a small and secure production image.
*   Automated build processes that were set up for CSS pre-processing, typography, and HTML minification.
*   Two distinct, production-ready deployment strategies that were managed by GitHub Actions.

### **Required Configuration: GitHub Secrets**
For the workflows to run successfully, the following secrets had to be configured in the project's GitHub repository under `Settings` > `Secrets and variables` > `Actions`:

*   `DOCKERHUB_USERNAME`: The username for Docker Hub. (Needed for Workflow 1)
*   `DOCKERHUB_TOKEN`: An access token from a Docker Hub account. (Needed for Workflow 1)

---

### **Workflow: Deploy via Docker Hub (`deploy-with-docker-hub.yml`)**

This was implemented as a robust and efficient deployment strategy suitable for production environments. The build process was designed to occur on GitHub's runners, and only the final, lightweight artifact was sent to the server.

**Trigger:**
*   It was configured to run automatically on every `push` to the `main` branch.
*   It could also be triggered manually from the "Actions" tab in GitHub.

**Process:**
1.  **Build:** The code was checked out by the workflow, and the `Dockerfile` was used to build a multi-stage Docker image. During this process, all assets were compiled, resulting in a minimal Nginx image containing only the static `site/` files.
2.  **Push:** The newly built image was tagged and pushed to the designated Docker Hub registry.

---
## Containerization Explained

### `Dockerfile`
A **multi-stage build** approach was used in the `Dockerfile`, which is a best practice for creating optimized and secure container images.
*   **Stage 1 (`builder`):** An initial image was created using `node:18-alpine`. This image contained the complete development environment, including Node.js, Python, and all dependencies needed for building the static site. The `npm run build` command was executed in this stage.
*   **Stage 2 (Final):** A second, clean image was started from `nginx:1.25-alpine`, a lightweight web server. Only the static files from the `site/` directory were copied from the `builder` stage into this final image. All development tools and source code were discarded, which resulted in a minimal and secure production image.

### `docker-compose.yml`
The `docker-compose.yml` file was created to provide a simple way to define and run the application. It was primarily used by the "Direct Deploy" workflow to build the image and run the container on the remote server with the correct port mappings. The modern `name` attribute was used to define the project's identity within Docker.

## Option 1: Pull and Run the Docker Image from Docker Hub

This option is ideal for quickly running the pre-built Docker image.

1.  **Pull the image from Docker Hub:** Open your terminal in "Play with Docker" (PWD) and execute the following command to download the Docker image:

    ```bash
    docker pull ayayousef7/custom-static-web:latest
    ```

2.  **Run the Docker container:** After the image is pulled, run it as a container with this command:

    ```bash
    docker run -d -p 8080:80 ayayousef7/custom-static-web:latest
    ```

3.  **Access the application:** Click on the **OPEN PORT** button in PWD, enter `8080`, and click **OK**. Your website will open in a new tab.

---

## Option 2: Build and Run the Image from the GitHub Repository

This option is suitable if you want to build the image from the source code.

1.  **Clone the GitHub repository:** In your PWD terminal, clone the repository using the following command:

    ```bash
    git clone https://github.com/ayayousef2000/docker-custom-static-web.git
    ```

2.  **Navigate to the project directory:** Change your current directory to the newly cloned project folder:

    ```bash
    cd docker-custom-static-web
    ```

3.  **Build and run the Docker image:** Use Docker Compose to build the image and start the container:

    ```bash
    docker-compose up
    ```

4.  **Access the application:** Click on the **OPEN PORT** button in PWD, enter `80`, and click **OK**. The website will then be accessible.