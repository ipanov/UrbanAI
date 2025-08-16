# Dockerfile for UrbanAI.API
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["UrbanAI.sln", "."]
COPY ["src/UrbanAI.API/UrbanAI.API.csproj", "src/UrbanAI.API/"]
COPY ["src/UrbanAI.Application/UrbanAI.Application.csproj", "src/UrbanAI.Application/"]
COPY ["src/UrbanAI.Domain/UrbanAI.Domain.csproj", "src/UrbanAI.Domain/"]
COPY ["src/UrbanAI.Infrastructure/UrbanAI.Infrastructure.csproj", "src/UrbanAI.Infrastructure/"]
RUN dotnet restore "UrbanAI.sln"
COPY . .
WORKDIR "/src/src/UrbanAI.API"
RUN dotnet build "UrbanAI.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "UrbanAI.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "UrbanAI.API.dll"]
