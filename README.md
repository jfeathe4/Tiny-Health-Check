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

This project is organized as a monorepo containing:

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
