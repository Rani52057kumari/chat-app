@echo off
REM Chat App Setup Script for Windows
REM This script automates the setup process for the chat application

echo ================================================
echo   Chat App - Automated Setup Script
echo ================================================
echo.

echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)
echo [SUCCESS] Node.js found
node --version

echo [INFO] Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)
echo [SUCCESS] npm found
npm --version

echo.
echo [INFO] Setting up Backend...
echo.

REM Navigate to server directory
cd server

REM Install backend dependencies
echo [INFO] Installing backend dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Backend dependencies installed successfully

REM Create .env file if it doesn't exist
if not exist .env (
    echo [INFO] Creating .env file from .env.example...
    copy .env.example .env
    echo [SUCCESS] .env file created
    echo [WARNING] Please update the .env file with your configuration
) else (
    echo [INFO] .env file already exists
)

REM Create uploads directory
if not exist uploads (
    mkdir uploads
    echo [SUCCESS] uploads directory created
)

echo.
echo [INFO] Setting up Frontend...
echo.

REM Navigate to client directory
cd ..\client

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Frontend dependencies installed successfully

REM Create .env file if it doesn't exist
if not exist .env (
    echo [INFO] Creating .env file from .env.example...
    copy .env.example .env
    echo [SUCCESS] .env file created
) else (
    echo [INFO] .env file already exists
)

REM Go back to root directory
cd ..

echo.
echo ================================================
echo   Setup Complete!
echo ================================================
echo.
echo [INFO] Next steps:
echo.
echo 1. Configure environment variables:
echo    - Update server\.env with your MongoDB URI and JWT secret
echo    - Review client\.env (default values should work)
echo.
echo 2. Start the backend server:
echo    cd server ^&^& npm run dev
echo.
echo 3. In a new terminal, start the frontend:
echo    cd client ^&^& npm start
echo.
echo 4. Open your browser at: http://localhost:3000
echo.
echo [SUCCESS] Happy coding!
echo.
pause
