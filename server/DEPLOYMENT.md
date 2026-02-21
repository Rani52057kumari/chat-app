# Production Deployment Guide

This guide covers deploying the Chat App backend to production with best practices.

## 🚀 Deployment Options

### 1. Heroku
### 2. DigitalOcean
### 3. AWS EC2
### 4. Google Cloud Platform
### 5. Azure

---

## 📋 Pre-Deployment Checklist

- [ ] **Environment Variables** - All production values set
- [ ] **Database** - MongoDB Atlas configured
- [ ] **Cloud Storage** - Cloudinary setup complete
- [ ] **Security** - Strong JWT secret generated
- [ ] **CORS** - Production domain configured
- [ ] **HTTPS** - SSL certificate ready
- [ ] **Monitoring** - Error tracking setup
- [ ] **Backups** - Database backup strategy in place

---

## 1️⃣ Heroku Deployment

### Step 1: Install Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Ubuntu
curl https://cli-assets.heroku.com/install.sh | sh
```

### Step 2: Login and Create App

```bash
heroku login
heroku create your-chat-app-api
```

### Step 3: Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/chatapp"
heroku config:set JWT_SECRET="your-64-character-random-secret"
heroku config:set JWT_EXPIRE=30d
heroku config:set CLIENT_URL="https://your-frontend.com"
heroku config:set CLOUDINARY_CLOUD_NAME="your_cloud_name"
heroku config:set CLOUDINARY_API_KEY="your_api_key"
heroku config:set CLOUDINARY_API_SECRET="your_api_secret"
heroku config:set MAX_FILE_SIZE=10485760
```

### Step 4: Create Procfile

```bash
echo "web: node server.js" > Procfile
```

### Step 5: Deploy

```bash
git add .
git commit -m "Production deployment"
git push heroku main
```

### Step 6: Scale and Monitor

```bash
heroku ps:scale web=1
heroku logs --tail
heroku open
```

---

## 2️⃣ DigitalOcean Deployment

### Step 1: Create Droplet

- Choose Ubuntu 22.04 LTS
- Select 2GB RAM minimum
- Enable monitoring and backups

### Step 2: SSH into Droplet

```bash
ssh root@your-droplet-ip
```

### Step 3: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 4: Install MongoDB

```bash
# Or use MongoDB Atlas (recommended)
# Just configure MONGO_URI in .env
```

### Step 5: Clone and Setup

```bash
git clone https://github.com/yourusername/chat-app.git
cd chat-app/server
npm install --production
```

### Step 6: Configure Environment

```bash
nano .env
# Add all production values
```

### Step 7: Install PM2

```bash
npm install -g pm2
pm2 start server.js --name chat-api
pm2 startup
pm2 save
```

### Step 8: Setup Nginx

```bash
sudo apt install nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/chat-api

# Add configuration:
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

# Enable site
sudo ln -s /etc/nginx/sites-available/chat-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 9: Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

### Step 10: Setup Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## 3️⃣ AWS EC2 Deployment

### Step 1: Launch EC2 Instance

- Amazon Linux 2 or Ubuntu
- t2.small or larger
- Configure security groups (ports 22, 80, 443)

### Step 2: Connect to Instance

```bash
ssh -i "your-key.pem" ubuntu@your-ec2-ip
```

### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt install git
```

### Step 4: Clone and Setup Application

```bash
git clone https://github.com/yourusername/chat-app.git
cd chat-app/server
npm install --production
```

### Step 5: Configure Environment

```bash
nano .env
# Add production values
```

### Step 6: Install and Configure PM2

```bash
npm install -g pm2
pm2 start server.js --name chat-api
pm2 startup systemd
pm2 save
```

### Step 7: Setup Nginx and SSL

Follow same steps as DigitalOcean (Step 8-9)

---

## 🔒 Security Best Practices

### 1. Environment Variables

```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Never commit .env file
echo ".env" >> .gitignore
```

### 2. MongoDB Security

```javascript
// Use MongoDB Atlas with:
// - IP Whitelist
// - Strong passwords
// - Database user roles
// - Connection encryption
```

### 3. Rate Limiting

Already configured in the application:
- 100 requests per 15 min (general)
- 5 attempts per 15 min (auth)
- 30 messages per minute
- 50 uploads per hour

### 4. CORS Configuration

```env
# Single domain
CLIENT_URL=https://yourdomain.com

# Multiple domains
CLIENT_URL=https://yourdomain.com,https://www.yourdomain.com,https://app.yourdomain.com
```

### 5. HTTPS Only

```javascript
// Force HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});
```

---

## 📊 Monitoring and Logging

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs chat-api

# Check status
pm2 status

# Restart if needed
pm2 restart chat-api
```

### Application Logs

Logs are handled by Morgan:
- Development: dev format
- Production: combined format

### Error Tracking (Optional)

Consider integrating:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **DataDog** - Full stack monitoring

```bash
npm install @sentry/node
```

---

## 🔄 Continuous Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd server
        npm ci --production
    
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /path/to/chat-app/server
          git pull
          npm install --production
          pm2 restart chat-api
```

---

## 🗄️ Database Backup

### MongoDB Atlas Backup

- Enable automatic backups in Atlas dashboard
- Configure backup schedule
- Test restore process

### Manual Backup Script

```bash
#!/bin/bash
# backup-db.sh

TODAY=$(date +%Y-%m-%d)
BACKUP_DIR="/backups/mongodb"
mkdir -p $BACKUP_DIR

mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/$TODAY"

# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
```

Add to crontab:
```bash
0 2 * * * /path/to/backup-db.sh
```

---

## 🔍 Health Checks

### Setup Health Monitoring

Use services like:
- **UptimeRobot** (free)
- **Pingdom**
- **StatusCake**

Monitor:
```
GET https://api.yourdomain.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "environment": "production"
}
```

---

## 🚨 Troubleshooting

### Server Won't Start

```bash
# Check logs
pm2 logs chat-api

# Check port availability
sudo lsof -i :5000

# Check environment variables
pm2 env chat-api
```

### Database Connection Issues

```bash
# Test MongoDB connection
mongo "mongodb+srv://cluster.mongodb.net" --username user

# Check IP whitelist in MongoDB Atlas
# Verify credentials in .env
```

### High Memory Usage

```bash
# Check memory
free -h

# Restart PM2
pm2 restart chat-api

# Monitor
pm2 monit
```

### Socket.IO Connection Issues

- Verify WebSocket support in reverse proxy
- Check CORS configuration
- Ensure sticky sessions enabled (if load balanced)

---

## 📈 Scaling Considerations

### Vertical Scaling
- Increase server RAM/CPU
- Optimize MongoDB queries
- Enable compression

### Horizontal Scaling
- Load balancer (Nginx/HAProxy)
- Multiple server instances
- Redis for session management
- Sticky sessions for Socket.IO

### Database Scaling
- MongoDB Atlas auto-scaling
- Read replicas
- Sharding for large datasets

---

## 🎯 Performance Optimization

### 1. Enable Compression
Already enabled in server.js

### 2. Database Indexing
```javascript
// Add indexes to frequently queried fields
User.index({ email: 1 });
Chat.index({ users: 1 });
Message.index({ chat: 1, createdAt: -1 });
```

### 3. Caching (Optional)
```bash
npm install redis
```

### 4. CDN for Static Assets
Use Cloudinary transformations for image optimization

---

## ✅ Post-Deployment Verification

1. **API Health Check**
   ```bash
   curl https://api.yourdomain.com/api/health
   ```

2. **Test Registration**
   ```bash
   curl -X POST https://api.yourdomain.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","password":"Test123"}'
   ```

3. **Test Login**
   ```bash
   curl -X POST https://api.yourdomain.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"Test123"}'
   ```

4. **Monitor Logs**
   ```bash
   pm2 logs chat-api --lines 100
   ```

5. **Check SSL**
   ```bash
   curl -I https://api.yourdomain.com
   ```

---

## 🆘 Support

If you encounter issues:

1. Check logs: `pm2 logs chat-api`
2. Verify environment variables
3. Test database connection
4. Check firewall rules
5. Review Nginx error logs: `/var/log/nginx/error.log`

---

**🎉 Your production backend is now live and ready to scale!**
