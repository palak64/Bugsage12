# 🚀 BugSage - How to Run the Project

Complete guide to get BugSage up and running on your machine.

---

## 📋 Prerequisites

Before you start, make sure you have:

1. **Node.js 20.x or higher**
   - Download from: https://nodejs.org/
   - Verify: `node -v` (should show v20.x.x or higher)

2. **Docker Desktop**
   - Download from: https://www.docker.com/products/docker-desktop/
   - Verify: `docker --version` and `docker-compose --version`

3. **Gemini API Key**
   - Get from: https://makersuite.google.com/app/apikey
   - Keep it ready for the `.env` file

---

## 🛠️ Step-by-Step Setup

### Step 1: Clone or Download the Project

```bash
# If cloning from GitHub
git clone https://github.com/YOUR_USERNAME/BugSage-AI.git
cd BugSage-AI

# Or if you have the project folder
cd /path/to/BugSage-AI-main
```

### Step 2: Create Environment File

Create a `.env` file in the project root:

```bash
# In the project root directory
touch .env
```

Add your Gemini API key to `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Important:** Replace `your_gemini_api_key_here` with your actual Gemini API key.

### Step 3: Start the Application

From the project root directory, run:

```bash
docker-compose up -d --build
```

This will:
- Build both frontend and backend Docker images
- Start both services in the background
- Install all dependencies automatically

**First time build takes 5-10 minutes** (downloading images and dependencies)

### Step 4: Verify Services are Running

Check if containers are running:

```bash
docker ps
```

You should see:
- `bugsage-ai-main-backend-1` on port 4000
- `bugsage-ai-main-frontend-1` on port 3000

### Step 5: Access the Application

Open your browser and go to:

- **Frontend (Main App)**: http://localhost:3000
- **Backend API**: http://localhost:4000

---

## 🎯 Using the Application

### Navigation

Once you open http://localhost:3000, you'll see:

- **Sidebar Navigation** with links to:
  - Home
  - Dashboard
  - Bug List
  - Report Bug
  - Analytics
  - AI Playground
  - Settings

### Key Features

1. **Report a Bug**
   - Click "Report Bug" or use the button on Home page
   - Fill in bug details
   - AI will automatically predict severity, time, and type

2. **AI Playground**
   - Test all AI features
   - Try different bug descriptions
   - See real-time AI predictions

3. **Dashboard**
   - View bug analytics
   - See charts and statistics
   - Recent bugs list

---

## 🛠️ Common Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Just backend
docker-compose logs -f backend

# Just frontend
docker-compose logs -f frontend
```

### Restart Services
```bash
docker-compose restart

# Or restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### Rebuild After Code Changes
```bash
# Rebuild and restart
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build frontend
docker-compose up -d --build backend
```

### Check Service Status
```bash
docker-compose ps
```

---

## 🐛 Troubleshooting

### Issue: Port Already in Use

**Error:** `port is already allocated`

**Solution:**
```bash
# Stop other services using ports 3000 or 4000
# Or change ports in docker-compose.yml
```

### Issue: Docker Build Fails

**Error:** `npm install` fails or SSL errors

**Solution:**
- Check your network connection
- Ensure Docker Desktop is running
- Try: `docker-compose down` then `docker-compose up -d --build`

### Issue: API Calls Failing

**Error:** CORS errors or connection refused

**Solution:**
- Verify backend is running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Verify `.env` file has `GEMINI_API_KEY` set

### Issue: Frontend Not Loading

**Error:** Blank page or 404

**Solution:**
- Check frontend logs: `docker-compose logs frontend`
- Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Verify frontend container is running: `docker ps`

### Issue: AI Features Not Working

**Error:** "AI call failed"

**Solution:**
- Verify `GEMINI_API_KEY` is set in `.env`
- Check backend logs for API errors: `docker-compose logs backend | grep -i gemini`
- Restart backend: `docker-compose restart backend`

### Issue: Cannot Access Application

**Error:** Connection refused

**Solution:**
1. Check if containers are running: `docker ps`
2. If not running, start them: `docker-compose up -d`
3. Check logs for errors: `docker-compose logs`

---

## 🔄 Running Without Docker (Development Mode)

If you prefer to run without Docker:

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on: http://localhost:4000

### Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:3000 (or port Vite assigns)

**Note:** Make sure `.env` file is in the project root for backend to access `GEMINI_API_KEY`.

---

## 📝 Environment Variables

The `.env` file should contain:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Security Note:** Never commit `.env` file to git. It's already in `.gitignore`.

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Docker Desktop is running
- [ ] `.env` file exists with `GEMINI_API_KEY`
- [ ] Both containers are running (`docker ps`)
- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend health check works: http://localhost:4000/health
- [ ] Can navigate between pages
- [ ] Can report a bug
- [ ] AI Playground buttons work

---

## 🎓 Quick Start Summary

```bash
# 1. Navigate to project
cd BugSage-AI-main

# 2. Create .env file
echo "GEMINI_API_KEY=your_key_here" > .env

# 3. Start services
docker-compose up -d --build

# 4. Open browser
# http://localhost:3000
```

---

## 📚 Additional Resources

- **Project README**: See `README.md` for more details
- **API Documentation**: Backend API runs on http://localhost:4000
- **Health Check**: http://localhost:4000/health

---

## 💡 Tips

- **First Build**: Takes 5-10 minutes, be patient
- **Subsequent Starts**: Much faster (uses cached images)
- **View Logs**: Use `docker-compose logs -f` to see what's happening
- **Stop Everything**: `docker-compose down` when done
- **Clean Start**: `docker-compose down -v` removes volumes too

---

**Happy Bug Tracking! 🐛✨**

For issues or questions, check the logs first: `docker-compose logs`

