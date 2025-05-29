# UrbanAI

This repository contains the backend services for the UrbanAI project, built with .NET Core following a layered architecture (Domain, Application, Infrastructure, WebAPI).

## Project Structure

- `src/UrbanAI.Domain`: Contains core domain entities, value objects, and interfaces.
- `src/UrbanAI.Application`: Contains application logic, use cases, DTOs, and application services.
- `src/UrbanAI.Infrastructure`: Contains data access implementations (EF Core, NoSQL), external service integrations, and infrastructure concerns.
- `src/UrbanAI.API`: ASP.NET Core Web API project, acting as the presentation layer.
- `tests/`: Contains unit and integration tests for the various layers.
- `docs/`: Contains architecture diagrams, ADRs, and API documentation.
- `Figma/`: (Conceptual) Location for Figma design files.

## Technologies Used

- .NET Core (Latest LTS)
- ASP.NET Core
- Entity Framework Core (for relational data)
- (Planned) NoSQL Database (e.g., MongoDB/Cosmos DB)
- Swashbuckle (for Swagger/OpenAPI documentation)
- xUnit (for testing)

## Setup

1.  **Clone the repository:**
    ```bash
    git clone [Repository URL]
    cd UrbanAI
    ```
    *(Note: Repository URL will be added once the Azure DevOps repo is set up)*

2.  **Restore dependencies:**
    ```bash
    dotnet restore
    ```

## Building

To build the solution:

```bash
dotnet build
```

## Running the API

To run the UrbanAI API locally:

```bash
dotnet run --project src/UrbanAI.API/UrbanAI.API.csproj
```

The API will typically run on `https://localhost:7001` and `http://localhost:5001`.

## Accessing Swagger UI

Once the API is running, you can access the Swagger UI for interactive API documentation at:

```
https://localhost:7001/swagger
```
or
```
http://localhost:5001/swagger
```

## Documentation

- **Architecture Diagrams:** Located in `docs/architecture/`.
- **API Documentation:** Accessible via the Swagger UI.
- **ADR Log:** Located in `docs/adr/`.

## Contributing

Please follow the GitFlow branching strategy. Create feature branches from `develop`, open Pull Requests into `develop`, and ensure all tests pass before merging.

*(More detailed contribution guidelines will be added later)*

## License

*(License information will be added later)*
