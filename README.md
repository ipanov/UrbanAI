# UrbanAI Backend

This repository contains the backend services for the UrbanAI project, including the Performance API and the AI Agent.

## Project Structure

- **UrbanAI.API:** The main Web API project.
- **UrbanAI.Application:** Contains application services and business logic.
- **UrbanAI.Domain:** Contains core domain entities and interfaces.
- **UrbanAI.Infrastructure:** Handles data access and external service integrations.
- **docs:** Documentation files, including architecture diagrams.

## Setup Instructions

Follow these steps to set up and run the UrbanAI backend locally:

1.  **Prerequisites:**
    *   [.NET SDK (latest LTS)](https://dotnet.microsoft.com/download)
    *   A database system (e.g., SQL Server, PostgreSQL, SQLite). Ensure it's installed and accessible.
    *   [Git](https://git-scm.com/downloads)

2.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd UrbanAI
    ```
    Replace `<repository_url>` with the actual URL of the repository.

3.  **Configure Database Connection:**
    *   Open the `src/UrbanAI.API/appsettings.json` file.
    *   Update the `ConnectionStrings` section with your database connection string. Example for SQL Server:
        ```json
        "ConnectionStrings": {
          "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=UrbanAIDb;Trusted_Connection=True;MultipleActiveResultSets=true"
        }
        ```

4.  **Apply Database Migrations:**
    *   Navigate to the project root directory (`c:/Repos/UrbanAI`).
    *   Run the following command to apply the latest Entity Framework Core migrations and create the database schema:
        ```bash
        dotnet ef database update --project src/UrbanAI.Infrastructure --startup-project src/UrbanAI.API
        ```

5.  **Run the API:**
    *   Navigate to the project root directory (`c:/Repos/UrbanAI`).
    *   Run the API project:
        ```bash
        dotnet run --project src/UrbanAI.API
        ```
    *   The API should start and be accessible, typically at `https://localhost:5001` (HTTPS) and `http://localhost:5000` (HTTP). Check the console output for the exact URLs.

6.  **Access Swagger UI:**
    *   Once the API is running, open your web browser and navigate to `/swagger` (e.g., `https://localhost:5001/swagger`) to view the interactive API documentation.

## API Documentation (Swagger/OpenAPI)

Once the API is running, you can access the Swagger UI for interactive API documentation at `/swagger`.

## Architecture Diagrams

Architecture diagrams are located in the `docs` directory.

## Contributing

Please refer to the GitFlow branching strategy outlined in the project documentation.
