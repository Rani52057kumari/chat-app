# Chat App Backend - Production Ready API

A secure, scalable, and production-ready backend for a real-time chat application built with Node.js, Express, MongoDB, and Socket.IO.

## 🚀 Features

### Core Features
- ✅ **User Authentication** - JWT-based authentication with bcrypt password hashing
- ✅ **Real-time Messaging** - Socket.IO for instant message delivery
- ✅ **Private & Group Chats** - Support for one-on-one and group conversations
- ✅ **File Uploads** - Image, video, audio, PDF, and document sharing
- ✅ **User Presence** - Online/offline status tracking
- ✅ **Message Read Receipts** - Track read/unread messages
- ✅ **User Search** - Find users by name or email

### Security Features
- 🔒 **Rate Limiting** - Protection against brute force and DDoS attacks
- 🔒 **Input Sanitization** - Protection against NoSQL injection
- 🔒 **XSS Protection** - Clean user input from malicious scripts
- 🔒 **Helmet** - Security headers middleware
- 🔒 **CORS** - Configurable cross-origin resource sharing
- 🔒 **JWT Tokens** - Secure token-based authentication
- 🔒 **Password Hashing** - Bcrypt for password encryption
- 🔒 **Request Validation** - Joi schema validation for all inputs

### Production Features
- ⚡ **Compression** - Gzip compression for responses
- ⚡ **Logging** - Morgan HTTP request logger
- ⚡ **Error Handling** - Centralized error handling with custom error classes
- ⚡ **Environment Validation** - Joi validation for environment variables
- ⚡ **Cloud Storage** - Cloudinary integration for file uploads
- ⚡ **Graceful Shutdown** - Proper handling of process termination

## 📋 Prerequisites

- Node.js >= 14.x
- MongoDB >= 4.x
- npm or yarn

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Setup

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

**IMPORTANT:** Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Start MongoDB

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (update MONGO_URI in .env)
```

### 4. Run the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
server/
├── config/
│   ├── database.js          # MongoDB connection
│   ├── env.js               # Environment validation
│   └── socket.js            # Socket.IO configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── chatController.js    # Chat management
│   └── messageController.js # Message handling
├── middleware/
│   ├── authMiddleware.js    # JWT authentication
│   ├── errorMiddleware.js   # Error handling
│   ├── securityMiddleware.js # Rate limiting & sanitization
│   ├── uploadMiddleware.js  # File upload handling
│   └── validationMiddleware.js # Joi validation schemas
├── models/
│   ├── User.js              # User model
│   ├── Chat.js              # Chat model
│   └── Message.js           # Message model
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── chatRoutes.js        # Chat endpoints
│   └── messageRoutes.js     # Message endpoints
├── uploads/                 # Local file uploads
├── .env.example             # Environment template
├── .gitignore
├── package.json
└── server.js                # Main entry point
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/me` | Get current user | Yes |
| PUT | `/profile` | Update profile | Yes |
| PUT | `/change-password` | Change password | Yes |
| GET | `/users?search=keyword` | Search users | Yes |

### Chats (`/api/chats`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all chats | Yes |
| POST | `/` | Create/access chat | Yes |
| POST | `/group` | Create group chat | Yes |
| PUT | `/group/rename` | Rename group | Yes |
| PUT | `/group/add` | Add user to group | Yes |
| PUT | `/group/remove` | Remove user from group | Yes |

### Messages (`/api/messages`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Send message | Yes |
| GET | `/:chatId` | Get chat messages | Yes |
| PUT | `/read/:messageId` | Mark message as read | Yes |
| PUT | `/read/chat/:chatId` | Mark all chat messages as read | Yes |

### System

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Health check | No |
| GET | `/` | API information | No |

## 🔒 Security Configuration

### Rate Limiting

Different rate limits for different endpoints:

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **Messages**: 30 messages per minute
- **File Uploads**: 50 uploads per hour

### Input Validation

All requests are validated using Joi schemas:

```javascript
// Example: User registration
{
  name: "min 2, max 50 characters",
  email: "valid email format",
  password: "min 6 characters, must contain uppercase, lowercase, and number"
}
```

### File Upload Security

- Maximum file size: 10MB
- Allowed types: Images, videos, audio, PDFs, documents
- Sanitized filenames
- Optional Cloudinary integration for production

## ☁️ Cloudinary Setup (Optional)

For production file storage:

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get your credentials from the dashboard
3. Add to `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Files will automatically upload to Cloudinary in production mode.

## 🔐 Socket.IO Events

### Client → Server

- `setup` - Initialize user connection
- `join_chat` - Join a chat room
- `typing` - User typing indicator
- `stop_typing` - Stop typing indicator
- `new_message` - Send new message
- `disconnect` - User disconnection

### Server → Client

- `connected` - Connection confirmed
- `typing` - User is typing
- `stop_typing` - User stopped typing
- `message_received` - New message received
- `online_users` - List of online users

## 🧪 Testing

### Health Check

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "environment": "development",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

## 🚀 Deployment

### Environment Variables (Production)

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/chatapp
JWT_SECRET=<64-character-random-string>
JWT_EXPIRE=30d
CLIENT_URL=https://yourdomain.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret (64+ characters)
- [ ] Configure MongoDB Atlas
- [ ] Set up Cloudinary for file storage
- [ ] Configure CORS with your domain
- [ ] Enable HTTPS
- [ ] Set up process manager (PM2)
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up monitoring and logging
- [ ] Regular security updates

### PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start server.js --name chat-api

# Monitor
pm2 monit

# View logs
pm2 logs chat-api

# Restart
pm2 restart chat-api

# Stop
pm2 stop chat-api
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 📊 Monitoring

### Error Logging

Errors are logged with stack traces in development mode and cleaned messages in production.

### Request Logging

HTTP requests are logged using Morgan:
- Development: `dev` format
- Production: `combined` format

## 🛡️ Best Practices Implemented

✅ Environment variable validation  
✅ Graceful shutdown handling  
✅ Centralized error handling  
✅ Request validation  
✅ Rate limiting  
✅ Input sanitization  
✅ Security headers  
✅ CORS configuration  
✅ Compression  
✅ Async error handling  
✅ Password hashing  
✅ JWT authentication  
✅ File upload security  

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

ISC

## 🆘 Support

For issues and questions:
- Check existing issues
- Create a new issue with detailed description
- Include error logs and environment details

## 🔄 Updates

Keep dependencies updated:

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Security audit
npm audit
npm audit fix
```

---

**Built with ❤️ for production use**
