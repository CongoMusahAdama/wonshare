# Postman Collection Template for Supreme Masquerade Society API

## Collection Setup

### Environment Variables
Create a new environment in Postman with these variables:
```
base_url: http://localhost:5000/api
auth_token: {{auth_token}}
user_id: {{user_id}}
branch_id: {{branch_id}}
event_id: {{event_id}}
payment_id: {{payment_id}}
```

---

## Authentication Endpoints

### 1. User Registration
**Method:** POST  
**URL:** `{{base_url}}/auth/register`  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```
**Body (raw JSON):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "phoneNumber": "+233123456789",
  "branch": "{{branch_id}}"
}
```
**Tests:**
```javascript
pm.test("Registration successful", function () {
    pm.response.to.have.status(201);
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.environment.set("auth_token", jsonData.token);
    pm.environment.set("user_id", jsonData.user.id);
});
```

### 2. User Login
**Method:** POST  
**URL:** `{{base_url}}/auth/login`  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```
**Body (raw JSON):**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```
**Tests:**
```javascript
pm.test("Login successful", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.environment.set("auth_token", jsonData.token);
});
```

### 3. Logout
**Method:** POST  
**URL:** `{{base_url}}/auth/logout`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}",
  "Content-Type": "application/json"
}
```

### 4. Forgot Password
**Method:** POST  
**URL:** `{{base_url}}/auth/forgot-password`  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```
**Body (raw JSON):**
```json
{
  "email": "john.doe@example.com"
}
```

---

## User Management Endpoints

### 1. Get User Profile
**Method:** GET  
**URL:** `{{base_url}}/users/profile`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}"
}
```

### 2. Update User Profile
**Method:** PUT  
**URL:** `{{base_url}}/users/profile`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}",
  "Content-Type": "application/json"
}
```
**Body (raw JSON):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+233123456789",
  "address": "123 Main St, Accra, Ghana"
}
```

### 3. Get All Users (Admin)
**Method:** GET  
**URL:** `{{base_url}}/users`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}"
}
```

---

## Branch Management Endpoints

### 1. Create Branch
**Method:** POST  
**URL:** `{{base_url}}/branches`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}",
  "Content-Type": "application/json"
}
```
**Body (raw JSON):**
```json
{
  "name": "Accra Central Branch",
  "description": "Main branch in Accra Central",
  "address": "123 Independence Avenue, Accra",
  "contactNumber": "+233123456789",
  "email": "accra@suprememasquerade.com"
}
```
**Tests:**
```javascript
pm.test("Branch created successfully", function () {
    pm.response.to.have.status(201);
    var jsonData = pm.response.json();
    pm.environment.set("branch_id", jsonData.data._id);
});
```

### 2. Get All Branches
**Method:** GET  
**URL:** `{{base_url}}/branches`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}"
}
```

### 3. Get Branch by ID
**Method:** GET  
**URL:** `{{base_url}}/branches/{{branch_id}}`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}"
}
```

### 4. Update Branch
**Method:** PUT  
**URL:** `{{base_url}}/branches/{{branch_id}}`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}",
  "Content-Type": "application/json"
}
```
**Body (raw JSON):**
```json
{
  "name": "Updated Branch Name",
  "description": "Updated description"
}
```

---

## Event Management Endpoints

### 1. Create Event
**Method:** POST  
**URL:** `{{base_url}}/events`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}",
  "Content-Type": "application/json"
}
```
**Body (raw JSON):**
```json
{
  "title": "Annual Masquerade Ball",
  "description": "Join us for our annual masquerade ball",
  "date": "2024-12-25T19:00:00.000Z",
  "location": "Grand Hotel, Accra",
  "branch": "{{branch_id}}",
  "type": "social",
  "maxAttendees": 100,
  "registrationFee": 50.00
}
```
**Tests:**
```javascript
pm.test("Event created successfully", function () {
    pm.response.to.have.status(201);
    var jsonData = pm.response.json();
    pm.environment.set("event_id", jsonData.data._id);
});
```

### 2. Get All Events
**Method:** GET  
**URL:** `{{base_url}}/events`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}"
}
```

### 3. RSVP to Event
**Method:** POST  
**URL:** `{{base_url}}/events/{{event_id}}/rsvp`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}",
  "Content-Type": "application/json"
}
```
**Body (raw JSON):**
```json
{
  "attending": true,
  "guestCount": 1,
  "dietaryRequirements": "Vegetarian"
}
```

---

## Payment Management Endpoints

### 1. Create Payment
**Method:** POST  
**URL:** `{{base_url}}/payments`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}",
  "Content-Type": "application/json"
}
```
**Body (raw JSON):**
```json
{
  "type": "event_fee",
  "amount": 50.00,
  "description": "Payment for Annual Masquerade Ball",
  "event": "{{event_id}}",
  "branch": "{{branch_id}}",
  "paymentMethod": "mobile_money",
  "metadata": {
    "phone": "+233123456789"
  }
}
```
**Tests:**
```javascript
pm.test("Payment created successfully", function () {
    pm.response.to.have.status(201);
    var jsonData = pm.response.json();
    pm.environment.set("payment_id", jsonData.data._id);
});
```

### 2. Get User Payments
**Method:** GET  
**URL:** `{{base_url}}/payments`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}"
}
```

### 3. Update Payment Status
**Method:** PUT  
**URL:** `{{base_url}}/payments/{{payment_id}}/status`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}",
  "Content-Type": "application/json"
}
```
**Body (raw JSON):**
```json
{
  "status": "completed",
  "processedBy": "{{user_id}}"
}
```

---

## Forum Endpoints

### 1. Create Forum Post
**Method:** POST  
**URL:** `{{base_url}}/forums/posts`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}",
  "Content-Type": "application/json"
}
```
**Body (raw JSON):**
```json
{
  "title": "Welcome to the Supreme Masquerade Society",
  "content": "We're excited to have you join our community!",
  "category": "announcements",
  "branch": "{{branch_id}}",
  "tags": ["welcome", "community"]
}
```

### 2. Get Forum Posts
**Method:** GET  
**URL:** `{{base_url}}/forums/posts`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}"
}
```

### 3. Add Comment to Post
**Method:** POST  
**URL:** `{{base_url}}/forums/posts/{{post_id}}/comments`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}",
  "Content-Type": "application/json"
}
```
**Body (raw JSON):**
```json
{
  "content": "Thank you for the warm welcome!"
}
```

---

## Media Management Endpoints

### 1. Upload File
**Method:** POST  
**URL:** `{{base_url}}/media/upload`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}"
}
```
**Body (form-data):**
```
file: [Select file]
type: image
description: Profile picture
```

### 2. Get Media Files
**Method:** GET  
**URL:** `{{base_url}}/media`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}"
}
```

---

## Notification Endpoints

### 1. Get User Notifications
**Method:** GET  
**URL:** `{{base_url}}/notifications`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}"
}
```

### 2. Mark Notification as Read
**Method:** PUT  
**URL:** `{{base_url}}/notifications/{{notification_id}}/read`  
**Headers:**
```json
{
  "Authorization": "Bearer {{auth_token}}"
}
```

---

## Health Check

### 1. API Health Check
**Method:** GET  
**URL:** `{{base_url}}/health`  
**Tests:**
```javascript
pm.test("API is healthy", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql("OK");
});
```

---

## Error Testing

### 1. Invalid Authentication
**Method:** GET  
**URL:** `{{base_url}}/users/profile`  
**Headers:**
```json
{
  "Authorization": "Bearer invalid_token"
}
```
**Tests:**
```javascript
pm.test("Should return 401 for invalid token", function () {
    pm.response.to.have.status(401);
});
```

### 2. Missing Required Fields
**Method:** POST  
**URL:** `{{base_url}}/auth/register`  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```
**Body (raw JSON):**
```json
{
  "firstName": "John"
}
```
**Tests:**
```javascript
pm.test("Should return 400 for missing fields", function () {
    pm.response.to.have.status(400);
});
```

---

## Collection Runner Tests

### Pre-request Script (Global)
```javascript
// Set timestamp for unique data
pm.globals.set("timestamp", Date.now());
```

### Test Script (Global)
```javascript
// Global test for response time
pm.test("Response time is less than 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// Global test for response format
pm.test("Response has success property", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("success");
});
```

---

## Testing Workflow

1. **Setup Environment**
   - Create new environment in Postman
   - Add all environment variables
   - Set base_url to your server

2. **Run Authentication Tests**
   - Register a new user
   - Login with credentials
   - Verify token is set

3. **Test Each Module**
   - Run tests in order of dependency
   - Verify responses and data
   - Check error handling

4. **Integration Testing**
   - Test complete user flows
   - Verify data relationships
   - Test real-time features

5. **Performance Testing**
   - Run collection with multiple iterations
   - Monitor response times
   - Check for memory leaks

This template provides comprehensive testing coverage for all API endpoints and ensures your backend is working correctly before moving to frontend development.
