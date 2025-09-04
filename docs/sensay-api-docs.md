# Sensay API Documentation

**Version:** 2025-03-25  
**Base URL:** `https://api.sensay.io`  
**Last Updated:** September 1, 2025

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [Conceptual Model](#conceptual-model)
5. [API Responses](#api-responses)
6. [Versioning](#versioning)
7. [Pagination](#pagination)
8. [SDK Generation](#sdk-generation)
9. [Core Concepts](#core-concepts)
10. [Endpoints](#endpoints)
11. [Training & Knowledge Base](#training--knowledge-base)
12. [Conversations](#conversations)
13. [Analytics](#analytics)
14. [Integrations](#integrations)
15. [Tutorials](#tutorials)
16. [Troubleshooting](#troubleshooting)
17. [Feature Requests](#feature-requests)

---

## Introduction

This is the API for Sensay Platform - a powerful AI replica management system that allows you to create, train, and interact with AI replicas.

**Key Features:**
- Create and manage AI replicas
- Train replicas with custom knowledge
- Chat functionality with OpenAPI-compatible models
- Multi-platform integration (Telegram, Discord, Web)
- Comprehensive analytics and conversation management
- Organization and user management

**Resources:**
- 🌐 **Main Website:** [https://sensay.io](https://sensay.io)
- 🎮 **Interactive API:** [https://api.sensay.io/ui](https://api.sensay.io/ui)
- 📢 **API Announcements:** [Telegram Channel](https://t.me/sensay_api_announcements)
- 🔑 **Request API Key:** [API Account Request Form](https://sensay.io/api-request)
- 🛠 **OpenAPI Tools:** [https://tools.openapis.org](https://tools.openapis.org)

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:
- A Sensay API organization secret token
- Basic understanding of RESTful APIs
- A tool for making HTTP requests (curl, Postman, or your preferred programming language)

### Quick Start Walkthrough

All API requests must include a `Content-Type: application/json` header. We highly recommend specifying the API version using the `X-API-Version` header to handle breaking changes gracefully.

#### Environment Setup

```bash
export USER_ID=test_user_id
export ORGANIZATION_SECRET=your_secret_token
export API_VERSION=2025-03-25
```

#### Step 1: Create a User

Each organization can have multiple users. Create a new user:

```bash
curl -X POST https://api.sensay.io/v1/users \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json" \
-d '{"id": "'"$USER_ID"'"}'
```

**Response:**
```json
{
  "id": "test_user_id",
  "linkedAccounts": []
}
```

> **Note:** The `id` field is optional. If omitted, the API generates a unique UUID.

#### Step 2: Create a Replica

Replicas belong to users. Create a new replica:

```bash
curl -X POST https://api.sensay.io/v1/replicas \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json" \
-d '{
  "name": "My Replica",
  "shortDescription": "A helpful assistant",
  "greeting": "Hi there! How can I help you today?",
  "ownerID": "'"$USER_ID"'",
  "private": false,
  "slug": "my-replica",
  "llm": {
    "provider": "openai",
    "model": "gpt-4o"
  }
}'
```

**Response:**
```json
{
  "success": true,
  "uuid": "12345678-1234-1234-1234-123456789abc"
}
```

```bash
export REPLICA_UUID=12345678-1234-1234-1234-123456789abc
```

#### Step 3: List User's Replicas

```bash
curl -X GET https://api.sensay.io/v1/replicas \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json" \
-H "X-USER-ID: $USER_ID"
```

**Response:**
```json
{
  "success": true,
  "type": "array",
  "items": [{
    "uuid": "12345678-1234-1234-1234-123456789abc",
    "name": "My Replica",
    "slug": "my-replica",
    "profile_image": "https://studio.sensay.io/assets/default-replica-profile.webp",
    "short_description": "A helpful assistant",
    "introduction": "Hi there! How can I help you today?",
    "tags": [],
    "created_at": "2025-04-15T08:05:03.167222+00:00",
    "owner_uuid": "12345678-1234-1234-1234-123456789abc",
    "voice_enabled": false,
    "video_enabled": false,
    "chat_history_count": 0,
    "system_message": "",
    "telegram_service_name": null,
    "discord_service_name": null
  }],
  "total": 1
}
```

#### Step 4: Chat with a Replica

```bash
curl -X POST https://api.sensay.io/v1/replicas/$REPLICA_UUID/chat/completions \
-H "Content-Type: application/json" \
-H "X-API-Version: $API_VERSION" \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-USER-ID: $USER_ID" \
-d '{"content":"Hello! How are you today?"}'
```

**Response:**
```json
{
  "success": true,
  "content": "Hello! I'm doing well, thank you for asking. How can I help you today?"
}
```

#### Step 5: View Chat History

```bash
curl -X GET https://api.sensay.io/v1/replicas/$REPLICA_UUID/chat/history \
-H "Content-Type: application/json" \
-H "X-API-Version: $API_VERSION" \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-USER-ID: $USER_ID"
```

#### Step 6: Train Your Replica

**Create a knowledge base entry:**
```bash
curl -X POST https://api.sensay.io/v1/replicas/$REPLICA_UUID/training \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json" \
-d '{}'
```

**Response:**
```json
{
  "success": true,
  "knowledgeBaseID": 12345
}
```

**Add information to the knowledge base:**
```bash
export KNOWLEDGE_BASE_ID=12345

curl -X PUT https://api.sensay.io/v1/replicas/$REPLICA_UUID/training/$KNOWLEDGE_BASE_ID \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json" \
-d '{
  "rawText": "Our company was founded in 2020. We specialize in AI-powered customer service solutions. Our business hours are Monday to Friday, 9 AM to 5 PM Eastern Time. We offer a 30-day money-back guarantee on all our products."
}'
```

**Test the trained replica:**
```bash
curl -X POST https://api.sensay.io/v1/replicas/$REPLICA_UUID/chat/completions \
-H "Content-Type: application/json" \
-H "X-API-Version: $API_VERSION" \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-USER-ID: $USER_ID" \
-d '{"content":"What are your business hours?"}'
```

---

## Authentication

The Sensay API supports three authentication methods, all requiring your organization's secret token.

### Method 1: Organization Admin Authentication

**Required Headers:**
- `X-ORGANIZATION-SECRET`: Your organization's secret token

**Access Level:** Full admin access to the organization

**Use Case:** Administrative operations, managing users and replicas across the organization

```bash
curl -X GET https://api.sensay.io/v1/replicas \
-H "X-ORGANIZATION-SECRET: your_secret_token" \
-H "Content-Type: application/json"
```

### Method 2: User Authentication

**Required Headers:**
- `X-ORGANIZATION-SECRET`: Your organization's secret token
- `X-USER-ID`: The specific user's ID

**Access Level:** Limited to what the specific user can access

**Use Case:** User-specific operations, accessing user's replicas and conversations

```bash
curl -X GET https://api.sensay.io/v1/replicas \
-H "X-ORGANIZATION-SECRET: your_secret_token" \
-H "X-USER-ID: user_123" \
-H "Content-Type: application/json"
```

### Method 3: Linked Account Authentication

**Required Headers:**
- `X-ORGANIZATION-SECRET`: Your organization's secret token  
- `X-USER-ID`: The linked account ID
- `X-USER-ID-TYPE`: The type of linked account ID

**Access Level:** Same as Method 2, but using alternative ID types

**Use Case:** When you need to authenticate using external account IDs (social media, email, etc.)

```bash
curl -X GET https://api.sensay.io/v1/replicas \
-H "X-ORGANIZATION-SECRET: your_secret_token" \
-H "X-USER-ID: user@example.com" \
-H "X-USER-ID-TYPE: email" \
-H "Content-Type: application/json"
```

### Authentication Errors

- **401 Unauthorized:** Invalid API key, disabled organization, or non-existent user
- **403 Forbidden:** User lacks permission to access the requested resource

---

## Conceptual Model

The Sensay API follows a hierarchical structure with clear access control rules.

### Entity Hierarchy

```
Organization
├── Users
│   ├── Linked Accounts
│   └── Owned Replicas
│       ├── Knowledge Base Entries
│       ├── Conversations
│       │   └── Messages
│       └── Analytics Data
└── API Keys
```

### Key Relationships

**Organizations** 
- Top-level entities that contain all other resources
- Cannot access each other's data
- Own users, replicas, training data, and configurations

**Users**
- Belong to a single organization
- Can own multiple replicas
- Can interact with public replicas from the same organization

**Replicas**
- Belong to a single user (owner)
- Can be public (accessible by all organization users) or private (owner only)
- Have their own training data (knowledge base)
- Maintain conversation histories with users

**Conversations & Messages**
- Co-owned by both the user and the replica
- Provide context for ongoing interactions
- Support various sources (web, telegram, discord, etc.)

### Access Control Rules

1. **Organization Isolation:** Organizations cannot access each other's resources
2. **User-Replica Access:** Users can interact with replicas they own or public replicas
3. **Private Replicas:** Only accessible by their owner
4. **Admin Access:** Organization admins can access all resources within their organization

---

## API Responses

The Sensay API uses three standardized response formats:

### 1. Successful Object Response

```json
{
  "success": true,
  "some_key": {
    "...": "..."
  }
}
```

### 2. Successful Array Response

```json
{
  "success": true,
  "items": [
    {
      "...": "..."
    }
  ],
  "total": 42
}
```

### 3. Error Response

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {
    "...": "..."
  }
}
```

### Response Headers

All responses include:
- `X-API-Version`: The API version that processed the request
- Standard HTTP status codes
- `Content-Type: application/json`

---

## Versioning

The Sensay API uses **date-based versioning** via the `X-API-Version` header.

### How It Works

- **Format:** `YYYY-MM-DD` (any valid date)
- **Behavior:** The date represents the exact API state as it existed on that day
- **Default:** If omitted, defaults to the latest stable version

### Usage Examples

```bash
# Pin to a specific date
curl -H "X-API-Version: 2025-03-25" https://api.sensay.io/v1/users

# Use latest version (header omitted)
curl https://api.sensay.io/v1/users
```

### Version Response

Each response includes the processed version:

```bash
HTTP/1.1 200 OK
X-API-Version: 2025-03-25
Content-Type: application/json
```

### Migration Strategy

1. **Test with new date:** Try your requests with a current date
2. **Identify changes:** Check the response for any breaking changes
3. **Update your code:** Adapt to any new behaviors
4. **Update version header:** Switch to the new date once tested

### Best Practices

- **Monitor announcements:** Join the [Telegram channel](https://t.me/sensay_api_announcements) for breaking change notifications
- **Use specific dates:** Pin to known-good versions in production
- **Test before updating:** Always test version changes in development first
- **Regular updates:** The API evolves rapidly, so update regularly to get new features

### Version Policy

- **Breaking changes only:** New version dates introduced only for breaking changes
- **Non-breaking updates:** New fields, endpoints, or enhancements deployed without version changes
- **Backward compatibility:** Old versions remain available for reasonable periods

---

## Pagination

The Sensay API supports two pagination methods depending on the endpoint type.

### Offset-Based Pagination

Used for most list endpoints, providing familiar page-based navigation.

#### Parameters

- `page`: Page number (starting from 1)
- `pageSize`: Items per page (typically 1-100)

#### Example: List Conversations

```bash
curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/conversations?page=2&pageSize=20" \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "items": [{
    "uuid": "8e9309af-baa4-4a85-8c59-c3a2a0c2ad0f",
    "source": "web",
    "messageCount": 42,
    "firstMessageAt": "2025-05-27T15:02:44.499744+00:00",
    "lastMessageAt": "2025-05-27T15:02:44.499744+00:00"
  }],
  "total": 156
}
```

#### Implementation Pattern

```javascript
// Calculate pagination info
const totalPages = Math.ceil(response.total / pageSize);
const hasNextPage = currentPage < totalPages;
const hasPrevPage = currentPage > 1;

// Navigation URLs
const nextPageUrl = hasNextPage ? 
  `/conversations?page=${currentPage + 1}&pageSize=${pageSize}` : null;
const prevPageUrl = hasPrevPage ? 
  `/conversations?page=${currentPage - 1}&pageSize=${pageSize}` : null;

// Display info
const startItem = (currentPage - 1) * pageSize + 1;
const endItem = Math.min(currentPage * pageSize, response.total);
console.log(`Showing ${startItem}-${endItem} of ${response.total} results`);
```

### Cursor-Based Pagination

Used for conversation messages and mentions, providing efficient navigation through large datasets.

#### Parameters

- `limit`: Number of items (1-100)
- `beforeUUID`: Items before this UUID (excluding the UUID itself)
- `afterUUID`: Items after this UUID (excluding the UUID itself)

#### Example: Message Navigation

**Get first page (latest messages):**
```bash
curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/conversations/{conversationUUID}/mentions?limit=20" \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET"
```

**Get next page (older messages):**
```bash
curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/conversations/{conversationUUID}/mentions?limit=20&beforeUUID=03db5651-cb61-4bdf-9ef0-89561f7c9c53" \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET"
```

**Get previous page (newer messages):**
```bash
curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/conversations/{conversationUUID}/mentions?limit=20&afterUUID=ec46b4db-3f0d-4392-b0f5-9fe327922e8a" \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET"
```

### Pagination Best Practices

#### Performance
- **Appropriate page sizes:** 10-50 for UI, up to 100 for processing
- **Cache when possible:** Responses are often stable
- **Monitor timeouts:** Large page sizes may cause timeouts

#### Error Handling
```javascript
async function fetchPage(page, pageSize) {
  try {
    const response = await fetch(`/conversations?page=${page}&pageSize=${pageSize}`);
    if (!response.ok) {
      if (response.status === 404) {
        // Page doesn't exist, redirect to first page
        return fetchPage(1, pageSize);
      }
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Pagination error:', error);
    throw error;
  }
}
```

---

## SDK Generation

The Sensay API provides an OpenAPI 3.0.0 specification for automatic SDK generation in multiple programming languages.

### Available Tools

- **HeyAPI** (recommended for TypeScript/JavaScript)
- **OpenAPI Generator** (50+ languages)
- **Swagger Codegen** (original generator)
- **NSwag** (.NET applications)
- **openapi-typescript** (TypeScript-specific)

**Full list:** [https://tools.openapis.org](https://tools.openapis.org)

### TypeScript SDK with HeyAPI

#### 1. Install HeyAPI

```bash
npm install @heyapi/cli
```

#### 2. Generate SDK

```bash
npx heyapi generate-sdk \
  --input="https://api.sensay.io/schema" \
  --output-dir="./sensay-sdk" \
  --language="typescript" \
  --client="fetch"
```

#### 3. Build SDK

```bash
cd sensay-sdk
npm install
npm run build
```

#### 4. Use in Application

```typescript
import { Configuration, DefaultApi } from './sensay-sdk';

// Configure SDK
const config = new Configuration({
  basePath: 'https://api.sensay.io',
  headers: {
    'X-ORGANIZATION-SECRET': 'your_secret_token',
    'X-API-Version': '2025-03-25',
    'Content-Type': 'application/json'
  }
});

// Initialize API client
const api = new DefaultApi(config);

// Create a user
const createUser = async () => {
  try {
    const response = await api.createUser({
      id: 'test_user_id'
    });
    console.log('User created:', response);
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

// Create a replica
const createReplica = async (userId: string) => {
  try {
    const response = await api.createReplica({
      name: 'My SDK Replica',
      shortDescription: 'Created with the generated SDK',
      greeting: 'Hello! I was created using a generated SDK.',
      ownerID: userId,
      private: false,
      slug: 'sdk-replica',
      llm: {
        provider: 'openai',
        model: 'gpt-4o'
      }
    });
    console.log('Replica created:', response);
    return response;
  } catch (error) {
    console.error('Error creating replica:', error);
  }
};

// Chat with replica
const chatWithReplica = async (replicaUuid: string, userId: string) => {
  try {
    const response = await api.chatCompletions(replicaUuid, {
      content: 'Hello, I\'m using the generated SDK!'
    }, {
      headers: {
        'X-USER-ID': userId,
        'X-ORGANIZATION-SECRET': 'your_secret_token',
        'X-API-Version': '2025-03-25',
        'Content-Type': 'application/json'
      }
    });
    console.log('Chat response:', response);
    return response;
  } catch (error) {
    console.error('Error chatting with replica:', error);
  }
};
```

### Authentication in SDK

```typescript
// Global configuration for all requests
const config = new Configuration({
  basePath: 'https://api.sensay.io/v1',
  headers: {
    // Required for all requests
    'X-ORGANIZATION-SECRET': 'your_secret_token',
    'X-API-Version': '2025-03-25',
    'Content-Type': 'application/json'
  }
});

// For user-specific operations
const response = await api.someUserSpecificOperation(params, {
  headers: {
    'X-USER-ID': 'user_id'
  }
});
```

### Supported Languages

- TypeScript/JavaScript (Node.js, Browser, React, Angular, Vue)
- Python
- Java
- C#/.NET
- Go
- Ruby
- PHP
- Swift
- Kotlin
- Rust
- Dart/Flutter

### SDK Best Practices

1. **Version your SDK:** Always specify API version for compatibility
2. **Error handling:** Implement proper error handling for API errors
3. **Secure tokens:** Never hardcode secrets in client-side code
4. **Rate limiting:** Implement retry mechanisms and respect rate limits
5. **Stay updated:** Regenerate SDK regularly for new features

⚠️ **Security Note:** Never hardcode your organization's secret token in client-side code. Always use environment variables or secure configuration management.

---

*[This is the first part of the documentation. The content continues with Core Concepts, detailed endpoint documentation, Training & Knowledge Base, Conversations, Analytics, Integrations, Tutorials, and Troubleshooting sections. Would you like me to continue with the next sections?]*