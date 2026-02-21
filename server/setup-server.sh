#!/bin/bash

# Chat App Backend - Quick Setup Script
# This script sets up the backend server with all dependencies

echo "═══════════════════════════════════════════════"
echo "  🚀 Chat App Backend Setup"
echo "═══════════════════════════════════════════════"
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi
echo "✅ Node.js $(node -v) found"

# Check MongoDB
echo ""
echo "📦 Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed locally."
    echo "   You can:"
    echo "   1. Install MongoDB locally"
    echo "   2. Use MongoDB Atlas (cloud)"
    read -p "   Continue setup anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ MongoDB found"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"

# Setup environment file
echo ""
echo "🔧 Setting up environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    
    # Generate JWT secret
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
    
    # Update JWT_SECRET in .env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    else
        # Linux
        sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    fi
    
    echo "✅ .env file created with secure JWT secret"
    echo ""
    echo "⚠️  IMPORTANT: Please update the following in .env:"
    echo "   - MONGO_URI (if using MongoDB Atlas)"
    echo "   - CLIENT_URL (your frontend URL)"
    echo "   - Cloudinary credentials (if using cloud storage)"
else
    echo "⚠️  .env file already exists, skipping..."
fi

# Create uploads directory
echo ""
echo "📁 Creating uploads directory..."
mkdir -p uploads
echo "✅ Uploads directory created"

echo ""
echo "═══════════════════════════════════════════════"
echo "  ✅ Setup Complete!"
echo "═══════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo ""
echo "1. Update your .env file with:"
echo "   - MongoDB connection string"
echo "   - Frontend URL (CLIENT_URL)"
echo "   - Cloudinary credentials (optional)"
echo ""
echo "2. Start MongoDB:"
echo "   mongod"
echo ""
echo "3. Start the server:"
echo "   npm run dev    # Development mode"
echo "   npm start      # Production mode"
echo ""
echo "4. Test the server:"
echo "   curl http://localhost:5000/api/health"
echo ""
echo "📖 For more information, see README.md"
echo ""
