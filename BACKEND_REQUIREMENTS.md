# Backend API Requirements for Agent Dashboard

## Issue
Agent dashboard cannot fetch rental requests - all endpoints return **403 Forbidden**

## Root Cause
The backend doesn't have agent-specific rental endpoints implemented or properly secured.

## Required Endpoints

### ✅ RECOMMENDED: JWT-Based Endpoint
```
GET /api/rentals/agent
Authorization: Bearer {token}

Description: Returns all rental requests for cars owned by the authenticated agent
Response: Array of rental objects with user and car details
```

**Implementation tip:** Extract agentId from JWT token, query rentals where `rental.car.agentId = agentId`

---

### Alternative Options

#### Option 2: Agent ID Parameter
```
GET /api/rentals/agent/:agentId
Authorization: Bearer {token}

Description: Returns rental requests for specific agent
Security: Verify logged-in user matches agentId or is superadmin
```

#### Option 3: Query Parameter
```
GET /api/rentals?agentId={agentId}
Authorization: Bearer {token}

Description: Filter rentals by agent ID
Security: Verify logged-in user matches agentId or is superadmin
```

---

## Expected Response Format

```json
{
  "data": [
    {
      "rentalId": 1,
      "status": "pending",
      "startDate": "2024-01-15",
      "endDate": "2024-01-20",
      "totalPrice": 500,
      "requestDate": "2024-01-10",
      "car": {
        "carId": 5,
        "brand": "Tesla",
        "model": "Model 3",
        "agentId": 2
      },
      "user": {
        "userId": 10,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      }
    }
  ]
}
```

---

## Frontend Implementation

The frontend already has **3-strategy fallback** system:
1. Tries `GET /rentals/agent`
2. Falls back to `GET /rentals/agent/{agentId}`
3. Falls back to `GET /rentals?agentId={agentId}`

Once any of these endpoints are implemented on the backend, the agent dashboard will automatically work.

---

## Testing

1. Create the endpoint on backend
2. Restart backend server
3. Refresh agent dashboard page
4. Check browser console for success logs
5. Rental requests should appear in the dashboard

---

## Current Frontend Status

✅ Agent dashboard loads without crashing  
✅ Shows helpful error message when endpoints unavailable  
✅ Detailed logging in browser console  
✅ NotificationIcon component ready for pending count  
✅ All UI components ready to display rental data  

⏳ **Waiting for backend rental endpoints to be implemented**
