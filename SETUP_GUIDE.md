# 🚀 CookGenie - Setup Guide

Complete guide to get CookGenie running on your local machine.

## ⚡ Quick Start (5 Minutes)

If you want to get started quickly, follow these steps:

### Prerequisites Checklist
- [ ] Python 3.9+ installed (`python --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL installed and running
- [ ] Gemini API Key ([Get free key](https://makersuite.google.com/app/apikey))

### Fast Setup

```bash
# 1. Create database
psql -U postgres
CREATE DATABASE cookgenie_db;
CREATE USER cookgenie WITH PASSWORD 'cookgenie123';
GRANT ALL PRIVILEGES ON DATABASE cookgenie_db TO cookgenie;
\q

# 2. Setup Backend
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # macOS/Linux
pip install -r requirements.txt
cp .env.example .env        # Edit and add your Gemini API key

# 3. Setup Frontend
cd frontend
npm install
cp .env.local.example .env.local

# 4. Run (in 2 separate terminals)
# Terminal 1: cd backend && python main.py
# Terminal 2: cd frontend && npm run dev

# 5. Open http://localhost:3000
```

---

## 📋 Detailed Setup Instructions

### Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Getting Your Gemini API Key](#getting-your-gemini-api-key)
6. [Running the Application](#running-the-application)
7. [First-Time Usage](#first-time-usage)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

1. **Python 3.9 or higher**
   - Download from [python.org](https://www.python.org/downloads/)
   - Verify: `python --version`

2. **Node.js 18 or higher**
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version` and `npm --version`

3. **PostgreSQL 12 or higher**
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS**: `brew install postgresql@14`
   - **Linux**: `sudo apt-get install postgresql postgresql-contrib`

4. **Git** (to clone the repository)
   - Download from [git-scm.com](https://git-scm.com/)

## Database Setup

### Step 1: Install PostgreSQL

Follow the installation instructions for your operating system above.

### Step 2: Start PostgreSQL Service

**Windows:**
- PostgreSQL service starts automatically after installation
- Check in Services (Win + R, type `services.msc`)

**macOS:**
```bash
brew services start postgresql@14
```

**Linux:**
```bash
sudo service postgresql start
```

### Step 3: Create Database and User

Open your terminal/command prompt and run:

```bash
# Connect to PostgreSQL
psql -U postgres

# You'll be in PostgreSQL prompt, run these commands:
CREATE DATABASE cookgenie_db;
CREATE USER cookgenie WITH PASSWORD 'cookgenie123';
GRANT ALL PRIVILEGES ON DATABASE cookgenie_db TO cookgenie;
\q
```

**Verify Database Creation:**
```bash
psql -U postgres -l
# You should see cookgenie_db in the list
```

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

This will install all required Python packages.

### Step 4: Configure Environment Variables

**Windows:**
```bash
copy .env.example .env
```

**macOS/Linux:**
```bash
cp .env.example .env
```

Now edit the `.env` file (use any text editor):

```env
DATABASE_URL=postgresql://cookgenie:cookgenie123@localhost:5432/cookgenie_db
GEMINI_API_KEY=your_actual_api_key_here
ENVIRONMENT=development
```

⚠️ **Important**: You need to get a Gemini API key (see next section).

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy the generated API key
5. Paste it in your `backend/.env` file:
   ```env
   GEMINI_API_KEY=your_copied_api_key_here
   ```

**Note**: The API key is free to use with reasonable limits. Keep it secret!

## Frontend Setup

### Step 1: Navigate to Frontend Directory

Open a **new terminal** (keep backend terminal open) and run:

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required Node.js packages. It may take a few minutes.

### Step 3: Configure Environment Variables

**Windows:**
```bash
copy .env.local.example .env.local
```

**macOS/Linux:**
```bash
cp .env.local.example .env.local
```

The default configuration should work:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Running the Application

You need to run both backend and frontend simultaneously.

### Terminal 1: Start Backend

```bash
cd backend
# Activate venv if not already active
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

✅ Backend is running at **http://localhost:8000**
📚 API Docs available at **http://localhost:8000/docs**

### Terminal 2: Start Frontend

```bash
cd frontend
npm run dev
```

You should see:
```
- Local:        http://localhost:3000
- Ready in Xs
```

✅ Frontend is running at **http://localhost:3000**

### Step 3: Open the Application

1. Open your browser
2. Go to **http://localhost:3000**
3. You should see the CookGenie dashboard!

## First-Time Usage

### 1. Add Ingredients

1. Click **"Inventory"** in the navigation
2. Click **"Add Item"** button
3. Fill in the form:
   - Name: e.g., "Tomatoes"
   - Quantity: e.g., 5
   - Unit: piece
   - Category: Vegetable (optional)
   - Expiry Date: (optional)
4. Click **"Add Item"**

Add at least 5-10 ingredients to get good recipe suggestions.

### 2. Set Your Preferences (Optional)

1. Click **"Settings"** in the navigation
2. Add dietary restrictions (e.g., "Vegan")
3. Add preferred cuisines (e.g., "Italian")
4. Add disliked ingredients to avoid
5. Add available kitchen tools (e.g., "Oven", "Blender")
6. Set max cooking time
7. Click **"Save Preferences"**

### 3. Generate Your First Recipe

1. Go back to **Dashboard** or **Recipes**
2. Click **"Generate Recipe"** button
3. Choose options (or leave default)
4. Click **"Generate Recipe"**
5. Wait 5-10 seconds for AI to create your recipe
6. View your personalized recipe!

## Troubleshooting

### Backend Issues

**Error: "Connection refused" or "Database connection failed"**

Solution:
```bash
# Check if PostgreSQL is running
# Windows: Check Services app
# macOS: brew services list
# Linux: sudo service postgresql status

# If not running, start it:
# macOS: brew services start postgresql@14
# Linux: sudo service postgresql start
```

**Error: "GEMINI_API_KEY not found" or "Invalid API key"**

Solution:
1. Check if `.env` file exists in `backend/` directory
2. Verify API key is correct
3. Get a new API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

**Error: "Port 8000 already in use"**

Solution:
```bash
# Find and kill process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# macOS/Linux:
lsof -ti:8000 | xargs kill -9
```

### Frontend Issues

**Error: "Cannot connect to API"**

Solution:
1. Make sure backend is running (check Terminal 1)
2. Verify backend is accessible at http://localhost:8000
3. Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000`

**Error: "Module not found" or dependency issues**

Solution:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error: "Port 3000 already in use"**

Solution:
```bash
# Option 1: Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
npm run dev -- -p 3001
```

### Recipe Generation Issues

**Recipes not generating or taking too long**

Possible causes:
1. **No ingredients**: Add at least 5 ingredients to inventory
2. **API quota exceeded**: Check [Google AI Studio](https://makersuite.google.com/) for quota
3. **Internet connection**: Ensure you have stable internet
4. **API key invalid**: Verify your Gemini API key

**Generated recipes are not relevant**

Solution:
1. Add more specific ingredients to your inventory
2. Set your preferences in Settings
3. Specify cuisine type when generating

## Advanced Configuration

### Change Database Credentials

Edit `backend/.env`:
```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/your_database
```

### Change Ports

**Backend Port:**
Edit `backend/main.py`:
```python
uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
```

**Frontend Port:**
```bash
npm run dev -- -p 3001
```

Don't forget to update `NEXT_PUBLIC_API_URL` in `frontend/.env.local`!

## 📚 Additional Resources

- **[README.md](README.md)** - Project overview and features
- **API Documentation** - http://localhost:8000/docs
- **Gemini API** - https://ai.google.dev/docs

## 🆘 Still Need Help?

1. Check backend terminal for errors
2. Check frontend terminal for errors
3. Open browser console (F12) for frontend errors
4. Verify all prerequisites are installed
5. Make sure Gemini API key is correct and active

---

**Congratulations! 🎉 You're ready to use CookGenie!**

Happy cooking! 🍳✨

