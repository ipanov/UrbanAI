# UrbanAI Project

## Overview
This repository contains the UrbanAI project, an application designed with a cost-optimized architecture. The primary goal is to minimize Azure costs while maintaining separate staging and production environments.

## Architecture Highlights
The UrbanAI architecture leverages shared and environment-specific resources to achieve cost efficiency and environment isolation.

### Shared Resources
- **SQL Server & Database**: A single shared SQL Database instance (`UrbanAIDb`) is used by both staging and production App Services. This minimizes fixed costs.

### Environment-Specific Resources
- **Staging Environment**: Utilizes Azure App Service Plan (F1 Free tier) and App Service, along with a free-tier Cosmos DB.
- **Production Environment**: Uses Azure App Service Plan (F1 Free tier) and App Service, with a serverless, pay-per-use Cosmos DB. A custom domain (`https://urbanai.site`) and API endpoint (`https://api.urbanai.site`) are configured.

### Security & Identity
- A user-assigned managed identity is shared across App Services.
- CORS is enabled for web API access.
- SQL Firewall rules are configured for secure access.

## Cost Breakdown (Estimated Monthly)
The estimated total monthly cost for the UrbanAI infrastructure is approximately ~$5-10/month, primarily due to the shared SQL Database. App Services and Cosmos DB (staging) utilize free tiers, while Cosmos DB (production) is usage-based.

## Deployment Strategy
The infrastructure is deployed using a single Bicep template. Both staging and production App Services connect to the shared SQL Database, while each environment maintains its own Cosmos DB for data isolation.

## Git Branching Conventions

The UrbanAI project follows a simplified GitFlow branching strategy:

*   **`main`**: Production-ready code. Merges into `main` come from `develop` after Epic completion.
*   **`develop`**: Latest integrated development code. Feature branches merge into `develop` via pull requests.

### Feature Branch Naming Convention
Feature branches **must** include the associated Azure DevOps Work Item ID for automatic linking and PR completion.

**Format:** `feature/WI-ID-short-description`
*   `feature`: (or `bugfix`, `hotfix`, `users/username`)
*   `WI-ID`: Azure DevOps Work Item ID (e.g., `37`)
*   `short-description`: Concise, hyphen-separated description.

**Examples:**
*   `feature/37-setup-integration-tests`
*   `bugfix/123-fix-login-issue`

### Pull Request (PR) Titles
PR titles should reference the Work Item ID and clearly indicate the purpose of changes.

**Format:** `[Type]: WI-ID - Short description of changes`
*   `[Type]`: Commit type (e.g., `feat`, `fix`, `chore`, `docs`, `refactor`).
*   `WI-ID`: Azure DevOps Work Item ID.
*   `Short description of changes`: Brief summary.

**Example:**
*   `feat: 37 - Setup Integration Tests Project`

## Getting Started

Further details on setting up the development environment, running tests, and contributing can be found in the `CONTRIBUTING.md` file.
