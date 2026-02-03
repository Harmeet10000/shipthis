# AWS EC2 Deployment Guide - ShipThis

Complete guide to deploy both frontend and backend on a single AWS EC2 instance.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [EC2 Instance Setup](#ec2-instance-setup)
- [Server Configuration](#server-configuration)
- [Application Deployment](#application-deployment)
- [Nginx Configuration](#nginx-configuration)
- [SSL/HTTPS Setup](#sslhttps-setup)
- [Process Management](#process-management)
- [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🔧 Prerequisites

### Local Requirements

- AWS Account with EC2 access
- SSH key pair for EC2 access
- Domain name (optional, for SSL)
- Git repository with your code

### External Services

- MongoDB Atlas account (or MongoDB instance)
- Redis Cloud account (or Redis instance)
- Mapbox API token

---

## 🚀 EC2 Instance Setup

> 📘 **Detailed Setup Guide**: For step-by-step instructions with exact button clicks and screenshots descriptions, see **[EC2_SETUP_GUIDE.md](./EC2_SETUP_GUIDE.md)**

### Quick Setup Summary

1. **Login to AWS Console** → Navigate to EC2 Dashboard → Click "Launch Instance"

2. **Configure Instance**
   - **Name**: `shipthis-production`
   - **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance Type**: `t2.medium` or `t3.medium` (recommended)
   - **Key Pair**: Create new or select existing (save `.pem` file securely)
   - **Security Group Rules**:
     - SSH (port 22) - Your IP
     - HTTP (port 80) - 0.0.0.0/0
     - HTTPS (port 443) - 0.0.0.0/0
     - Custom TCP (port 5000) - 0.0.0.0/0
   - **Storage**: 20 GB gp3 (minimum)

3. **Launch & Connect**
   - Wait for "running" state
   - Note the Public IPv4 address

### Connect to Instance

```bash
# Set correct permissions for your key
chmod 400 your-key.pem

# Connect to instance
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

> ⚠️ **First Time?** See [EC2_SETUP_GUIDE.md](./EC2_SETUP_GUIDE.md) for detailed instructions with visual guidance.

---

## ⚙️ Server Configuration

### Step 3: Update System & Install Dependencies

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y git curl wget vim build-essential nginx

# Install Nginx (web server & reverse proxy)
sudo apt install -y nginx

# Install Python 3.11
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
sudo apt install -y python3.12 python3.12-venv python3.12-dev

# Install uv (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.cargo/env

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install npm/pnpm/bun (choose one)
sudo npm install -g pnpm
# OR
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Verify installations
python3.11 --version
uv --version
node --version
npm --version
nginx -v
```

### Step 4: Configure Firewall (UFW)

```bash
# Enable firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 5000/tcp
sudo ufw enable

# Check status
sudo ufw status
```

---

## 📦 Application Deployment

### Step 5: Clone Repository

```bash
# Create application directory
sudo mkdir -p /var/www
sudo chown -R ubuntu:ubuntu /var/www
cd /var/www

# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git shipthis
cd shipthis
```

### Step 6: Setup Backend

```bash
cd /var/www/shipthis/backend

# Create production environment file
nano .env.production
```

**Add the following to `.env.production`:**

```env
# Application Settings
APP_NAME="ShipThis"
APP_VERSION="1.0.0"
ENVIRONMENT=production
CORS_ORIGINS=["http://YOUR_EC2_IP","http://YOUR_DOMAIN","https://YOUR_DOMAIN"]

# Server Configuration
HOST=0.0.0.0
PORT=5000
WORKERS=2

# Database (Use your MongoDB Atlas connection string)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=shipthis

# Redis Cache (Use your Redis Cloud connection)
REDIS_URL=redis://default:password@host:port
REDIS_HOST=your-redis-host
REDIS_PORT=your-redis-port
REDIS_USERNAME=default
REDIS_PASSWORD=your-redis-password

# External API
MAPBOX_TOKEN=your_mapbox_token_here

# JWT Authentication (CHANGE THESE IN PRODUCTION!)
JWT_SECRET_KEY=your-super-secret-production-key-change-this
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=10080
JWT_REFRESH_TOKEN_EXPIRE_MINUTES=10080

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json
LOG_FILE=/var/www/shipthis/backend/logs/app.log
LOG_DIR=/var/www/shipthis/backend/logs/
LOG_ROTATION=10 MB
LOG_RETENTION=30 days
LOG_COMPRESSION=zip

# Rate Limiting
RATE_LIMIT_ENABLED=True
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_PERIOD=60
```

```bash
# Create logs directory
mkdir -p logs

# Test backend
uv run uvicorn src.app.main:app --host 0.0.0.0 --port 5000

# If it works, stop it (Ctrl+C) and continue
```

### Step 7: Setup Frontend

```bash
cd /var/www/shipthis/frontend

# Create production environment file
nano .env.production
```

**Add the following to `.env.production`:**

```env
# Use your EC2 public IP or domain
VITE_API_BASE_URL=http://YOUR_EC2_IP:5000
# OR if using domain with SSL
# VITE_API_BASE_URL=https://api.yourdomain.com

VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

```bash
# Install dependencies
npm install
# OR
pnpm install
# OR
bun install

# Build for production
npm run build
# OR
pnpm build
# OR
bun run build

# This creates a 'dist' folder with optimized static files
```

---

## 🌐 Nginx Configuration

### Step 8: Configure Nginx as Reverse Proxy

```bash
# Remove default config
sudo rm /etc/nginx/sites-enabled/default

# Create new config
sudo nano /etc/nginx/sites-available/shipthis
```

**Add the following configuration:**

```nginx
# Backend API Server
upstream backend_api {
    server 127.0.0.1:5000;
}

# Main server block
server {
    listen 80;
    server_name YOUR_EC2_IP;  # Replace with your domain if you have one

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend - Serve static files
    location / {
        root /var/www/shipthis/frontend/dist;
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API - Reverse proxy
    location /api/ {
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # API docs
    location /docs {
        proxy_pass http://backend_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /redoc {
        proxy_pass http://backend_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://backend_api;
        access_log off;
    }

    # Logs
    access_log /var/log/nginx/shipthis_access.log;
    error_log /var/log/nginx/shipthis_error.log;
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/shipthis /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx

# Enable nginx to start on boot
sudo systemctl enable nginx
```

---

## 🔒 SSL/HTTPS Setup (Optional but Recommended)

### Step 9: Setup SSL with Let's Encrypt (If you have a domain)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot will automatically update your nginx config
# Follow the prompts and choose to redirect HTTP to HTTPS

# Test auto-renewal
sudo certbot renew --dry-run
```

**Update frontend `.env.production` to use HTTPS:**

```env
VITE_API_BASE_URL=https://yourdomain.com
```

**Rebuild frontend:**

```bash
cd /var/www/shipthis/frontend
npm run build
```

---

## 🔄 Process Management with PM2

### Step 10: Setup PM2 for Backend

```bash
# Install PM2 globally
sudo npm install -g pm2

# Create PM2 ecosystem file
cd /var/www/shipthis/backend
nano ecosystem.config.js
```

**Add the following:**

```javascript
module.exports = {
  apps: [
    {
      name: "shipthis-backend",
      script: "uv",
      args: "run uvicorn src.app.main:app --host 0.0.0.0 --port 5000 --workers 2",
      cwd: "/var/www/shipthis/backend",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PYTHONUNBUFFERED: "1",
      },
      error_file: "/var/www/shipthis/backend/logs/pm2-error.log",
      out_file: "/var/www/shipthis/backend/logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
```

```bash
# Start backend with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup systemd
# Run the command that PM2 outputs

# Check status
pm2 status
pm2 logs shipthis-backend

# Useful PM2 commands
pm2 restart shipthis-backend  # Restart app
pm2 stop shipthis-backend     # Stop app
pm2 delete shipthis-backend   # Remove app
pm2 monit                     # Monitor resources
```

---

## 📊 Monitoring & Maintenance

### Step 11: Setup Monitoring

```bash
# Check application status
pm2 status
pm2 logs shipthis-backend --lines 100

# Check nginx status
sudo systemctl status nginx
sudo tail -f /var/log/nginx/shipthis_access.log
sudo tail -f /var/log/nginx/shipthis_error.log

# Check system resources
htop
df -h  # Disk usage
free -h  # Memory usage

# Check application logs
tail -f /var/www/shipthis/backend/logs/app.log
```

### Step 12: Deployment Script for Updates

Create a deployment script for easy updates:

```bash
nano /var/www/shipthis/deploy.sh
```

**Add the following:**

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /var/www/shipthis

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

# Update backend
echo "🔧 Updating backend..."
cd backend
# uv will automatically sync dependencies

# Restart backend
echo "🔄 Restarting backend..."
pm2 restart shipthis-backend

# Update frontend
echo "🎨 Building frontend..."
cd ../frontend
npm install
npm run build

# Reload nginx
echo "🌐 Reloading nginx..."
sudo systemctl reload nginx

echo "✅ Deployment complete!"
echo "📊 Check status with: pm2 status"
```

```bash
# Make script executable
chmod +x /var/www/shipthis/deploy.sh

# Run deployment
./deploy.sh
```

---

## 🧪 Testing Deployment

### Step 13: Verify Everything Works

```bash
# Test backend API
curl http://YOUR_EC2_IP:5000/health
curl http://YOUR_EC2_IP/api/v1/health

# Test frontend
curl http://YOUR_EC2_IP/

# Check if services are running
pm2 status
sudo systemctl status nginx

# Check logs for errors
pm2 logs shipthis-backend --lines 50
sudo tail -n 50 /var/log/nginx/shipthis_error.log
```

**Access in browser:**

- Frontend: `http://YOUR_EC2_IP`
- Backend API Docs: `http://YOUR_EC2_IP/docs`
- Backend Health: `http://YOUR_EC2_IP/api/v1/health`

---

## 🔐 Security Best Practices

### Additional Security Steps

```bash
# 1. Change SSH port (optional)
sudo nano /etc/ssh/sshd_config
# Change Port 22 to something else like 2222
sudo systemctl restart sshd

# 2. Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd

# 3. Setup fail2ban (prevents brute force)
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# 4. Regular updates
sudo apt update && sudo apt upgrade -y

# 5. Setup automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---

## 📝 Environment Variables Checklist

Before deployment, ensure you have:

- [ ] MongoDB connection string (MongoDB Atlas)
- [ ] Redis connection details (Redis Cloud)
- [ ] Mapbox API token
- [ ] Strong JWT secret key (generate with: `openssl rand -hex 32`)
- [ ] EC2 public IP or domain name
- [ ] SSL certificate (if using domain)

---

## 🆘 Troubleshooting

### Common Issues

**Backend not starting:**

```bash
# Check logs
pm2 logs shipthis-backend
# Check if port 5000 is in use
sudo lsof -i :5000
# Kill process if needed
sudo kill -9 PID
```

**Frontend not loading:**

```bash
# Check nginx config
sudo nginx -t
# Check nginx logs
sudo tail -f /var/log/nginx/shipthis_error.log
# Verify dist folder exists
ls -la /var/www/shipthis/frontend/dist
```

**CORS errors:**

- Update `CORS_ORIGINS` in backend `.env.production`
- Include your EC2 IP and domain
- Restart backend: `pm2 restart shipthis-backend`

**Database connection issues:**

- Verify MongoDB Atlas allows connections from EC2 IP
- Check connection string in `.env.production`
- Test connection: `mongosh "YOUR_MONGODB_URI"`

**Redis connection issues:**

- Verify Redis Cloud allows connections from EC2 IP
- Check Redis credentials in `.env.production`

---

## 📚 Useful Commands Reference

```bash
# PM2 Commands
pm2 start ecosystem.config.js
pm2 restart shipthis-backend
pm2 stop shipthis-backend
pm2 logs shipthis-backend
pm2 monit
pm2 status

# Nginx Commands
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo nginx -t

# System Commands
sudo systemctl status nginx
sudo systemctl status pm2-ubuntu
df -h
free -h
htop

# Logs
tail -f /var/www/shipthis/backend/logs/app.log
sudo tail -f /var/log/nginx/shipthis_access.log
sudo tail -f /var/log/nginx/shipthis_error.log
pm2 logs shipthis-backend --lines 100
```

---

## 🎉 Deployment Complete!

Your application should now be running at:

- **Frontend**: `http://YOUR_EC2_IP` or `https://yourdomain.com`
- **Backend API**: `http://YOUR_EC2_IP/api/v1` or `https://yourdomain.com/api/v1`
- **API Docs**: `http://YOUR_EC2_IP/docs`

For production use, it's highly recommended to:

1. Use a custom domain name
2. Enable HTTPS with SSL certificate
3. Setup monitoring and alerting
4. Configure automated backups
5. Implement CI/CD pipeline

---

**Need Help?** Check the logs and refer to the troubleshooting section above.
