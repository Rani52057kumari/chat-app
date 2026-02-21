<div align="center">

# 💬 Real Time Chat App

### Free Secure Messaging & Online Chat Website

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?logo=mongodb)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.6-black?logo=socket.io)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, feature-rich real-time chat application built with the MERN stack. Experience instant messaging with military-grade encryption, group chats, file sharing, and a beautiful glassmorphism UI design.

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [Performance](#-performance)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## ✨ Features

### 💬 **Real-Time Messaging**
- **Instant message delivery** with Socket.IO
- **Typing indicators** show when someone is typing
- **Read receipts** for message delivery confirmation
- **Online/offline status** for all users
- **Last seen timestamp** for offline users

### 👥 **Group Chats**
- Create **unlimited group chats**
- Add/remove members dynamically
- Rename groups on the fly
- Group admin controls
- Member list with online status

### 🔒 **Security & Privacy**
- **JWT authentication** with secure token management
- **End-to-end encryption** for messages
- **Password hashing** with bcrypt (10+ salt rounds)
- **Rate limiting** to prevent abuse
- **XSS & SQL injection protection**
- **CORS security** with whitelisted origins

### 📁 **File Sharing**
- Upload and share **images, documents, and files**
- **Cloudinary integration** for cloud storage
- **File preview** before sending
- **Drag & drop** file upload
- Maximum 10MB file size support

### 🎨 **Modern UI/UX**
- **Glassmorphism design** with Tailwind CSS
- **Dark mode** support with system preference detection
- **Responsive design** for mobile, tablet, and desktop
- **Smooth animations** with Framer Motion
- **Loading skeletons** for better perceived performance

### 😊 **Rich Features**
- **Emoji picker** with 1000+ emojis
- **Search functionality** for users and messages
- **Toast notifications** for real-time updates
- **User profiles** with avatars and bios
- **Unread message counts** with badges

### 🚀 **Performance & SEO**
- **Code splitting** with React.lazy()
- **Lazy loading images** for faster load times
- **Schema.org structured data** for SEO
- **Sitemap & robots.txt** for search engines
- **Optimized Core Web Vitals**

---

## 🎥 Demo

> **Live Demo:** [Coming Soon]

### Quick Preview

```bash
# Clone and run locally (see Installation section)
git clone https://github.com/yourusername/chat-app.git
cd chat-app
./setup.sh  # Automated setup script
```

---

## 🛠 Tech Stack

### **Frontend**
| Technology | Version | Description |
|------------|---------|-------------|
| **React** | 18.2.0 | UI library for building components |
| **React Router** | 6.21.1 | Client-side routing |
| **Socket.IO Client** | 4.6.1 | Real-time bidirectional communication |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework |
| **Framer Motion** | 10.18.0 | Animation library |
| **Axios** | 1.6.5 | HTTP client for API requests |
| **React Helmet Async** | 2.0.4 | SEO meta tags management |
| **React Toastify** | 9.1.3 | Toast notifications |
| **React Icons** | 5.0.1 | Icon library |
| **Emoji Picker React** | 4.7.8 | Emoji picker component |
| **date-fns** | 3.0.6 | Date formatting utility |

### **Backend**
| Technology | Version | Description |
|------------|---------|-------------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express** | 4.18.2 | Web application framework |
| **MongoDB** | 6.0+ | NoSQL database |
| **Mongoose** | 8.0.3 | MongoDB object modeling |
| **Socket.IO** | 4.6.1 | Real-time communication |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Multer** | 1.4.5 | File upload middleware |
| **Cloudinary** | 1.41.0 | Cloud file storage |
| **Helmet** | 7.1.0 | Security headers |
| **Express Rate Limit** | 7.1.5 | Rate limiting middleware |
| **Joi** | 17.11.0 | Data validation |
| **Morgan** | 1.10.0 | HTTP request logger |

### **DevOps & Tools**
- **Git** - Version control
- **npm** - Package manager
- **Nodemon** - Development auto-reload
- **dotenv** - Environment variable management
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │   Pages     │  │ Components  │  │  Context/State   │   │
│  │ Home/Login  │  │ Chat/Sidebar│  │  Auth/Chat/Theme │   │
│  │ Register    │  │ Messages    │  │                  │   │
│  └──────┬──────┘  └──────┬──────┘  └────────┬─────────┘   │
│         │                │                    │              │
│         └────────────────┴────────────────────┘              │
│                          │                                    │
└──────────────────────────┼────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │    HTTP/WebSocket       │
              └────────────┬────────────┘
                           │
┌──────────────────────────┼────────────────────────────────────┐
│                          │         SERVER (Node.js)            │
│  ┌───────────────────────▼───────────────────────┐            │
│  │          Express.js + Socket.IO               │            │
│  └───────────┬──────────────────┬─────────────────┘           │
│              │                  │                              │
│  ┌───────────▼──────┐  ┌───────▼─────────┐                   │
│  │   REST API       │  │  WebSocket      │                   │
│  │ /auth /chats     │  │  Events         │                   │
│  │ /messages        │  │  message/typing │                   │
│  └───────┬──────────┘  └────────┬────────┘                   │
│          │                      │                              │
│  ┌───────▼──────┐  ┌────────────▼─────────┐                  │
│  │ Middleware   │  │  Controllers         │                  │
│  │ Auth/Protect │  │  Auth/Chat/Message   │                  │
│  └───────┬──────┘  └────────┬─────────────┘                  │
│          │                   │                                 │
│          └─────────┬─────────┘                                 │
│                    │                                           │
└────────────────────┼───────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────┐          ┌───────▼────────┐
│   MongoDB    │          │   Cloudinary   │
│   Database   │          │  File Storage  │
└──────────────┘          └────────────────┘
```

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)

### Quick Start (Automated)

```bash
# Clone the repository
git clone https://github.com/yourusername/chat-app.git
cd chat-app

# Run automated setup script (Linux/Mac)
chmod +x setup.sh
./setup.sh

# Or for Windows
setup.bat
```

The automated script will:
1. ✅ Install all dependencies (client + server)
2. ✅ Copy environment files
3. ✅ Generate JWT secret
4. ✅ Start MongoDB (if installed locally)
5. ✅ Run the application

### Manual Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/chat-app.git
cd chat-app
```

#### 2️⃣ Install Server Dependencies
```bash
cd server
npm install
```

#### 3️⃣ Install Client Dependencies
```bash
cd ../client
npm install
```

#### 4️⃣ Set Up Environment Variables

**Server (.env)**
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGO_URI=mongodb://localhost:27017/chatapp

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# CORS
CLIENT_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
MAX_FILES=1

# Cloudinary (Optional - for cloud file storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Client (.env)**
```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

#### 5️⃣ Generate JWT Secret (Important!)
```bash
# Generate a secure random string for JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy the output and paste it in server/.env as JWT_SECRET
```

#### 6️⃣ Start MongoDB
```bash
# If installed locally
mongod

# Or use MongoDB Atlas (cloud database)
# Update MONGO_URI in server/.env with your Atlas connection string
```

#### 7️⃣ Run the Application

**Terminal 1 - Start Server**
```bash
cd server
npm run dev    # Development mode with nodemon
# or
npm start      # Production mode
```

**Terminal 2 - Start Client**
```bash
cd client
npm start
```

#### 8️⃣ Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Socket.IO:** http://localhost:5000

---

## 🔧 Environment Setup

### Server Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | development | Environment mode |
| `PORT` | No | 5000 | Server port |
| `MONGO_URI` | **Yes** | - | MongoDB connection string |
| `JWT_SECRET` | **Yes** | - | Secret key for JWT tokens |
| `JWT_EXPIRE` | No | 30d | Token expiration time |
| `CLIENT_URL` | **Yes** | - | Frontend URL for CORS |
| `MAX_FILE_SIZE` | No | 10485760 | Max file size (10MB) |
| `CLOUDINARY_CLOUD_NAME` | No | - | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | - | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | - | Cloudinary API secret |

### Client Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REACT_APP_API_URL` | **Yes** | - | Backend API base URL |
| `REACT_APP_SOCKET_URL` | **Yes** | - | Socket.IO server URL |

### MongoDB Setup Options

#### Option 1: Local MongoDB
```bash
# Install MongoDB Community Edition
# Visit: https://www.mongodb.com/docs/manual/installation/

# Start MongoDB service
mongod

# Use in .env
MONGO_URI=mongodb://localhost:27017/chatapp
```

#### Option 2: MongoDB Atlas (Cloud)
```bash
# 1. Sign up at https://www.mongodb.com/cloud/atlas
# 2. Create a free cluster
# 3. Add database user
# 4. Whitelist IP (0.0.0.0/0 for development)
# 5. Get connection string

# Use in .env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority
```

### Cloudinary Setup (Optional)

For cloud-based file storage:

```bash
# 1. Sign up at https://cloudinary.com (free tier available)
# 2. Get credentials from dashboard
# 3. Add to server/.env

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🚀 Usage

### Creating an Account

1. Visit http://localhost:3000
2. Click **"Sign Up"**
3. Fill in your details:
   - Name (2-50 characters)
   - Email (valid email format)
   - Password (min 6 chars, must include uppercase, lowercase, and number)
4. Click **"Create Account"**

### Starting a Chat

1. **Login** to your account
2. Click **"Search"** icon in sidebar
3. **Search for users** by name or email
4. Click on a user to **start chatting**

### Creating a Group

1. Click **"New Group"** button in sidebar
2. Enter **group name**
3. **Select members** from your contacts
4. Click **"Create Group"**

### Sending Messages

- **Text:** Type in the message input and press Enter
- **Emojis:** Click emoji icon and select emoji
- **Files:** Click attachment icon or drag & drop files

### Managing Group

- **Rename:** Click group name → Edit
- **Add Members:** Click info icon → Add members
- **Remove Members:** Click info icon → Remove member
- **Leave Group:** Click info icon → Leave group

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Chat Endpoints

#### Get All Chats
```http
GET /api/chats
Authorization: Bearer <token>
```

#### Create/Access Chat
```http
POST /api/chats
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_id_to_chat_with"
}
```

#### Create Group Chat
```http
POST /api/chats/group
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Group Name",
  "users": ["user_id_1", "user_id_2"]
}
```

### Message Endpoints

#### Send Message
```http
POST /api/messages
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "chatId": "chat_id",
  "content": "Message text",
  "file": <file> (optional)
}
```

#### Get Messages
```http
GET /api/messages/:chatId
Authorization: Bearer <token>
```

### Socket.IO Events

#### Client → Server

| Event | Data | Description |
|-------|------|-------------|
| `setup` | `{ userId }` | Initialize user connection |
| `join chat` | `{ chatId }` | Join a chat room |
| `new message` | `{ message }` | Send new message |
| `typing` | `{ chatId }` | User started typing |
| `stop typing` | `{ chatId }` | User stopped typing |

#### Server → Client

| Event | Data | Description |
|-------|------|-------------|
| `connected` | - | Connection established |
| `message received` | `{ message }` | New message received |
| `typing` | `{ userId, chatId }` | User is typing |
| `stop typing` | `{ userId, chatId }` | User stopped typing |
| `user online` | `{ userId }` | User came online |
| `user offline` | `{ userId }` | User went offline |

**📖 Full API Documentation:** [server/API.md](server/API.md)

---

## 🌐 Deployment

### Deployment Options

1. **Heroku** (Recommended for beginners)
2. **Vercel** (Frontend) + **Railway** (Backend)
3. **DigitalOcean** / **AWS** / **Azure**
4. **Netlify** (Frontend) + **Render** (Backend)

### Heroku Deployment

#### Prerequisites
- Heroku account
- Heroku CLI installed
- Git repository

#### Deploy Backend
```bash
# Login to Heroku
heroku login

# Create Heroku app
cd server
heroku create your-chat-app-api

# Add MongoDB Atlas
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your_generated_secret
heroku config:set CLIENT_URL=https://your-frontend-url.com
heroku config:set NODE_ENV=production

# Deploy
git subtree push --prefix server heroku main

# Or use this command if you're in the server directory
git push heroku main
```

#### Deploy Frontend
```bash
# Update client/.env with production URLs
REACT_APP_API_URL=https://your-chat-app-api.herokuapp.com/api
REACT_APP_SOCKET_URL=https://your-chat-app-api.herokuapp.com

# Build the app
cd client
npm run build

# Deploy to Netlify/Vercel (drag & drop the build folder)
# Or use Heroku
heroku create your-chat-app-client
# Add buildpack
heroku buildpacks:set mars/create-react-app
git subtree push --prefix client heroku main
```

### Vercel + Railway Deployment

#### Backend on Railway
```bash
# 1. Visit https://railway.app
# 2. Connect GitHub repo
# 3. Select server directory as root
# 4. Add MongoDB plugin
# 5. Set environment variables
# 6. Deploy automatically
```

#### Frontend on Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd client
vercel

# Set environment variables in Vercel dashboard
# Production deployment
vercel --prod
```

### Environment Variables for Production

**Server:**
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://... (use Atlas)
JWT_SECRET=<strong_random_string>
CLIENT_URL=https://your-frontend-domain.com
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

**Client:**
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_SOCKET_URL=https://your-backend-domain.com
```

**📖 Detailed Deployment Guide:** [server/DEPLOYMENT.md](server/DEPLOYMENT.md)

---

## 📸 Screenshots

### Home Page
> Landing page with features and call-to-action

![Home Page](docs/screenshots/home.png)

### Login / Register
> Authentication with validation

![Login](docs/screenshots/login.png)

### Chat Interface
> Real-time messaging with modern UI

![Chat Interface](docs/screenshots/chat.png)

### Group Chat
> Create and manage group conversations

![Group Chat](docs/screenshots/group.png)

### Dark Mode
> Beautiful dark theme support

![Dark Mode](docs/screenshots/dark-mode.png)

### Mobile Responsive
> Fully responsive design for mobile devices

![Mobile View](docs/screenshots/mobile.png)

---

## 📁 Project Structure

```
chat-app/
├── client/                      # React frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html          # HTML template with SEO meta tags
│   │   ├── robots.txt          # Search engine directives
│   │   └── sitemap.xml         # SEO sitemap
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── chat/           # Chat-related components
│   │   │   │   ├── ChatList.js
│   │   │   │   ├── ChatWindow.js
│   │   │   │   ├── MessageInput.js
│   │   │   │   ├── Sidebar.js
│   │   │   │   └── ...
│   │   │   ├── PrivateRoute.js # Protected route wrapper
│   │   │   └── SEO.js          # SEO meta tags component
│   │   ├── context/            # React Context
│   │   │   ├── AuthContext.js  # Authentication state
│   │   │   ├── ChatContext.js  # Chat state & Socket.IO
│   │   │   └── ThemeContext.js # Dark mode state
│   │   ├── pages/              # Page components
│   │   │   ├── Home.js         # Landing page
│   │   │   ├── Login.js        # Login page
│   │   │   ├── Register.js     # Register page
│   │   │   └── Chat.js         # Main chat page
│   │   ├── utils/              # Utility functions
│   │   ├── App.js              # Main App component with routing
│   │   ├── index.css           # Global styles (Tailwind)
│   │   └── index.js            # Entry point
│   ├── .env.example            # Environment variables template
│   ├── package.json            # Dependencies
│   └── tailwind.config.js      # Tailwind CSS configuration
│
├── server/                      # Node.js backend
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── cloudinary.js       # Cloudinary configuration
│   ├── controllers/            # Route controllers
│   │   ├── authController.js   # Authentication logic
│   │   ├── chatController.js   # Chat management
│   │   └── messageController.js # Message handling
│   ├── middleware/             # Express middleware
│   │   ├── auth.js             # JWT authentication
│   │   ├── error.js            # Error handling
│   │   └── upload.js           # File upload (Multer)
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js             # User model
│   │   ├── Chat.js             # Chat model
│   │   └── Message.js          # Message model
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js       # /api/auth/*
│   │   ├── chatRoutes.js       # /api/chats/*
│   │   └── messageRoutes.js    # /api/messages/*
│   ├── utils/                  # Utility functions
│   │   └── generateToken.js    # JWT token generation
│   ├── .env.example            # Environment variables template
│   ├── server.js               # Express app & Socket.IO setup
│   ├── package.json            # Dependencies
│   ├── API.md                  # API documentation
│   ├── DEPLOYMENT.md           # Deployment guide
│   └── SECURITY.md             # Security practices
│
├── docs/                        # Documentation & screenshots
│   └── screenshots/
├── .gitignore                   # Git ignore rules
├── CONTRIBUTING.md              # Contribution guidelines
├── LICENSE                      # MIT License
├── README.md                    # This file
├── SEO_GUIDE.md                 # SEO optimization guide
├── setup.sh                     # Automated setup script (Linux/Mac)
└── setup.bat                    # Automated setup script (Windows)
```

---

## ⚡ Performance

### Core Web Vitals

| Metric | Score | Description |
|--------|-------|-------------|
| **LCP** | < 2.5s | Largest Contentful Paint |
| **FID** | < 100ms | First Input Delay |
| **CLS** | < 0.1 | Cumulative Layout Shift |

### Optimizations Implemented

✅ **Code Splitting** - React.lazy() for route-based splitting  
✅ **Lazy Loading** - Images load only when visible  
✅ **Image Optimization** - Explicit dimensions to prevent CLS  
✅ **Bundle Size** - Tree shaking and minification  
✅ **Compression** - Gzip compression on server  
✅ **Caching** - Static assets cached with service worker  
✅ **DNS Prefetch** - Preconnect to external resources  

### Bundle Sizes

```
client/build/static/js/main.*.js      ~150 KB (gzipped)
client/build/static/css/main.*.css    ~20 KB (gzipped)
```

### Performance Tips

1. **Use production build:** `npm run build` before deployment
2. **Enable compression:** Already configured with `compression` middleware
3. **Use CDN:** Serve static files from CDN in production
4. **Optimize images:** Convert to WebP format for better compression
5. **Monitor:** Use Lighthouse and PageSpeed Insights regularly

---

## 🔒 Security

### Security Features

✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - bcrypt with 10+ salt rounds  
✅ **XSS Protection** - xss-clean middleware  
✅ **SQL Injection Protection** - express-mongo-sanitize  
✅ **Rate Limiting** - Prevent brute force attacks  
✅ **CORS** - Whitelisted origins only  
✅ **Helmet** - Security headers  
✅ **Input Validation** - Joi & express-validator  
✅ **HTTPS** - Force SSL in production  
✅ **Environment Variables** - Sensitive data in .env  

### Security Best Practices

1. **Never commit .env files** - Use .env.example templates
2. **Use strong JWT secrets** - Generate with crypto.randomBytes()
3. **Update dependencies** - Run `npm audit` regularly
4. **Use HTTPS** - Always use SSL certificates in production
5. **Sanitize inputs** - Validate and sanitize all user inputs
6. **Rate limiting** - Already implemented for auth routes
7. **CORS configuration** - Only allow trusted domains

### Rate Limiting

```javascript
// Already configured in server
POST /api/auth/register - 5 requests per 15 minutes
POST /api/auth/login - 10 requests per 15 minutes
```

**📖 Security Guide:** [server/SECURITY.md](server/SECURITY.md)

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Report bugs** - Create an issue with reproduction steps
- 💡 **Suggest features** - Share your ideas for improvements
- 📖 **Improve documentation** - Fix typos, add examples
- 🔧 **Submit pull requests** - Fix bugs or add features
- ⭐ **Star the repo** - Show your support!

### Contribution Process

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/chat-app.git
   cd chat-app
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   - Ensure the app runs without errors
   - Test on multiple browsers
   - Check mobile responsiveness

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: amazing feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Create a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Wait for review and feedback

### Code Style Guidelines

- **JavaScript:** Use ES6+ features (arrow functions, destructuring, async/await)
- **React:** Use functional components with hooks
- **Naming:** camelCase for variables, PascalCase for components
- **Comments:** Add JSDoc comments for functions
- **Formatting:** Consistent indentation (2 spaces)

### Commit Message Format

```
Type: Brief description

- Detailed explanation if needed
- List of changes
```

**Types:** Add, Update, Fix, Remove, Refactor, Docs, Style, Test

**📖 Full Contributing Guide:** [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

✅ Commercial use  
✅ Modification  
✅ Distribution  
✅ Private use  

❌ Liability  
❌ Warranty  

**Attribution required:** Please keep the original license and copyright notice.

---

## 💬 Support

### Documentation

- **📚 API Documentation:** [server/API.md](server/API.md)
- **🚀 Deployment Guide:** [server/DEPLOYMENT.md](server/DEPLOYMENT.md)
- **🔒 Security Guide:** [server/SECURITY.md](server/SECURITY.md)
- **🎨 Frontend Guide:** [client/FRONTEND_GUIDE.md](client/FRONTEND_GUIDE.md)
- **🔍 SEO Guide:** [SEO_GUIDE.md](SEO_GUIDE.md)

### Get Help

- **📧 Email:** your.email@example.com
- **💬 Discord:** [Join our community](https://discord.gg/your-invite)
- **🐛 Issues:** [GitHub Issues](https://github.com/yourusername/chat-app/issues)
- **📖 Wiki:** [GitHub Wiki](https://github.com/yourusername/chat-app/wiki)

### FAQ

**Q: Can I use this for commercial purposes?**  
A: Yes! This project is MIT licensed, so you can use it commercially.

**Q: Do I need Cloudinary for file uploads?**  
A: No, it's optional. Files can be stored locally during development. Cloudinary is recommended for production.

**Q: How do I change the app name/branding?**  
A: Update the name in `package.json`, `index.html` title, and throughout the components.

**Q: Is this production-ready?**  
A: Yes, but ensure you:
- Use strong JWT secrets
- Set up MongoDB Atlas (not local MongoDB)
- Configure environment variables properly
- Enable HTTPS with SSL certificates
- Set up proper error logging

**Q: Can I add video/audio calls?**  
A: Yes! You can integrate WebRTC libraries like SimplePeer or PeerJS for video/audio features.

---

## 🌟 Acknowledgments

### Built With

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Node.js](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 engine
- [Express](https://expressjs.com/) - Fast, unopinionated web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - NoSQL database for modern applications
- [Socket.IO](https://socket.io/) - Real-time bidirectional event-based communication
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - A production-ready motion library

### Inspiration

This project was inspired by modern chat applications like WhatsApp, Telegram, and Discord, with a focus on simplicity, security, and user experience.

### Contributors

Thank you to all the contributors who have helped make this project better!

[![Contributors](https://contrib.rocks/image?repo=yourusername/chat-app)](https://github.com/yourusername/chat-app/graphs/contributors)

---

## 🗺️ Roadmap

### Upcoming Features

- [ ] **Voice Messages** - Record and send voice notes
- [ ] **Video/Audio Calls** - WebRTC integration
- [ ] **Message Reactions** - React to messages with emojis
- [ ] **Message Editing** - Edit sent messages
- [ ] **Message Deletion** - Delete messages for everyone
- [ ] **User Status** - Custom status messages
- [ ] **Chat Backup** - Export/import conversations
- [ ] **Push Notifications** - Browser push notifications
- [ ] **Multi-language Support** - i18n internationalization
- [ ] **Message Search** - Search within conversations
- [ ] **Pinned Messages** - Pin important messages
- [ ] **Admin Dashboard** - User management and analytics
- [ ] **Desktop App** - Electron wrapper for desktop
- [ ] **Mobile App** - React Native version

### Version History

**v1.0.0** (Current)
- ✅ Real-time messaging
- ✅ Group chats
- ✅ File sharing
- ✅ Emoji picker
- ✅ Dark mode
- ✅ SEO optimization
- ✅ Responsive design

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

Made with ❤️ by [Your Name](https://github.com/yourusername)

[⬆ Back to Top](#-real-time-chat-app)

</div>
