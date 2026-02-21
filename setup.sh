#!/bin/bash

# Chat App Setup Script
# This script automates the setup process for the chat application

echo "╔════════════════════════════════════════════════╗"
echo "║  💬 Chat App - Automated Setup Script          ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if Node.js is installed
print_info "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js (v14 or higher) first."
    exit 1
fi
print_success "Node.js $(node --version) found"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi
print_success "npm $(npm --version) found"

# Check if MongoDB is running
print_info "Checking MongoDB connection..."
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    print_warning "MongoDB CLI not found. Make sure MongoDB is installed and running."
fi

echo ""
print_info "Setting up Backend..."
echo ""

# Navigate to server directory
cd server

# Install backend dependencies
print_info "Installing backend dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed successfully"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_info "Creating .env file from .env.example..."
    cp .env.example .env
    print_success ".env file created"
    print_warning "Please update the .env file with your configuration before running the server"
else
    print_info ".env file already exists"
fi

# Create uploads directory
if [ ! -d uploads ]; then
    mkdir uploads
    print_success "uploads directory created"
fi

echo ""
print_info "Setting up Frontend..."
echo ""

# Navigate to client directory
cd ../client

# Install frontend dependencies
print_info "Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_info "Creating .env file from .env.example..."
    cp .env.example .env
    print_success ".env file created"
else
    print_info ".env file already exists"
fi

# Go back to root directory
cd ..

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║  ✅ Setup Complete!                            ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
print_info "Next steps:"
echo ""
echo "1. Configure environment variables:"
echo "   - Update server/.env with your MongoDB URI and JWT secret"
echo "   - Review client/.env (default values should work)"
echo ""
echo "2. Start the backend server:"
echo "   ${BLUE}cd server && npm run dev${NC}"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   ${BLUE}cd client && npm start${NC}"
echo ""
echo "4. Open your browser at: ${GREEN}http://localhost:3000${NC}"
echo ""
print_success "Happy coding! 🚀"
