# 🚀 Quick Start Guide

## Prerequisites Installation

### 1. Install Node.js
```bash
# Check if Node.js is installed
node --version
npm --version

# If not installed, download from https://nodejs.org/
# Recommended: LTS version (v18 or higher)
```

### 2. Install MongoDB

#### On Ubuntu/Debian:
```bash
# Import the public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

#### On macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### On Windows:
- Download MongoDB installer from https://www.mongodb.com/try/download/community
- Run the installer and follow instructions
- MongoDB will start automatically as a service

## 📦 Project Setup

### Step 1: Clone and Setup Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your settings
nano .env  # or use your preferred editor
```

**Important .env variables:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=change_this_to_a_random_string_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### Step 2: Setup Frontend

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit if needed (default values should work)
nano .env
```

## 🏃 Running the Application

### Start Backend Server

```bash
cd server

# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
╔════════════════════════════════════════╗
║   🚀 Chat App Server is Running        ║
║   Port: 5000                           ║
╚════════════════════════════════════════╝
```

### Start Frontend Application

Open a new terminal:

```bash
cd client

# Start development server
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

## 📝 Testing the Application

### 1. Register Users

1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Fill in the registration form:
   - Name: Test User 1
   - Email: user1@test.com
   - Password: password123
4. Click "Create Account"

### 2. Create Another User

1. Open a new incognito/private window
2. Register another user:
   - Name: Test User 2
   - Email: user2@test.com
   - Password: password123

### 3. Start Chatting

1. In User 1's window:
   - Click the search icon
   - Search for "Test User 2"
   - Click on the user to start a chat
   - Send a message

2. In User 2's window:
   - You should see the chat appear
   - Reply to the message

### 4. Test Features

#### Create a Group
1. Click the group icon (👥)
2. Enter group name
3. Search and add users
4. Click "Create Group"

#### Send Files
1. Open a chat
2. Click the paperclip icon (📎)
3. Select an image or PDF
4. The file will be uploaded and sent

#### Toggle Dark Mode
- Click the sun/moon icon in the sidebar

## 🔧 Troubleshooting

### Backend Issues

#### Port Already in Use
```bash
# Find and kill process using port 5000
sudo lsof -i :5000
sudo kill -9 <PID>

# Or change port in server/.env
PORT=5001
```

#### MongoDB Connection Error
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Frontend Issues

#### Port 3000 Already in Use
```bash
# Kill process on port 3000
sudo lsof -i :3000
sudo kill -9 <PID>

# Or run on different port
PORT=3001 npm start
```

#### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

## 🔄 Development Workflow

### Backend Development

```bash
cd server

# Install nodemon globally for auto-reload
npm install -g nodemon

# Run with nodemon
npm run dev

# The server will restart automatically on file changes
```

### Frontend Development

```bash
cd client

# The React dev server has hot-reload by default
npm start

# Build for production
npm run build
```

## 📊 Database Management

### View MongoDB Data

```bash
# Open MongoDB shell
mongosh

# Switch to chatapp database
use chatapp

# View collections
show collections

# View users
db.users.find().pretty()

# View chats
db.chats.find().pretty()

# View messages
db.messages.find().pretty()

# Clear all data (careful!)
db.users.deleteMany({})
db.chats.deleteMany({})
db.messages.deleteMany({})
```

### Using MongoDB Compass (GUI)

1. Download MongoDB Compass from https://www.mongodb.com/products/compass
2. Connect to `mongodb://localhost:27017`
3. Select `chatapp` database
4. Browse and manage collections visually

## 🎨 Customization

### Change Primary Color

Edit `client/tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#yourcolor',
    600: '#yourdarkercolor',
    // etc.
  }
}
```

### Change App Name

1. `client/public/index.html` - Update `<title>`
2. `client/public/manifest.json` - Update `name` and `short_name`
3. `client/src/pages/Home.js` - Update app name in UI

## 📱 Mobile Testing

### Test on Your Phone

1. Find your computer's local IP:
   ```bash
   # On Linux/Mac
   ifconfig | grep "inet "
   
   # On Windows
   ipconfig
   ```

2. Update `client/.env`:
   ```env
   REACT_APP_API_URL=http://YOUR_IP:5000/api
   REACT_APP_SOCKET_URL=http://YOUR_IP:5000
   ```

3. Update `server/.env`:
   ```env
   CLIENT_URL=http://YOUR_IP:3000
   ```

4. On your phone, open browser and go to:
   ```
   http://YOUR_IP:3000
   ```

## 🔐 Security Checklist for Production

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS (SSL certificate)
- [ ] Configure proper CORS origins
- [ ] Set up MongoDB authentication
- [ ] Use environment-specific .env files
- [ ] Enable rate limiting
- [ ] Set up proper file upload limits
- [ ] Use a CDN for file storage
- [ ] Set up proper logging
- [ ] Configure MongoDB indexes
- [ ] Use a process manager (PM2)

## 🎯 Next Steps

1. **Add More Features**
   - Voice/video calls
   - Message reactions
   - Message forwarding
   - User blocking
   - Media gallery

2. **Improve Performance**
   - Add Redis for caching
   - Implement message pagination
   - Optimize images
   - Add service workers

3. **Deploy to Production**
   - Choose hosting (Heroku, DigitalOcean, AWS)
   - Set up MongoDB Atlas
   - Configure production build
   - Set up CI/CD pipeline

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review the server and browser console logs
3. Ensure all dependencies are installed correctly
4. Verify MongoDB is running
5. Check network connectivity

---

**Happy Coding! 🚀**
