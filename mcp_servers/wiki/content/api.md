# API Documentation

This page contains the complete API reference for the UrbanAI platform.

## Base URL

```
https://api.urbanai.com/v1
```

For development:
```
https://localhost:5001/v1
```

## Authentication

The API uses Bearer token authentication. Include the authorization header in all requests:

```http
Authorization: Bearer <your-token-here>
```

## Issues API

### Create Issue

Create a new urban issue report with optional image data.

**Endpoint:** `POST /v1/issues`

**Request Body:**
```json
{
  "description": "Pothole on Main Street causing traffic issues",
  "imageData": "base64-encoded-image-data",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Main Street, New York, NY"
  },
  "category": "Infrastructure",
  "reporterInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123"
  }
}
```

**Response (201 Created):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "description": "Pothole on Main Street causing traffic issues",
  "status": "Open",
  "category": "Infrastructure",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Main Street, New York, NY"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "classification": {
    "violationType": "Road Maintenance",
    "severity": "Medium",
    "confidence": 0.85
  }
}
```

### Get Issue

Retrieve details of a specific issue.

**Endpoint:** `GET /v1/issues/{id}`

**Response (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "description": "Pothole on Main Street causing traffic issues",
  "status": "In Progress",
  "category": "Infrastructure",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Main Street, New York, NY"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T14:22:00Z",
  "classification": {
    "violationType": "Road Maintenance",
    "severity": "Medium",
    "confidence": 0.85
  },
  "reportGenerated": true,
  "reportId": "report-456"
}
```

### List Issues

Get a paginated list of issues with optional filtering.

**Endpoint:** `GET /v1/issues`

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 20, max: 100)
- `status` (string): Filter by status (Open, InProgress, Closed)
- `category` (string): Filter by category
- `location` (string): Filter by location/address

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "description": "Pothole on Main Street causing traffic issues",
      "status": "Open",
      "category": "Infrastructure",
      "location": {
        "address": "123 Main Street, New York, NY"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## Reports API

### Generate Report

Generate an official report for an issue using AI analysis and regulation crawling.

**Endpoint:** `POST /v1/issues/{id}/report`

**Response (200 OK):**
```json
{
  "reportId": "report-456",
  "status": "Generated",
  "reportUrl": "/v1/reports/report-456",
  "generatedAt": "2024-01-15T15:30:00Z"
}
```

### Get Report

Retrieve a generated report.

**Endpoint:** `GET /v1/reports/{reportId}`

**Response (200 OK):**
```json
{
  "id": "report-456",
  "issueId": "123e4567-e89b-12d3-a456-426614174000",
  "content": "# Official Violation Report\n\n## Issue Summary\n...",
  "format": "markdown",
  "regulations": [
    {
      "code": "NYC-BUILDING-001",
      "title": "Road Maintenance Standards",
      "relevance": 0.92
    }
  ],
  "generatedAt": "2024-01-15T15:30:00Z"
}
```

## Chat API

### Start Chat Session

Start an interactive chat session for an issue to gather additional information.

**Endpoint:** `POST /v1/issues/{id}/chat`

**Response (200 OK):**
```json
{
  "sessionId": "chat-789",
  "issueId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "Active",
  "createdAt": "2024-01-15T16:00:00Z"
}
```

### Send Chat Message

Send a message in an active chat session.

**Endpoint:** `POST /v1/chat/{sessionId}/messages`

**Request Body:**
```json
{
  "message": "The pothole is about 2 feet wide and 6 inches deep",
  "messageType": "user"
}
```

**Response (200 OK):**
```json
{
  "messageId": "msg-001",
  "response": "Thank you for the additional details. Based on the size you described, this qualifies as a significant road hazard. Can you tell me if there are any warning signs or barriers around the pothole?",
  "suggestions": [
    "Take a photo showing the size for scale",
    "Note if traffic is being affected",
    "Check if city workers are aware"
  ],
  "timestamp": "2024-01-15T16:05:00Z"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid request payload",
  "details": [
    "Description is required",
    "Location coordinates are invalid"
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Valid authentication token required"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Issue not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Data Models

### Location
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address": "123 Main Street, New York, NY",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001"
}
```

### Classification
```json
{
  "violationType": "Road Maintenance",
  "category": "Infrastructure",
  "severity": "Medium",
  "confidence": 0.85,
  "suggestedActions": [
    "Contact Department of Transportation",
    "File maintenance request"
  ]
}
```

### Reporter Info
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "role": "Citizen"
}
```

## Rate Limits

- **Free Tier**: 100 requests per hour
- **Premium Tier**: 1000 requests per hour
- **Enterprise**: No limits

Rate limit headers are included in all responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642252800
```

## Webhooks

Configure webhooks to receive notifications when issue status changes:

```json
{
  "url": "https://your-app.com/webhooks/urbanai",
  "events": ["issue.created", "issue.updated", "report.generated"],
  "secret": "your-webhook-secret"
}
```

## Related Documentation

- [Architecture Overview](/Architecture) - System architecture and components
- [Getting Started](/Getting-Started) - Quick start guide
- [Authentication](/API/Authentication) - Detailed authentication guide
