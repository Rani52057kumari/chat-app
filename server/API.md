# API Documentation

Complete API reference for the Chat App Backend.

**Base URL:** `http://localhost:5000/api`  
**Production URL:** `https://api.yourdomain.com/api`

## 📋 Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Chats](#chats)
- [Messages](#messages)
- [Socket.IO Events](#socketio-events)
- [Error Responses](#error-responses)

---

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Validation:**
- `name`: 2-50 characters
- `email`: Valid email format
- `password`: Min 6 characters, must contain uppercase, lowercase, and number

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "default_avatar_url",
    "bio": "",
    "token": "jwt_token"
  }
}
```

**Rate Limit:** 5 requests per 15 minutes

---

### Login User

**POST** `/auth/login`

Authenticate and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "avatar_url",
    "bio": "User bio",
    "isOnline": true,
    "token": "jwt_token"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

**Rate Limit:** 5 requests per 15 minutes

---

### Get Current User

**GET** `/auth/me`  
🔒 **Protected**

Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "avatar_url",
    "bio": "User bio",
    "isOnline": true,
    "lastSeen": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Update Profile

**PUT** `/auth/profile`  
🔒 **Protected**

Update user profile information.

**Request Body:**
```json
{
  "name": "John Updated",
  "bio": "New bio text",
  "avatar": "https://example.com/avatar.jpg"
}
```

**All fields are optional**

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "user_id",
    "name": "John Updated",
    "email": "john@example.com",
    "avatar": "new_avatar_url",
    "bio": "New bio text"
  }
}
```

---

### Change Password

**PUT** `/auth/change-password`  
🔒 **Protected**

Change user password.

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

**Validation:**
- `newPassword`: Min 6 characters, must contain uppercase, lowercase, and number

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Rate Limit:** 5 requests per 15 minutes

---

### Search Users

**GET** `/auth/users?search=keyword`  
🔒 **Protected**

Search for users by name or email.

**Query Parameters:**
- `search` (optional): Search keyword

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "avatar_url",
      "isOnline": true
    }
  ]
}
```

**Note:** Excludes current user from results. Limited to 10 users.

---

## 💬 Chats

### Get All Chats

**GET** `/chats`  
🔒 **Protected**

Get all chats for current user.

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "chat_id",
      "chatName": "John & Jane",
      "isGroupChat": false,
      "users": [...],
      "latestMessage": {
        "content": "Hello!",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    }
  ]
}
```

---

### Create/Access Chat

**POST** `/chats`  
🔒 **Protected**

Create or access one-on-one chat.

**Request Body:**
```json
{
  "userId": "other_user_id"
}
```

**Validation:**
- `userId`: Valid MongoDB ObjectId

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "chat_id",
    "chatName": "John & Jane",
    "isGroupChat": false,
    "users": [...]
  }
}
```

**Note:** Returns existing chat if already exists.

---

### Create Group Chat

**POST** `/chats/group`  
🔒 **Protected**

Create a new group chat.

**Request Body:**
```json
{
  "name": "My Group",
  "users": ["user_id_1", "user_id_2", "user_id_3"],
  "groupImage": "https://example.com/image.jpg"
}
```

**Validation:**
- `name`: 3-50 characters
- `users`: Array of valid ObjectIds, minimum 2 users
- `groupImage`: Optional, valid URL

**Success Response (201):**
```json
{
  "success": true,
  "message": "Group chat created successfully",
  "data": {
    "_id": "group_id",
    "chatName": "My Group",
    "isGroupChat": true,
    "groupAdmin": "admin_user_id",
    "users": [...],
    "groupImage": "image_url"
  }
}
```

---

### Rename Group

**PUT** `/chats/group/rename`  
🔒 **Protected**

Rename group chat (admin only).

**Request Body:**
```json
{
  "chatId": "chat_id",
  "chatName": "New Group Name"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "group_id",
    "chatName": "New Group Name",
    ...
  }
}
```

---

### Add User to Group

**PUT** `/chats/group/add`  
🔒 **Protected**

Add user to group chat (admin only).

**Request Body:**
```json
{
  "chatId": "chat_id",
  "userId": "user_id_to_add"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "group_id",
    "users": [...updated_users],
    ...
  }
}
```

---

### Remove User from Group

**PUT** `/chats/group/remove`  
🔒 **Protected**

Remove user from group (admin only).

**Request Body:**
```json
{
  "chatId": "chat_id",
  "userId": "user_id_to_remove"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "group_id",
    "users": [...updated_users],
    ...
  }
}
```

---

## 💌 Messages

### Send Message

**POST** `/messages`  
🔒 **Protected**

Send a new message (text or file).

**Content-Type:** `multipart/form-data` (for file uploads)

**Form Data:**
```
chatId: "chat_id"
content: "Message text"
file: <file> (optional)
```

**Validation:**
- `chatId`: Valid MongoDB ObjectId
- `content`: Max 5000 characters (required if no file)
- `file`: Max 10MB, allowed types: images, videos, audio, PDFs, documents

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "message_id",
    "sender": {
      "_id": "sender_id",
      "name": "John Doe",
      "avatar": "avatar_url"
    },
    "content": "Message text",
    "chat": "chat_id",
    "fileUrl": "file_url",
    "fileType": "image",
    "fileName": "photo.jpg",
    "readBy": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Rate Limit:** 30 messages per minute, 50 file uploads per hour

---

### Get Messages

**GET** `/messages/:chatId`  
🔒 **Protected**

Get all messages in a chat.

**URL Parameters:**
- `chatId`: Chat ID

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "message_id",
      "sender": {...},
      "content": "Message text",
      "chat": "chat_id",
      "readBy": ["user_id"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Mark Message as Read

**PUT** `/messages/read/:messageId`  
🔒 **Protected**

Mark a single message as read.

**URL Parameters:**
- `messageId`: Message ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Message marked as read"
}
```

---

### Mark All Chat Messages as Read

**PUT** `/messages/read/chat/:chatId`  
🔒 **Protected**

Mark all messages in a chat as read.

**URL Parameters:**
- `chatId`: Chat ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "All messages marked as read",
  "count": 5
}
```

---

## 🔌 Socket.IO Events

**Connection URL:** `ws://localhost:5000`

### Client → Server Events

#### `setup`
Initialize user connection.

**Payload:**
```javascript
socket.emit('setup', userData);
```

#### `join_chat`
Join a specific chat room.

**Payload:**
```javascript
socket.emit('join_chat', chatId);
```

#### `typing`
Send typing indicator.

**Payload:**
```javascript
socket.emit('typing', { room: chatId, user: userData });
```

#### `stop_typing`
Stop typing indicator.

**Payload:**
```javascript
socket.emit('stop_typing', chatId);
```

#### `new_message`
Send new message (alternative to REST API).

**Payload:**
```javascript
socket.emit('new_message', messageData);
```

---

### Server → Client Events

#### `connected`
Connection established.

**Payload:**
```javascript
socket.on('connected', () => {
  console.log('Connected to server');
});
```

#### `typing`
User is typing.

**Payload:**
```javascript
socket.on('typing', ({ room, user }) => {
  // Show typing indicator
});
```

#### `stop_typing`
User stopped typing.

**Payload:**
```javascript
socket.on('stop_typing', (room) => {
  // Hide typing indicator
});
```

#### `message_received`
New message received.

**Payload:**
```javascript
socket.on('message_received', (message) => {
  // Display new message
});
```

#### `online_users`
List of online users.

**Payload:**
```javascript
socket.on('online_users', (users) => {
  // Update online status
});
```

---

## ❌ Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": "Error message"
}
```

### Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 400 | Bad Request | Validation error, invalid input |
| 401 | Unauthorized | Invalid/missing token, wrong credentials |
| 403 | Forbidden | Not authorized for this action |
| 404 | Not Found | Resource not found |
| 409 | Conflict | User already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

### Validation Errors

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters long"
    }
  ]
}
```

### Rate Limit Error

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1234567890
```

---

## 🧪 Testing Examples

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"Test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123"}'

# Get Profile (with token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Send Message with File
curl -X POST http://localhost:5000/api/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "chatId=CHAT_ID" \
  -F "content=Hello with file" \
  -F "file=@/path/to/image.jpg"
```

### Using JavaScript (Fetch)

```javascript
// Login
const login = async () => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'test@test.com',
      password: 'Test123'
    })
  });
  
  const data = await response.json();
  const token = data.data.token;
  return token;
};

// Get Chats
const getChats = async (token) => {
  const response = await fetch('http://localhost:5000/api/chats', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data.data;
};
```

---

## 📊 Rate Limits Summary

| Endpoint Pattern | Limit | Window |
|-----------------|-------|--------|
| `/api/*` (general) | 100 requests | 15 minutes |
| `/api/auth/register` | 5 requests | 15 minutes |
| `/api/auth/login` | 5 requests | 15 minutes |
| `/api/auth/change-password` | 5 requests | 15 minutes |
| `/api/messages` (POST) | 30 requests | 1 minute |
| `/api/messages` (file upload) | 50 requests | 1 hour |

---

## 🔄 API Versioning

Current version: **v1**

Future versions will be accessible at:
- `/api/v2/auth/...`
- `/api/v2/chats/...`
- etc.

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- All IDs are MongoDB ObjectIds (24 hex characters)
- File URLs point to Cloudinary (production) or local server (development)
- Socket.IO requires the same JWT token for authentication
- Read receipts are automatically updated when messages are fetched

---

**API Version:** 1.0.0  
**Last Updated:** $(date +%Y-%m-%d)  
**Base URL:** http://localhost:5000/api
