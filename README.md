# Tiny Health Check Service

A micro-service ecosystem that monitors the availability of a specific set of websites.

## Architecture

This project is organized as a monorepo containing:

- **Backend**: Node.js/TypeScript API and Worker.
  - `src/services/health-check.ts`: Handles the background polling logic.
  - `src/controllers`: REST API endpoints.
  - `src/db`: SQLite connection and setup.
- **Frontend**: React (Vite) Single Page Application.
  - `src/components`: Reusable UI elements.
  - `src/hooks`: Custom React hooks for data fetching.
- **Infrastructure**:
  - `docker-compose.yml`: Orchestrates the services.
  - `.github/workflows`: CI pipeline.

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

4. **API Documentation**
   The API is available at http://localhost:4000.
