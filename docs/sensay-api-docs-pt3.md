## Integrations

The Sensay API supports multiple platform integrations, allowing your replicas to interact across various communication channels.

### Available Integration Platforms

| Platform | Purpose | Key Features |
|----------|---------|--------------|
| **Telegram** | Bot messaging | Direct messages, group chats, bot commands |
| **Discord** | Server integration | Channel messages, slash commands, role-based access |
| **Web Widget** | Website embedding | Customizable chat widget, website integration |
| **Web Interface** | Native platform | Full-featured web application |

### Telegram Integration

Telegram bots provide direct messaging capabilities and group chat integration for your replicas.

#### Create Telegram Integration
```bash
curl -X POST https://api.sensay.io/v1/replicas/$REPLICA_UUID/telegram \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json" \
-d '{
  "botToken": "your_telegram_bot_token",
  "serviceName": "my-replica-bot"
}'
```

#### Get Telegram Chat History
```bash
curl -X GET https://api.sensay.io/v1/replicas/$REPLICA_UUID/telegram/history \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-USER-ID: $USER_ID" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json"
```

#### Generate Telegram Completion
```bash
curl -X POST https://api.sensay.io/v1/replicas/$REPLICA_UUID/telegram/completions \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-USER-ID: $USER_ID" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json" \
-d '{
  "content": "Hello from Telegram!",
  "telegramUserId": "123456789",
  "telegramChatId": "987654321"
}'
```

#### Delete Telegram Integration
```bash
curl -X DELETE https://api.sensay.io/v1/replicas/$REPLICA_UUID/telegram \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json"
```

### Discord Integration

Discord integration enables your replica to participate in server conversations and respond to mentions.

#### Get Discord Chat History
```bash
curl -X GET https://api.sensay.io/v1/replicas/$REPLICA_UUID/discord/history \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-USER-ID: $USER_ID" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json"
```

### Chat Widget Integration

Embed chat widgets on your website to provide direct access to your replicas.

#### Get Embed Chat History
```bash
curl -X GET https://api.sensay.io/v1/replicas/$REPLICA_UUID/embed/history \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-USER-ID: $USER_ID" \
-H "X-API-Version: $API_VERSION" \
-H "Content-Type: application/json"
```

#### Widget Implementation Example
```html
<!-- Basic chat widget integration -->
<div id="sensay-chat-widget"></div>
<script>
(function() {
  window.SensayWidget = {
    replicaId: 'your-replica-uuid',
    containerId: 'sensay-chat-widget',
    config: {
      theme: 'light',
      position: 'bottom-right',
      greeting: 'Hello! How can I help you today?'
    }
  };
  
  var script = document.createElement('script');
  script.src = 'https://cdn.sensay.io/widget.js';
  script.async = true;
  document.head.appendChild(script);
})();
</script>
```

### Integration Best Practices

#### Security
- **Token management:** Securely store bot tokens and API keys
- **Rate limiting:** Implement proper rate limiting for all integrations
- **Error handling:** Gracefully handle integration failures
- **Monitoring:** Track integration performance and errors

#### User Experience
- **Consistent persona:** Maintain replica personality across platforms
- **Context awareness:** Consider platform-specific user expectations
- **Response optimization:** Adapt response length and format for each platform
- **Fallback handling:** Provide graceful degradation when integrations fail

---

## Tutorials

### Next.js Tutorial: Building a Chat Application

This comprehensive tutorial walks through building a modern chat application using Sensay API with Next.js and TypeScript.

#### Demo & Source Code

- **🚀 Live Demo:** [https://sensay-api-chat-tutorial-sensay.vercel.app/](https://sensay-api-chat-tutorial-sensay.vercel.app/)
- **📁 Source Code:** [https://github.com/sensay-io/chat-client-sample](https://github.com/sensay-io/chat-client-sample)

#### Prerequisites

Before starting, ensure you have:
- **Node.js 18+** (recommend using fnm for version management)
- **Sensay API key** (request at [API Key Form](https://sensay.io/api-request))
- **Basic knowledge** of React, TypeScript, and Next.js
- **Git** for cloning the repository

#### Quick Start

**1. Clone and Setup**
```bash
git clone https://github.com/sensay-io/chat-client-sample.git
cd chat-client-sample
npm install
```

**2. Configure Environment**

Create `.env.local`:
```bash
NEXT_PUBLIC_SENSAY_API_KEY=your_api_key_here
```

**3. Run Application**
```bash
npm run dev
```

Access the application at `http://localhost:3000`.

#### Application Architecture

The sample application demonstrates:
- **SDK Generation:** Uses `openapi-typescript-codegen` for fully typed client
- **Authentication Flow:** Both organization and user-level authentication
- **Chat Interface:** Responsive UI with React and Tailwind CSS
- **State Management:** Proper handling of users, replicas, and conversations

#### Key Implementation Patterns

**Client Initialization**
```typescript
import { Client } from './sdk';

// Organization-level authentication (admin access)
const organizationClient = new Client({
  BASE: 'https://api.sensay.io',
  HEADERS: {
    'X-ORGANIZATION-SECRET': apiKey,
    'Content-Type': 'application/json',
  },
});

// User-level authentication
const userClient = new Client({
  BASE: 'https://api.sensay.io',
  HEADERS: {
    'X-ORGANIZATION-SECRET': apiKey,
    'X-USER-ID': userId,
    'Content-Type': 'application/json',
  },
});
```

**User Management**
```typescript
async function ensureUserExists(userId: string) {
  try {
    const user = await organizationClient.users.getUsersGet({ id: userId });
    console.log('User exists:', user);
    return user;
  } catch (error) {
    if (error.status === 404) {
      // Create user if not found
      const newUser = await organizationClient.users.createUsersPost({ id: userId });
      console.log('Created new user:', newUser);
      return newUser;
    }
    throw error;
  }
}
```

**Replica Management**
```typescript
async function getOrCreateReplica(userId: string) {
  // List existing replicas
  const replicas = await userClient.replicas.listReplicasGet();
  
  if (replicas.items.length === 0) {
    // Create new replica if none exists
    const newReplica = await userClient.replicas.createReplicaPost({
      name: `Sample Replica ${Date.now()}`,
      shortDescription: 'A helpful assistant for demonstration purposes',
      greeting: 'Hello! I am a sample replica. How can I help you today?',
      ownerID: userId,
      private: false,
      slug: `sample-replica-${Date.now()}`,
      llm: {
        provider: 'openai',
        model: 'gpt-4o',
      },
    });
    return newReplica.uuid;
  }
  
  // Use existing replica
  return replicas.items[0].uuid;
}
```

**Chat Implementation**
```typescript
async function sendMessage(replicaId: string, message: string) {
  try {
    const response = await userClient.replicaChatCompletions.createChatCompletionPost({
      replicaUuid: replicaId,
      content: message,
    });
    
    if (response.success) {
      // Update chat history
      setMessages(prev => [
        ...prev,
        { role: 'user', content: message },
        { role: 'assistant', content: response.content },
      ]);
    }
  } catch (error) {
    console.error('Chat error:', error);
  }
}
```

#### Advanced Features

**SDK Regeneration**
```bash
npm run generate-sdk
```

This script fetches the latest OpenAPI specification and generates updated TypeScript client code, ensuring you always have access to the latest API features.

**Error Handling**
```typescript
function handleApiError(error: any) {
  switch (error.status) {
    case 401:
      return 'Invalid API key or user not found';
    case 403:
      return 'Permission denied';
    case 429:
      return 'Rate limit exceeded';
    case 500:
      return 'Internal server error';
    default:
      return 'An unexpected error occurred';
  }
}
```

#### Deployment

The sample application can be deployed to various platforms:

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

**Other Options:**
- Netlify
- AWS Amplify
- Docker containers
- Traditional hosting

#### Customization Ideas

- **UI Theming:** Adapt interface to match your brand
- **Multi-Replica Support:** Allow users to chat with different replicas
- **Voice Integration:** Add speech-to-text and text-to-speech
- **File Sharing:** Enable file uploads in conversations
- **Real-time Updates:** Implement WebSocket for live updates

#### Troubleshooting

**Common Issues:**

- **Authentication errors:** Verify API key and user setup
- **Type errors:** Regenerate SDK after API updates
- **Rate limiting:** Implement retry mechanisms
- **CORS issues:** Ensure proper server-side API calls

---

## Troubleshooting

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|--------|----------|
| **Cannot find replica** | User doesn't belong to same organization or replica is private | Ensure user ownership or make replica public |
| **HTTP 401** | Authentication failure | Check API key, organization status, and user existence |
| **HTTP 415** | Missing Content-Type header | Add `Content-Type: application/json` header |
| **HTTP 429** | Rate limit exceeded | Implement backoff strategy and respect rate limits |
| **Timeout** | Request takes >90 seconds | Optimize request size or report persistent timeouts |
| **HTTP 500** | Internal server error | Note `fingerprint` and `requestID`, report the issue |

### Detailed Troubleshooting

#### Authentication Issues

**Problem:** Receiving 401 Unauthorized errors

**Solutions:**
1. Verify your API key is correct and active
2. Ensure you're including required headers:
   ```bash
   X-ORGANIZATION-SECRET: your_token
   Content-Type: application/json
   X-API-Version: 2025-03-25  # recommended
   ```
3. For user operations, include:
   ```bash
   X-USER-ID: user_identifier
   ```
4. Check that your organization is active
5. Verify the user exists in your organization

#### Replica Access Issues

**Problem:** "User cannot access replica" errors

**Diagnosis:**
```bash
# Check if replica exists and is accessible
curl -X GET https://api.sensay.io/v1/replicas/$REPLICA_UUID \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-USER-ID: $USER_ID"
```

**Solutions:**
1. Ensure replica belongs to same organization as user
2. Check replica visibility (private vs public)
3. Verify user owns the replica or replica is public
4. Confirm replica UUID is correct

#### Rate Limiting

**Problem:** HTTP 429 errors

**Implementation:**
```javascript
async function apiRequestWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;
        
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      return response;
    } catch (error) {
      if (attempt === maxRetries) throw error;
    }
  }
}
```

#### Content-Type Issues

**Problem:** HTTP 415 Unsupported Media Type

**Solution:** Always include proper Content-Type header:
```bash
curl -X POST https://api.sensay.io/v1/endpoint \
-H "Content-Type: application/json" \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-d '{"key": "value"}'
```

#### Training Issues

**Problem:** Knowledge base entries stuck in processing

**Diagnosis:**
```bash
curl -X GET https://api.sensay.io/v1/replicas/$REPLICA_UUID/training/$KNOWLEDGE_BASE_ID \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET"
```

**Solutions:**
1. Check entry status - wait if `PROCESSING`
2. If stuck in error state, delete and recreate entry
3. For file uploads, ensure file size is under 50MB
4. Verify file format is supported (PDF, TXT, DOCX, etc.)

#### SDK Issues

**Problem:** TypeScript errors after API updates

**Solutions:**
1. Regenerate SDK: `npm run generate-sdk`
2. Check for breaking changes in API announcements
3. Update your code to match new API structure
4. Verify API version compatibility

#### Network and Timeout Issues

**Problem:** Request timeouts or connection failures

**Debugging:**
```bash
# Test basic connectivity
curl -I https://api.sensay.io/v1/

# Check specific endpoint
curl -X GET https://api.sensay.io/v1/replicas \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-w "Time: %{time_total}s\nStatus: %{http_code}\n"
```

**Solutions:**
1. Check internet connectivity
2. Verify API endpoint URLs are correct
3. Implement timeout handling in your code
4. For persistent issues, report with request details

### Error Response Format

When errors occur, the API returns structured error responses:

```json
{
  "success": false,
  "message": "Detailed error description",
  "code": "ERROR_CODE",
  "fingerprint": "unique-error-identifier",
  "requestID": "request-tracking-id",
  "details": {
    "field": "Additional context"
  }
}
```

**Important:** When reporting errors, always include the `fingerprint` and `requestID` values.

### Getting Help

#### Bug Reports
Report bugs at: [https://sensay.canny.io/bugs](https://sensay.canny.io/bugs)

Include:
- Complete error message
- `fingerprint` and `requestID` from error response
- Steps to reproduce
- Expected vs actual behavior
- API version used

#### Community Support
- **Telegram Channel:** [Sensay API Announcements](https://t.me/sensay_api_announcements)
- **Documentation:** [https://docs.sensay.io](https://docs.sensay.io)

#### Development Tips

**API Testing:**
```bash
# Test with verbose output
curl -v -X GET https://api.sensay.io/v1/replicas \
-H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
-H "X-API-Version: 2025-03-25" \
-H "Content-Type: application/json"
```

**Logging Best Practices:**
```javascript
// Log all API requests and responses
const apiClient = new Client({
  BASE: 'https://api.sensay.io',
  HEADERS: {
    'X-ORGANIZATION-SECRET': process.env.ORGANIZATION_SECRET,
    'X-API-Version': '2025-03-25',
    'Content-Type': 'application/json'
  },
  middleware: [
    {
      pre: (request) => {
        console.log('API Request:', {
          url: request.url,
          method: request.method,
          headers: request.headers
        });
      },
      post: (response) => {
        console.log('API Response:', {
          status: response.status,
          headers: response.headers
        });
      }
    }
  ]
});
```

---

## Feature Requests

### How to Submit Feature Requests

The Sensay API team actively collects and reviews feature requests from the developer community.

**Submit your feature request:** [https://sensay.canny.io/features](https://sensay.canny.io/features)

### What to Include

When submitting feature requests, please provide:

1. **Clear Use Case:** Describe the problem you're trying to solve
2. **Proposed Solution:** Suggest how the feature might work
3. **Impact:** Explain who would benefit and how
4. **Examples:** Provide concrete examples or mockups if possible
5. **Alternatives:** Mention any workarounds you've considered

### Popular Feature Request Categories

#### API Enhancements
- New endpoint functionality
- Additional query parameters
- Enhanced filtering options
- Batch operations

#### Integration Improvements
- New platform integrations
- Enhanced webhook support
- Real-time features
- Advanced authentication methods

#### Developer Experience
- SDK improvements
- Better error messages
- Enhanced documentation
- Testing tools

#### Analytics and Monitoring
- New metrics and insights
- Performance monitoring
- Usage analytics
- Custom reporting

### Feature Request Process

1. **Submission:** Submit via the Canny portal
2. **Community Voting:** Other developers can upvote your request
3. **Team Review:** Sensay team evaluates feasibility and priority
4. **Development:** High-priority features enter development
5. **Release:** Features are announced via the Telegram channel
6. **Documentation:** New features are documented upon release

### Staying Updated

- **📢 Telegram Channel:** [Sensay API Announcements](https://t.me/sensay_api_announcements) - Breaking changes and new features
- **📝 API Changelog:** Available in the API documentation
- **🔄 Feature Portal:** Track your requests at [https://sensay.canny.io/features](https://sensay.canny.io/features)

---

## Appendix

### API Version History

| Version | Release Date | Key Changes |
|---------|--------------|-------------|
| 2025-03-25 | March 25, 2025 | Current stable version |
| Earlier versions | Various | Legacy support available |

### Rate Limits

Current rate limits (subject to change):
- **Default:** 100 requests per minute per organization
- **Training:** 10 file uploads per hour
- **Chat completions:** 1000 requests per hour

Contact support for higher limits if needed.

### Supported File Types

**Training uploads:**
- PDF documents
- Text files (.txt, .md)
- Microsoft Word documents (.docx)
- HTML files
- Maximum size: 50MB per file

### LLM Provider Support

Currently supported language model providers:
- **OpenAI:** GPT-4o, GPT-4, GPT-3.5-turbo
- Additional providers may be available - check latest documentation

### Security Considerations

#### API Key Management
- Never expose API keys in client-side code
- Use environment variables or secure configuration management
- Rotate keys regularly
- Monitor key usage for unauthorized access

#### Data Privacy
- All data transmission uses HTTPS encryption
- Organizations are completely isolated
- Message history is private to the conversation participants
- Training data is isolated per replica

#### Best Practices
- Implement proper authentication flows
- Validate all user inputs
- Use HTTPS for all API communications
- Monitor for unusual API usage patterns
- Implement proper error handling

### Support and Community

#### Official Channels
- **Documentation:** [https://docs.sensay.io](https://docs.sensay.io)
- **API Portal:** [https://api.sensay.io/ui](https://api.sensay.io/ui)
- **Bug Reports:** [https://sensay.canny.io/bugs](https://sensay.canny.io/bugs)
- **Feature Requests:** [https://sensay.canny.io/features](https://sensay.canny.io/features)

#### Getting Started Resources
- **API Key Request:** [API Account Request Form](https://sensay.io/api-request)
- **Sample Applications:** [GitHub Repository](https://github.com/sensay-io/chat-client-sample)
- **Interactive Testing:** [Swagger UI](https://api.sensay.io/ui)

---

**© 2025 Sensay Platform. This documentation is subject to updates and improvements. For the latest information, visit [https://docs.sensay.io](https://docs.sensay.io).**