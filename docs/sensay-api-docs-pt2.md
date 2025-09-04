## Core Concepts

### Organizations
- **Top-level entity** that contains all other resources
- Complete isolation between organizations
- Owns users, replicas, training data, and API configurations
- Manages access control and billing

### Users
- Belong to a single organization
- Can own multiple replicas
- Can interact with public replicas within their organization
- Support for linked accounts (social media, email, etc.)

### Replicas
- AI entities that represent specific personas or assistants
- Owned by a single user within an organization
- Can be **public** (accessible by all organization users) or **private** (owner only)
- Trained on custom knowledge bases
- Support multiple LLM providers (OpenAI, etc.)

### Knowledge Base
- Collection of information used to train replicas
- Supports text content and file uploads (up to 50MB)
- Goes through processing stages: Raw → Processed → Vector
- Enables contextually relevant responses

### Conversations
- Interactions between users and replicas
- Support multiple sources: web, telegram, discord, embed
- Maintain message history for context
- Support cursor-based pagination for efficient navigation

---

## Endpoints

The Sensay API is organized into logical endpoint groups. All endpoints use the base URL `https://api.sensay.io/v1/`.

### Core Endpoint Groups

| Group | Purpose | Key Operations |
|-------|---------|----------------|
| **Replicas** | Manage AI replicas | Create, list, update, delete replicas |
| **Users** | User management | Create users, manage linked accounts |
| **Training** | Knowledge base management | Add content, upload files, manage training data |
| **Chat Completions** | AI interactions | Generate responses, OpenAI-compatible interface |
| **Conversations** | Message history | Browse conversations, navigate message history |
| **Analytics** | Usage insights | Historical data, source analytics |
| **Integrations** | Platform connections | Telegram, Discord, web widget support |

---

## Training & Knowledge Base

Training is essential for creating personalized replicas that provide accurate, contextually relevant responses based on your specific content.

### Knowledge Base Workflow

Every knowledge base entry progresses through three stages:

1. **Raw Text Stage** - Your initial, unprocessed content
2. **Processed Text Stage** - System-optimized content for better retrieval
3. **Vector Stage** - Mathematical representation enabling semantic search

### Adding Content Methods

#### Method 1: Direct Text Content

**Step 1: Create Knowledge Base Entry**
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

**Step 2: Add Text Content**
```bash
curl -X PUT https://api.sensay.io/v1/replicas/$REPLICA_UUID/training/$KNOWLEDGE_BASE_ID \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json" \
-d '{
  "rawText": "Your comprehensive training content goes here. This can include product information, company policies, FAQs, or any specialized knowledge you want your replica to access."
}'
```

#### Method 2: File Upload

**Step 1: Get Signed Upload URL**
```bash
curl -X GET "https://api.sensay.io/v1/replicas/$REPLICA_UUID/training/files/upload?filename=your_file.pdf" \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "signedURL": "https://storage.googleapis.com/...",
  "knowledgeBaseID": 12345
}
```

**Step 2: Upload File**
```bash
curl -X PUT "$SIGNED_URL" \
-H "Content-Type: application/octet-stream" \
--data-binary @/path/to/your/file.pdf
```

**Supported File Types:**
- PDF documents
- Text files (.txt, .md)
- Microsoft Word documents (.docx)
- Web pages (HTML)
- File size limit: 50MB

### Managing Knowledge Base Entries

#### List All Entries
```bash
curl -X GET https://api.sensay.io/v1/replicas/$REPLICA_UUID/training \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json"
```

#### Get Specific Entry
```bash
curl -X GET https://api.sensay.io/v1/replicas/$REPLICA_UUID/training/$KNOWLEDGE_BASE_ID \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json"
```

**Response Example:**
```json
{
  "success": true,
  "id": 12345,
  "replica_uuid": "12345678-1234-1234-1234-123456789abc",
  "type": "text",
  "filename": null,
  "status": "READY",
  "raw_text": "Your training text content...",
  "processed_text": "Optimized version of your content...",
  "created_at": "2025-04-15T08:11:00.093761+00:00",
  "updated_at": "2025-04-15T08:11:05.299349+00:00",
  "title": null,
  "description": null
}
```

#### Delete Entry
```bash
curl -X DELETE https://api.sensay.io/v1/replicas/$REPLICA_UUID/training/$KNOWLEDGE_BASE_ID \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json"
```

### Knowledge Base Status Values

| Status | Description |
|--------|-------------|
| `BLANK` | Initial state for newly created text entry |
| `AWAITING_UPLOAD` | File entry created, awaiting file upload |
| `SUPABASE_ONLY` | File uploaded but not yet processed |
| `PROCESSING` | Entry is being processed |
| `READY` | Fully processed and available for retrieval |
| `SYNC_ERROR` | Synchronization error occurred |
| `ERR_FILE_PROCESSING` | File processing error |
| `ERR_TEXT_PROCESSING` | Text processing error |
| `ERR_TEXT_TO_VECTOR` | Vector conversion error |

### Training Best Practices

#### Content Guidelines
- **Be specific:** Provide detailed, accurate information
- **Use clear language:** Avoid jargon unless necessary
- **Structure content:** Use headings and bullet points for clarity
- **Include examples:** Provide concrete examples for complex topics
- **Regular updates:** Keep content current and relevant

#### Performance Optimization
- **Chunk large documents:** Break very long content into logical sections
- **Remove duplicates:** Avoid redundant information across entries
- **Quality over quantity:** Focus on relevant, high-quality content
- **Monitor status:** Check processing status and handle errors promptly

---

## Conversations

The Sensay API provides sophisticated conversation management with cursor-based pagination for efficient navigation through large message histories.

### Conversation Structure

Conversations consist of:
- **Mentions**: Groups of messages where replica interactions occurred
- **Messages**: Individual chat messages with full context
- **Placeholders**: Collapsed groups of messages (typically user-only stretches)

### Recommended Workflow

1. **List conversations** to get conversation overview
2. **Retrieve mentions** for focused replica interactions
3. **Expand placeholders** when detailed message context is needed

### Basic Conversation Operations

#### List Replica Conversations
```bash
curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/conversations?page=1&pageSize=20" \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json"
```

#### Get Conversation Details
```bash
curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/conversations/{conversationUUID}" \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json"
```

### Mentions Navigation

Mentions provide the most relevant parts of conversations - interactions where the replica was involved.

#### Get Latest Mentions
```bash
curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/conversations/{conversationUUID}/mentions?limit=20" \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "type": "mention",
      "messages": [
        {
          "uuid": "03db5651-cb61-4bdf-9ef0-89561f7c9c53",
          "content": "Hello, how are you?",
          "role": "user",
          "createdAt": "2024-09-24T09:09:55.66709+00:00",
          "source": "web",
          "replicaUUID": "f0e4c2f7-ae27-4b35-89bf-7cf729a73687"
        },
        {
          "uuid": "04ea3f1b-df72-4c98-a8f1-2ef820b5c94d",
          "content": "I'm doing well, thank you for asking!",
          "role": "assistant",
          "createdAt": "2024-09-24T09:10:15.33421+00:00",
          "source": "web",
          "replicaUUID": "f0e4c2f7-ae27-4b35-89bf-7cf729a73687"
        }
      ]
    },
    {
      "type": "placeholder",
      "count": 15
    }
  ],
  "count": 2
}
```

#### Navigate Mentions (Cursor-based)

**Get older mentions:**
```bash
curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/conversations/{conversationUUID}/mentions?limit=20&beforeUUID=03db5651-cb61-4bdf-9ef0-89561f7c9c53" \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION"
```

**Get newer mentions:**
```bash
curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/conversations/{conversationUUID}/mentions?limit=20&afterUUID=ec46b4db-3f0d-4392-b0f5-9fe327922e8a" \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION"
```

### Message Expansion

Use the messages endpoint to expand placeholder groups and get detailed message context.

#### Expand Placeholder Messages
```bash
curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/conversations/{conversationUUID}/messages?limit=20&beforeUUID=03db5651-cb61-4bdf-9ef0-89561f7c9c53" \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json"
```

### Cursor-Based Pagination Implementation

```javascript
async function loadConversationHistory(replicaUUID, conversationUUID) {
  // Start with latest mentions
  const response = await fetch(
    `/v1/replicas/${replicaUUID}/conversations/${conversationUUID}/mentions?limit=20`
  );
  const data = await response.json();
  
  return data.items;
}

async function loadNextPage(replicaUUID, conversationUUID, lastMessageUUID) {
  const response = await fetch(
    `/v1/replicas/${replicaUUID}/conversations/${conversationUUID}/mentions?limit=20&beforeUUID=${lastMessageUUID}`
  );
  return response.json();
}

async function expandPlaceholder(replicaUUID, conversationUUID, firstMessageUUID) {
  const response = await fetch(
    `/v1/replicas/${replicaUUID}/conversations/${conversationUUID}/messages?limit=20&afterUUID=${firstMessageUUID}`
  );
  return response.json();
}

// Usage example
const mentions = await loadConversationHistory('replica-uuid', 'conversation-uuid');
const placeholders = mentions.filter(item => item.type === 'placeholder');

// Expand the first placeholder
if (placeholders.length > 0) {
  const expandedMessages = await expandPlaceholder(
    'replica-uuid', 
    'conversation-uuid', 
    'message-uuid-before-placeholder'
  );
}
```

### Message Types and Structure

#### Mention Items
```json
{
  "type": "mention",
  "messages": [
    {
      "uuid": "unique-message-id",
      "content": "message text",
      "role": "user|assistant",
      "createdAt": "2024-09-24T09:09:55.66709+00:00",
      "source": "web|telegram|discord|embed",
      "replicaUUID": "replica-identifier"
    }
  ]
}
```

#### Placeholder Items
```json
{
  "type": "placeholder",
  "count": 15
}
```

### Best Practices

#### Performance
- **Use appropriate limits:** 10-50 items for UI, up to 100 for processing
- **Cache responses:** Message content rarely changes once created
- **Load incrementally:** Fetch additional pages as needed

#### Error Handling
```javascript
async function safeConversationRequest(url) {
  try {
    const response = await fetch(url);
    if (response.status === 400) {
      // Invalid UUID, start from beginning
      return loadConversationHistory();
    }
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Conversation request error:', error);
    throw error;
  }
}
```

#### UI Implementation
- **Loading states:** Show indicators during pagination
- **Empty states:** Handle conversations with no interactions
- **Real-time updates:** Consider how new messages affect pagination
- **Efficient scrolling:** Implement virtual scrolling for long conversations

---

## Analytics

The Sensay API provides comprehensive analytics to help you understand replica usage patterns, conversation trends, and user engagement across different platforms.

### Analytics Overview

Analytics endpoints offer:
- **Historical conversation data** - Track growth over time
- **Source distribution** - Understand platform usage
- **Aggregated insights** - Privacy-focused summary statistics
- **Performance metrics** - Monitor replica effectiveness

> **Note:** All analytics endpoints are currently experimental and may change in future API versions.

### Historical Conversation Analytics

Track conversation volume growth over the last 30 days with cumulative totals.

#### Get Historical Data
```bash
curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/analytics/conversations/historical" \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "items": [
    { "date": "2025-05-01", "cumulativeConversations": 100 },
    { "date": "2025-05-02", "cumulativeConversations": 103 },
    { "date": "2025-05-03", "cumulativeConversations": 108 },
    { "date": "2025-05-04", "cumulativeConversations": 115 }
  ]
}
```

#### Understanding Historical Data

- **Cumulative counts:** Each day shows total conversations created up to that date
- **30-day window:** Always returns exactly 30 data points
- **Historical inclusion:** Pre-window conversations included in totals
- **UTC boundaries:** All dates based on UTC midnight
- **Chronological order:** Dates returned in ascending order (YYYY-MM-DD format)

#### Implementation Example

```javascript
async function getGrowthAnalytics(replicaUUID) {
  const response = await fetch(
    `/v1/replicas/${replicaUUID}/analytics/conversations/historical`,
    {
      headers: {
        'X-ORGANIZATION-SECRET': process.env.ORGANIZATION_SECRET,
        'X-API-Version': '2025-03-25',
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`Analytics request failed: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Calculate daily growth
  const dailyGrowth = data.items.slice(1).map((day, index) => ({
    date: day.date,
    newConversations: day.cumulativeConversations - data.items[index].cumulativeConversations
  }));
  
  return { historical: data.items, dailyGrowth };
}
```

### Source Analytics

Understand how conversations are distributed across different communication platforms.

#### Get Source Distribution
```bash
curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/analytics/conversations/sources" \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "items": [
    { "source": "telegram", "conversations": 245 },
    { "source": "discord", "conversations": 123 },
    { "source": "web", "conversations": 89 },
    { "source": "embed", "conversations": 34 }
  ]
}
```

#### Available Sources

| Source | Description |
|--------|-------------|
| `telegram` | Conversations from Telegram bot interactions |
| `discord` | Conversations from Discord bot interactions |
| `web` | Conversations from the web interface (sensay.io) |
| `embed` | Conversations from embedded widgets on websites |

#### Source Analysis Example

```javascript
async function analyzeSourceDistribution(replicaUUID) {
  const response = await fetch(
    `/v1/replicas/${replicaUUID}/analytics/conversations/sources`,
    {
      headers: {
        'X-ORGANIZATION-SECRET': process.env.ORGANIZATION_SECRET,
        'X-API-Version': '2025-03-25',
        'Content-Type': 'application/json'
      }
    }
  );
  
  const { items: sources } = await response.json();
  
  // Calculate percentages and totals
  const totalConversations = sources.reduce((sum, source) => sum + source.conversations, 0);
  const sourceAnalysis = sources.map(source => ({
    ...source,
    percentage: ((source.conversations / totalConversations) * 100).toFixed(1),
    isTopSource: source.conversations === Math.max(...sources.map(s => s.conversations))
  }));
  
  return {
    sources: sourceAnalysis,
    totalConversations,
    topSource: sourceAnalysis.find(s => s.isTopSource)?.source
  };
}
```

### Data Visualization

#### Historical Data Visualization
```javascript
// Prepare data for line chart
function prepareHistoricalChart(historicalData) {
  return {
    type: 'line',
    data: {
      labels: historicalData.map(d => d.date),
      datasets: [{
        label: 'Cumulative Conversations',
        data: historicalData.map(d => d.cumulativeConversations),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Total Conversations'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    }
  };
}
```

#### Source Distribution Visualization
```javascript
// Prepare data for pie chart
function prepareSourceChart(sourceData) {
  return {
    type: 'pie',
    data: {
      labels: sourceData.map(d => d.source.charAt(0).toUpperCase() + d.source.slice(1)),
      datasets: [{
        label: 'Conversations by Source',
        data: sourceData.map(d => d.conversations),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${context.label}: ${context.parsed} (${percentage}%)`;
            }
          }
        }
      }
    }
  };
}
```

### Analytics Best Practices

#### Performance Considerations
- **Cache results:** Analytics queries can be resource-intensive
- **Rate limiting:** Be mindful of API limits when analyzing multiple replicas
- **Batch processing:** Implement delays when processing multiple replicas
- **Efficient polling:** Don't over-fetch analytics data - daily updates are usually sufficient

#### Error Handling
```javascript
async function safeAnalyticsRequest(endpoint, replicaUUID) {
  try {
    const response = await fetch(`/v1/replicas/${replicaUUID}/analytics/${endpoint}`, {
      headers: {
        'X-ORGANIZATION-SECRET': process.env.ORGANIZATION_SECRET,
        'X-API-Version': '2025-03-25',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 404) {
      console.warn(`Replica ${replicaUUID} not found or no access`);
      return null;
    }
    
    if (response.status === 403) {
      throw new Error('Access denied to replica analytics');
    }
    
    if (!response.ok) {
      throw new Error(`Analytics request failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Analytics request error:', error);
    throw error;
  }
}
```

#### Usage Insights
- **Growth trends:** Monitor conversation volume changes over time
- **Platform optimization:** Focus development on high-usage sources
- **Engagement patterns:** Identify peak usage periods for optimal content updates
- **Performance monitoring:** Track conversation quality and user retention

### Analytics Limitations

- **Experimental status:** Endpoints may change or be enhanced
- **30-day window:** Historical data limited to recent period
- **Aggregate only:** No individual conversation details exposed
- **Access control:** Same permissions as other replica operations
- **Rate limits:** Subject to standard API rate limiting

---

*[This completes the second major section of the comprehensive documentation. The content continues with Integrations, Tutorials, and Troubleshooting sections. Would you like me to continue with the remaining sections?]*