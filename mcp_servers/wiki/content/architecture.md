# Architecture

This section contains the technical architecture documentation for UrbanAI.

## System Architecture

UrbanAI follows a clean architecture pattern with the following layers:

### API Layer
- **ASP.NET Core 9.0** web API
- RESTful endpoints for all client interactions
- OpenAPI/Swagger documentation
- CORS configuration for web client access

### Application Layer
- Domain-specific services and features
- Business logic implementation
- Data transfer objects (DTOs)
- Command and query handlers

### Domain Layer
- Core business entities and models
- Domain interfaces and contracts
- Business rule validation
- Domain events

### Infrastructure Layer
- Database connectivity and repositories
- External service integrations
- File storage and processing
- Third-party API clients

## Technology Stack

### Backend
- **.NET 9.0** - Main runtime framework
- **ASP.NET Core 9.0** - Web API framework
- **Entity Framework Core** - ORM for database operations
- **Azure Services** - Cloud hosting and services

### Architecture Patterns
- **Clean Architecture** - Separation of concerns
- **CQRS** - Command Query Responsibility Segregation
- **Repository Pattern** - Data access abstraction
- **Dependency Injection** - Inversion of Control

## Project Structure

```
src/
├── UrbanAI.API/           # Web API layer
├── UrbanAI.Application/   # Application services
├── UrbanAI.Domain/        # Domain models
└── UrbanAI.Infrastructure/ # Infrastructure services
```

## Next Steps

- [Component Diagram](/Architecture/Component-Diagram) - Detailed component relationships
- [Sequence Diagrams](/Architecture/Sequence-Diagrams) - Process flows
- [API Documentation](/API) - Endpoint specifications
