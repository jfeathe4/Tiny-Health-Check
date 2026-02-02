# Tiny Health Check Service

A micro-service ecosystem that monitors the availability of a specific set of websites.

## Prerequisites

- Docker & Docker Compose

## Getting Started

1. **Clone the repository**

2. **Start the application**

   ```bash
   docker-compose up --build
   ```

3. **Access the Dashboard**
   Open http://localhost:3000 in your browser.

## Architecture

This project is organized as a monorepo to allow for ease of deployment organization and to simplfy shared assets.

The enitre application is built in typescript with NodeJs backend and React frontend. A consistent language decreases the complexity of full stack development and allows for shared assets such as models and libraries and linters.

The database for the application uses an in memory store using a Map to allow for O(1) lookup. As the applciation scales this could easily be replaced with a redis instance. data persistance is not currently supported but scaling to redis would allow for persistance. Or as an alternative any DB could be setup to support persistance.

The Backend's core logic exists within the services folder. All background jobs are stored within the Jobs folder, as the application scales these should be seperated to their own deployment to allow for independent scaling.

The frontend utilizes Vite to ensure a fast development loop and optimized production builds. Material UI is used to provide a polished, accessible user interface with minimal custom CSS, allowing focus on business logic. The application is structured as a Single Page Application to ensure a responsive user experience.

- **Backend**: Node.js/TypeScript API and Worker.
  - `src/config`: environment setup and configuration.
  - `src/handlers`: HTTP request handlers.
  - `src/jobs`: scheduled jobs and background tasks.
  - `src/middlewares`: middleware components.
  - `src/models`: objects and models.
  - `src/services`: core services and business logic.
  - `src/utils`: utility functions.
  - `tests`: unit and integration tests.
  - `routes`: external api routes.
- **Frontend**: React (Vite) Single Page Application.
  - `src/api`: API client.
  - `src/components`: Reusable UI elements.
  - `src/models`: objects and models.
  - `tests`: Vitest component tests.
- **Infrastructure**:
  - `docker-compose.yml`: Orchestrates the services.
  - `.github/workflows`: CI pipeline.
