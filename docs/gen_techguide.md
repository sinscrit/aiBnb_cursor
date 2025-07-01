## Frontend API Client

The frontend uses a centralized API client based on Axios for all backend communication. The client is configured with:

- Automatic error handling and user-friendly messages
- Request/response interceptors for debugging
- Retry mechanism for failed requests
- Loading state management
- CORS handling via Next.js proxy

### Error Handling

The API client includes comprehensive error handling:

1. Network Errors:
   - Automatic retry mechanism
   - User-friendly error messages
   - Detailed error logging for debugging

2. HTTP Status Codes:
   - 401: Authentication required
   - 403: Access denied
   - 404: Resource not found
   - 422: Validation error
   - 500: Server error

3. Loading States:
   - Automatic loading indicators
   - Retry counters
   - Progress feedback

### Configuration

The API client is configured in `frontend/utils/api.js` and uses constants from `frontend/utils/constants.js`. Key features:

- Base URL: `/api` (proxied through Next.js)
- Timeout: 10 seconds
- Authentication: Demo user token
- CORS: Handled via Next.js proxy

### Usage Example

```javascript
import { apiService, apiHelpers } from '../utils/api';

// Get all properties
const response = await apiService.properties.getAll();
const data = apiHelpers.extractData(response);

// Create a property
const response = await apiService.properties.create(propertyData);
const data = apiHelpers.extractData(response);

// Handle errors
try {
  const response = await apiService.properties.delete(id);
  const data = apiHelpers.extractData(response);
} catch (error) {
  const errorInfo = apiHelpers.handleError(error);
  // errorInfo.message contains user-friendly message
  // errorInfo.details contains technical details
}
``` 