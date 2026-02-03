# Simple EC2 Deployment - No Nginx

Deploy both frontend and backend on EC2 and access them directly via ports.

---

## 🎯 What You'll Get

- **Frontend**: `http://YOUR_EC2_IP:5173`
- **Backend**: `http://YOUR_EC2_IP:5000`
- **API Docs**: `http://YOUR_EC2_IP:5000/docs`

No Nginx, no reverse proxy - just direct access!

---

## 🔧 Prerequisites

1. EC2 instance running Ubuntu 22.04
2. Security group with these ports open:
   - SSH (22)
   - Backend (5000)
   - Frontend (5173)

---

## 📋 Security Group Setup

Make sure your EC2 security group allows these ports:

| Type       | Port | Source    | Purpose      |
| ---------- | ---- | --------- | ------------ |
| SSH        | 22   | My IP     | SSH access   |
| Custom TCP | 5000 | 0.0.0.0/0 | Backend API  |
| Custom TCP | 5173 | 0.0.0.0/0 | Frontend Dev |

---

## 🚀 Step-by-Step Setup

### Step 1: Connect to EC2

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
```

### Step 2: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essentials
sudo apt install -y git curl wget vim build-essential

# Install Python 3.11
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3.11-dev

# Install uv (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.cargo/env

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (to keep apps running)
sudo npm install -g pm2

# Verify installations
python3.11 --version
uv --version
node --version
npm --version
pm2 --version
```

### Step 3: Clone Repository

```bash
# Create app directory
sudo mkdir -p /var/www
sudo chown -R ubuntu:ubuntu /var/www
cd /var/www

# Clone your repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git shipthis
cd shipthis
```

### Step 4: Setup Backend

```bash
cd /var/www/shipthis/backend

# Create environment file
nano .env.production
```

**Add your environment variables:**

```env
# Application Settings
APP_NAME="ShipThis"
APP_VERSION="1.0.0"
ENVIRONMENT=development
CORS_ORIGINS=["http://YOUR_EC2_IP:5173","http://YOUR_EC2_IP:5000"]

# Server Configuration
HOST=0.0.0.0
PORT=5000
WORKERS=1

# Database (MongoDB Atlas)
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=shipthis

# Redis Cache
REDIS_URL=your_redis_url
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password

# External API
MAPBOX_TOKEN=your_mapbox_token

# JWT Authentication
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=10080
JWT_REFRESH_TOKEN_EXPIRE_MINUTES=10080

# Logging
LOG_LEVEL=DEBUG
LOG_FORMAT=json
```

**Save and exit** (Ctrl+X, then Y, then Enter)

```bash
# Create logs directory
mkdir -p logs

# Start backend with PM2
pm2 start ecosystem.config.cjs

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
# Run the command that PM2 outputs

# Check if backend is running
pm2 status
pm2 logs shipthis-backend-dev
```

### Step 5: Setup Frontend

```bash
cd /var/www/shipthis/frontend

# Create environment file
nano .env.production
```

**Add your environment variables:**

```env
# Point to backend on port 5000
VITE_API_BASE_URL=http://YOUR_EC2_IP:5000
VITE_MAPBOX_TOKEN=your_mapbox_token
```

**Save and exit** (Ctrl+X, then Y, then Enter)

```bash
# Install dependencies
npm install

# Create logs directory
mkdir -p logs

# Start frontend with PM2
pm2 start ecosystem.config.cjs

# Save PM2 process list
pm2 save

# Check if frontend is running
pm2 status
pm2 logs shipthis-frontend-dev
```

### Step 6: Configure Vite for External Access

The `vite.config.ts` should already have this, but verify:

```bash
cd /var/www/shipthis/frontend
cat vite.config.ts
```

Make sure it has:

```typescript
export default defineConfig({
  // ... other config
  server: {
    host: "0.0.0.0", // Listen on all network interfaces
    port: 5173,
    strictPort: true,
  },
});
```

If you need to update it:

```bash
nano vite.config.ts
# Add the server config shown above
# Save and exit

# Restart frontend
pm2 restart shipthis-frontend-dev
```

---

## 🧪 Testing Your Setup

### Check Services

```bash
# Check PM2 status
pm2 status

# Should show both apps running:
# ┌─────┬────────────────────────────┬─────────┬─────────┐
# │ id  │ name                       │ status  │ restart │
# ├─────┼────────────────────────────┼─────────┼─────────┤
# │ 0   │ shipthis-backend-dev       │ online  │ 0       │
# │ 1   │ shipthis-frontend-dev      │ online  │ 0       │
# └─────┴────────────────────────────┴─────────┴─────────┘

# Check logs
pm2 logs
```

### Test from EC2 Instance

```bash
# Test backend
curl http://localhost:5000/health

# Test frontend
curl http://localhost:5173
```

### Test from Your Browser

Open these URLs in your browser:

- **Frontend**: `http://YOUR_EC2_IP:5173`
- **Backend API Docs**: `http://YOUR_EC2_IP:5000/docs`
- **Backend Health**: `http://YOUR_EC2_IP:5000/api/v1/health`

Replace `YOUR_EC2_IP` with your actual EC2 public IP address.

---

## 🔍 Finding Your EC2 IP

### From EC2 Instance (SSH)

```bash
# Get public IP
curl http://169.254.169.254/latest/meta-data/public-ipv4

# Or
curl ifconfig.me
```

### From AWS Console

1. Go to **EC2 Dashboard**
2. Click **Instances**
3. Select your instance
4. Look at **Public IPv4 address** in the details below

---

## 🔄 Making Changes

### Update Backend Code

```bash
# SSH into server
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Navigate to backend
cd /var/www/shipthis/backend

# Pull latest changes
git pull origin main

# Backend will auto-reload (uvicorn --reload)
# Check logs
pm2 logs shipthis-backend-dev
```

### Update Frontend Code

```bash
# Navigate to frontend
cd /var/www/shipthis/frontend

# Pull latest changes
git pull origin main

# Install new dependencies if any
npm install

# Frontend will auto-reload (Vite HMR)
# Check logs
pm2 logs shipthis-frontend-dev
```

---

## 📝 Useful Commands

### PM2 Commands

```bash
# View all processes
pm2 status

# View logs (all apps)
pm2 logs

# View specific app logs
pm2 logs shipthis-backend-dev
pm2 logs shipthis-frontend-dev

# View last 100 lines
pm2 logs shipthis-backend-dev --lines 100

# Restart apps
pm2 restart shipthis-backend-dev
pm2 restart shipthis-frontend-dev
pm2 restart all

# Stop apps
pm2 stop shipthis-backend-dev
pm2 stop shipthis-frontend-dev

# Delete apps from PM2
pm2 delete shipthis-backend-dev
pm2 delete shipthis-frontend-dev

# Monitor resources
pm2 monit

# Save current process list
pm2 save

# Resurrect saved processes (after reboot)
pm2 resurrect
```

### Check Ports

```bash
# Check if ports are listening
sudo lsof -i :5000  # Backend
sudo lsof -i :5173  # Frontend

# Check all listening ports
sudo netstat -tulpn | grep LISTEN
```

### System Monitoring

```bash
# CPU and Memory
htop

# Disk usage
df -h

# Memory usage
free -h
```

---

## 🆘 Troubleshooting

### Frontend Not Accessible from Browser

**Problem**: Can access from EC2 but not from your browser

**Solution**:

1. Check security group allows port 5173
2. Verify Vite is listening on `0.0.0.0`:
   ```bash
   pm2 logs shipthis-frontend-dev | grep -i "local"
   # Should show: Local: http://0.0.0.0:5173/
   ```
3. Check firewall:
   ```bash
   sudo ufw status
   # If active, allow port 5173
   sudo ufw allow 5173/tcp
   ```

### Backend Not Accessible

**Problem**: Can't reach backend API

**Solution**:

1. Check security group allows port 5000
2. Verify backend is running:
   ```bash
   pm2 logs shipthis-backend-dev
   curl http://localhost:5000/health
   ```
3. Check CORS settings in backend `.env.production`

### CORS Errors in Browser Console

**Problem**: Frontend can't call backend due to CORS

**Solution**:

```bash
cd /var/www/shipthis/backend
nano .env.production

# Update CORS_ORIGINS to include your EC2 IP with port
CORS_ORIGINS=["http://YOUR_EC2_IP:5173","http://YOUR_EC2_IP:5000"]

# Restart backend
pm2 restart shipthis-backend-dev
```

### Port Already in Use

**Problem**: Can't start app because port is in use

**Solution**:

```bash
# Find what's using the port
sudo lsof -i :5000  # or :5173

# Kill the process
sudo kill -9 PID

# Or stop PM2 app first
pm2 stop shipthis-backend-dev
pm2 start ecosystem.config.cjs
```

### App Keeps Restarting

**Problem**: PM2 shows app restarting constantly

**Solution**:

```bash
# Check logs for errors
pm2 logs shipthis-backend-dev --lines 50

# Common issues:
# - Missing environment variables
# - Database connection failed
# - Port already in use
# - Missing dependencies
```

### Can't Connect to Database

**Problem**: Backend can't connect to MongoDB

**Solution**:

1. Check MongoDB Atlas allows connections from EC2 IP
2. Add EC2 IP to MongoDB Atlas whitelist:
   - Go to MongoDB Atlas
   - Network Access
   - Add IP Address
   - Enter your EC2 public IP
3. Verify connection string in `.env.production`
4. Test connection:
   ```bash
   mongosh "YOUR_MONGODB_URI"
   ```

---

## 🔒 Security Notes

> ⚠️ **Warning**: This setup is for **development/testing only**!

For production:

1. Use Nginx with SSL/HTTPS
2. Don't expose port 5173 (build and serve static files)
3. Use environment-specific secrets
4. Enable rate limiting
5. Setup monitoring and alerts
6. Use a domain name instead of IP
7. Implement proper firewall rules

---

## 💡 Tips

### Keep Terminal Sessions Alive

If you want to run commands without PM2:

```bash
# Install tmux or screen
sudo apt install -y tmux

# Start tmux session
tmux new -s shipthis

# Run your commands
cd /var/www/shipthis/backend
uv run uvicorn src.app.main:app --reload --host 0.0.0.0 --port 5000

# Detach from session: Ctrl+B then D
# Reattach: tmux attach -t shipthis
```

### Quick Restart Script

Create a script to restart both apps:

```bash
nano ~/restart-apps.sh
```

Add:

```bash
#!/bin/bash
pm2 restart shipthis-backend-dev
pm2 restart shipthis-frontend-dev
pm2 status
```

Make executable:

```bash
chmod +x ~/restart-apps.sh
./restart-apps.sh
```

---

## ✅ Checklist

Before testing:

- [ ] EC2 instance is running
- [ ] Security group allows ports 22, 5000, 5173
- [ ] Backend is running (check with `pm2 status`)
- [ ] Frontend is running (check with `pm2 status`)
- [ ] Environment variables are set correctly
- [ ] CORS includes your EC2 IP with port 5173
- [ ] You know your EC2 public IP address

---

## 🎉 You're Done!

Access your application:

- **Frontend**: `http://YOUR_EC2_IP:5173`
- **Backend**: `http://YOUR_EC2_IP:5000`
- **API Docs**: `http://YOUR_EC2_IP:5000/docs`

Make changes locally, push to git, pull on EC2, and watch them reload automatically!

---

## 📚 Next Steps

- Setup a domain name
- Add SSL/HTTPS with Let's Encrypt
- Setup Nginx for production
- Implement CI/CD with GitHub Actions
- Add monitoring and alerting

---

**Need Help?** Check the troubleshooting section or PM2 logs for errors.
