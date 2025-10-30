# 🚀 Tripscape Deployment Guide - AWS EC2# Deployment Guide



## 📋 Pre-Deployment ChecklistThis guide covers deploying the Tripscape application to production manually.



### ✅ Local Verification## Environment Setup

- [ ] Test build locally: `cd frontend && npm run build`

- [ ] Backend runs without errors: `cd backend && python main.py`### Backend (.env)

- [ ] All environment variables configured (see below)```env

- [ ] No hardcoded URLs (all using environment variables)ENVIRONMENT=production

- [ ] AWS credentials removed from `.env` filePORT=8000

DEBUG=False

---CORS_ORIGINS=https://your-frontend-domain.com

SECRET_KEY=your-strong-random-secret-key

## 🖥️ EC2 Instance Setup```



### 1. Launch EC2 Instance### Frontend (.env.production)

1. **Choose AMI**: Ubuntu Server 22.04 LTS```env

2. **Instance Type**: t2.medium or better (2GB+ RAM)NEXT_PUBLIC_API_URL=https://your-backend-domain.com

3. **Storage**: 20GB SSD minimum```

4. **Security Group**: Create with these rules:

   ```## Deployment Options

   SSH       - Port 22   - Your IP (for management)

   HTTP      - Port 80   - 0.0.0.0/0 (public)### Platform-Specific Deployments

   HTTPS     - Port 443  - 0.0.0.0/0 (public)

   Custom    - Port 3000 - 0.0.0.0/0 (frontend)#### Backend - Railway / Render / Fly.io

   Custom    - Port 8000 - 0.0.0.0/0 (backend)

   ```1. Connect your repository

5. **IAM Role**: Attach role with Bedrock permissions (for AI chatbot)2. Set environment variables from `.env.example`

3. Set build command: `pip install -r requirements.txt`

### 2. IAM Role for AWS Bedrock4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

```json

{#### Backend - Heroku

  "Version": "2012-10-17",

  "Statement": [```bash

    {cd backend

      "Effect": "Allow",heroku create your-app-name

      "Action": [heroku config:set ENVIRONMENT=production

        "bedrock:InvokeModel",heroku config:set CORS_ORIGINS=https://your-frontend.vercel.app

        "bedrock:Retrieve"git push heroku main

      ],```

      "Resource": "*"

    }#### Frontend - Vercel (Recommended)

  ]

}1. Import project from Git

```2. Root directory: `frontend`

Attach this role to your EC2 instance (no AWS keys needed!)3. Framework preset: Next.js

4. Set environment variables:

---   - `NEXT_PUBLIC_API_URL`: Your backend URL

5. Deploy

## 🔧 Server Setup

#### Frontend - Netlify

### 3. Connect to EC2

```bash1. Build command: `npm run build`

ssh -i your-key.pem ubuntu@your-ec2-public-ip2. Publish directory: `.next`

```3. Set environment variables

4. Deploy

### 4. Install Dependencies

```bash### Traditional Server Deployment

# Update system

sudo apt update && sudo apt upgrade -y#### Backend

```bash

# Install Python 3.11+cd backend

sudo apt install python3.11 python3.11-venv python3-pip -ypython3 -m venv venv

source venv/bin/activate  # Linux/Mac (Windows: venv\Scripts\activate)

# Install Node.js 18+pip install -r requirements.txt

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

sudo apt install nodejs -y# Install process manager

pip install gunicorn

# Verify installations

python3.11 --version# Run with gunicorn (production)

node --versiongunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

npm --version```



# Install Git#### Frontend

sudo apt install git -y```bash

```cd frontend

npm install --legacy-peer-deps

---npm run build

npm start  # Production server

## 📦 Deploy Backend (FastAPI)

# Or use PM2

### 5. Setup Backend Directorynpm install -g pm2

```bashpm2 start npm --name "tripscape-frontend" -- start

# Clone your repository```

git clone https://github.com/yourusername/tripscape.git

cd tripscape/backend## Security Checklist



# Create virtual environment- [ ] Update `SECRET_KEY` with a strong random value

python3.11 -m venv venv- [ ] Configure CORS origins to only allowed domains

source venv/bin/activate- [ ] Enable HTTPS/SSL certificates

- [ ] Set `ENVIRONMENT=production`

# Install Python packages- [ ] Set `DEBUG=False`

pip install -r requirements.txt- [ ] Use environment variables for sensitive data

```- [ ] Enable rate limiting (add middleware)

- [ ] Set up monitoring and logging

### 6. Configure Backend Environment- [ ] Regular dependency updates

```bash- [ ] Database backups (when applicable)

# Edit .env file

nano .env## Monitoring

```

### Backend Health Check

**Update these values:**```bash

```bashcurl https://your-backend-domain.com/api/health

PORT=8000```

ENVIRONMENT=production

DEBUG=False### Frontend Health Check

```bash

# Add your EC2 public IP and domaincurl https://your-frontend-domain.com

CORS_ORIGINS=http://YOUR_EC2_IP:3000,https://your-domain.com```



# Keep the generated strong key## Troubleshooting

SECRET_KEY=qE19WNTB_ZGdqPdx9arNwgB4wYWSZ7seqGZxzceRAkM

### CORS Issues

# AWS credentials - LEAVE COMMENTED (using IAM role)- Ensure backend CORS_ORIGINS includes frontend domain

# AWS_ACCESS_KEY_ID=- Check protocol (http vs https)

# AWS_SECRET_ACCESS_KEY=

AWS_REGION=us-east-1### Build Failures

BEDROCK_KNOWLEDGE_BASE_ID=QE5T7XCXWZ- Check Node.js version (18+)

```- Check Python version (3.8+)

- Verify all environment variables are set

### 7. Run Backend with systemd (Production)

```bash### Performance

# Create systemd service- Enable CDN for static assets

sudo nano /etc/systemd/system/tripscape-backend.service- Configure caching headers

```- Use database connection pooling

- Monitor application metrics

**Paste this:**
```ini
[Unit]
Description=Tripscape Backend API
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/tripscape/backend
Environment="PATH=/home/ubuntu/tripscape/backend/venv/bin"
ExecStart=/home/ubuntu/tripscape/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Start service:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable tripscape-backend
sudo systemctl start tripscape-backend
sudo systemctl status tripscape-backend
```

### 8. Test Backend
```bash
curl http://localhost:8000/api/health
# Should return: {"status":"OK","message":"Server is running","environment":"production"}
```

---

## 🎨 Deploy Frontend (Next.js)

### 9. Setup Frontend Directory
```bash
cd ~/tripscape/frontend

# Install Node dependencies
npm install
```

### 10. Configure Frontend Environment
```bash
# Create production environment file
nano .env.production
```

**Update with your EC2 IP:**
```bash
# Replace YOUR_EC2_IP with your actual EC2 public IP
NEXT_PUBLIC_API_URL=http://YOUR_EC2_IP:8000
NEXT_PUBLIC_WS_URL=ws://YOUR_EC2_IP:8000

# With domain (after DNS setup):
# NEXT_PUBLIC_API_URL=https://api.your-domain.com
# NEXT_PUBLIC_WS_URL=wss://api.your-domain.com
```

### 11. Build Frontend
```bash
npm run build
# This creates optimized production build in .next folder
```

### 12. Run Frontend with PM2
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start Next.js in production mode
pm2 start npm --name "tripscape-frontend" -- start

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command it outputs
```

### 13. Test Frontend
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs tripscape-frontend

# Test in browser
curl http://localhost:3000
```

---

## 🌐 Domain & SSL (Optional but Recommended)

### 14. Setup Nginx Reverse Proxy
```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/tripscape
```

**Paste this config:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/tripscape /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 15. Setup SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (certbot sets this up automatically)
sudo certbot renew --dry-run
```

**After SSL setup, update `.env.production`:**
```bash
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_PUBLIC_WS_URL=wss://your-domain.com
```

**Rebuild frontend:**
```bash
cd ~/tripscape/frontend
npm run build
pm2 restart tripscape-frontend
```

---

## 🔍 Monitoring & Maintenance

### Check Logs
```bash
# Backend logs
sudo journalctl -u tripscape-backend -f

# Frontend logs
pm2 logs tripscape-frontend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Restart Services
```bash
# Backend
sudo systemctl restart tripscape-backend

# Frontend
pm2 restart tripscape-frontend

# Nginx
sudo systemctl restart nginx
```

### Update Code
```bash
cd ~/tripscape
git pull origin main

# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart tripscape-backend

# Frontend
cd ../frontend
npm install
npm run build
pm2 restart tripscape-frontend
```

---

## 🧪 Testing Deployment

### 1. Test Backend API
```bash
# Health check
curl http://YOUR_EC2_IP:8000/api/health

# Chat endpoint
curl -X POST http://YOUR_EC2_IP:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","conversationHistory":[]}'
```

### 2. Test Frontend
- Visit: `http://YOUR_EC2_IP:3000`
- Check packages page: `http://YOUR_EC2_IP:3000/packages`
- Test chatbot (bottom right bubble)
- Test agent dashboard: `http://YOUR_EC2_IP:3000/agent`

### 3. Test Agent System
1. Open main site: `http://YOUR_EC2_IP:3000`
2. Open agent dashboard: `http://YOUR_EC2_IP:3000/agent` (new tab)
3. Click chatbot on main site
4. Type "connect to agent"
5. Customer should appear in agent queue
6. Click "Accept" in agent dashboard
7. Send messages between customer and agent

---

## ⚠️ Troubleshooting

### Backend won't start
```bash
# Check logs
sudo journalctl -u tripscape-backend -n 50

# Common issues:
# - Port 8000 already in use: sudo lsof -i :8000
# - Missing packages: pip install -r requirements.txt
# - IAM role not attached: Check EC2 console
```

### Frontend build fails
```bash
# Clear cache and rebuild
cd ~/tripscape/frontend
rm -rf .next node_modules
npm install
npm run build
```

### WebSocket connection fails
```bash
# Check if backend is running
curl http://localhost:8000/api/health

# Check firewall rules
sudo ufw status

# Check CORS settings in backend/.env
```

### SSL certificate issues
```bash
# Renew manually
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

---

## 📊 Performance Optimization

### Enable PM2 Cluster Mode (Multi-core)
```bash
pm2 delete tripscape-frontend
pm2 start npm --name "tripscape-frontend" -i max -- start
pm2 save
```

### Enable Gzip in Nginx
Add to nginx config inside `server` block:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1000;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
```

---

## 🔐 Security Checklist

- [x] AWS credentials removed from `.env`
- [x] Strong SECRET_KEY generated
- [x] IAM role attached to EC2
- [x] CORS properly configured
- [x] HTTPS/SSL enabled (recommended)
- [ ] Regular security updates: `sudo apt update && sudo apt upgrade`
- [ ] Firewall configured (UFW or Security Groups)
- [ ] SSH key-based auth only (disable password auth)

---

## 📝 Quick Reference

### Service Management
```bash
# Backend
sudo systemctl start|stop|restart|status tripscape-backend

# Frontend
pm2 start|stop|restart|status tripscape-frontend
pm2 logs tripscape-frontend

# Nginx
sudo systemctl start|stop|restart|status nginx
```

### Environment Files
- Backend: `~/tripscape/backend/.env`
- Frontend: `~/tripscape/frontend/.env.production`

### Port Reference
- Frontend: 3000
- Backend: 8000
- HTTP: 80
- HTTPS: 443

---

## 🎯 Post-Deployment

1. **Test all features** (packages, chatbot, agent system)
2. **Setup monitoring** (CloudWatch, Datadog, etc.)
3. **Configure backups** (database if added later)
4. **Document your domain/IP** for team
5. **Setup DNS** A records pointing to EC2 IP

---

## 🆘 Need Help?

**Common Issues:**
- **502 Bad Gateway**: Backend not running or wrong port
- **CORS errors**: Update CORS_ORIGINS in backend/.env
- **WebSocket fails**: Check firewall/security groups
- **Build fails**: Check Node.js version (need 18+)

**Support:**
- GitHub Issues: https://github.com/yourusername/tripscape/issues
- Email: support@tripscape.com

---

## ✅ Deployment Complete!

Your Tripscape app should now be live at:
- **Frontend**: http://YOUR_EC2_IP:3000
- **Backend**: http://YOUR_EC2_IP:8000
- **Agent Dashboard**: http://YOUR_EC2_IP:3000/agent

🎉 **Congratulations!** Your travel platform is now deployed!
