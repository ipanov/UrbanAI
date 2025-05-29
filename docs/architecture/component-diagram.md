graph TD
    User --> UrbanAI.API
    UrbanAI.API --> UrbanAI.Application
    UrbanAI.Application --> UrbanAI.Domain
    UrbanAI.Application --> UrbanAI.Infrastructure
    UrbanAI.Infrastructure --> Database(SQL Database)
    UrbanAI.Infrastructure --> NoSQLDB(NoSQL Database)
    UrbanAI.Infrastructure --> ExternalServices(External Services / AI Agent)
