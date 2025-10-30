# 🚀 Quick Deployment Commands - EC2 Instance

**Instance:** `54.197.135.238` (i-0712b2b90db56afb7)  
**Key:** `tripscape-pem-key.pem`

---

## 📡 Connect to EC2

```bash
ssh -i "tripscape-pem-key.pem" ec2-user@54.197.135.238
```

---

## ⚡ One-Shot Deployment Script

Copy and paste this entire block into your EC2 terminal:

```bash
# Update system
sudo dnf update -y

# Install Python 3.11
sudo dnf install python3.11 python3.11-pip python3.11-devel -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install nodejs -y

# Install Git
sudo dnf install git -y

# Clone repository
cd ~
git clone https://github.com/dhruvsahu007/tripscape.git
cd tripscape

# Setup Backend
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create backend service
sudo tee /etc/systemd/system/tripscape-backend.service > /dev/null <<EOF
[Unit]
Description=Tripscape Backend API
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/tripscape/backend
Environment="PATH=/home/ec2-user/tripscape/backend/venv/bin"
ExecStart=/home/ec2-user/tripscape/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Start backend
sudo systemctl daemon-reload
sudo systemctl enable tripscape-backend
sudo systemctl start tripscape-backend

# Setup Frontend
cd ~/tripscape/frontend
npm install
npm run build

# Install PM2 and start frontend
sudo npm install -g pm2
pm2 start npm --name "tripscape-frontend" -- start
pm2 save
pm2 startup systemd

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "Frontend: http://54.197.135.238:3000"
echo "Backend:  http://54.197.135.238:8000"
echo ""
echo "Check status:"
echo "  Backend:  sudo systemctl status tripscape-backend"
echo "  Frontend: pm2 status"
```

---

## 🔍 Quick Status Check

```bash
# Backend status
sudo systemctl status tripscape-backend

# Frontend status
pm2 status

# Test backend
curl http://localhost:8000/api/health

# Test frontend
curl http://localhost:3000
```

---

## 📋 Service Management

### Backend (systemd)
```bash
sudo systemctl start tripscape-backend    # Start
sudo systemctl stop tripscape-backend     # Stop
sudo systemctl restart tripscape-backend  # Restart
sudo systemctl status tripscape-backend   # Status
sudo journalctl -u tripscape-backend -f   # Logs (live)
```

### Frontend (PM2)
```bash
pm2 start tripscape-frontend     # Start
pm2 stop tripscape-frontend      # Stop
pm2 restart tripscape-frontend   # Restart
pm2 status                       # Status
pm2 logs tripscape-frontend      # Logs
pm2 logs tripscape-frontend -f   # Logs (live)
```

---

## 🔄 Update Code

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

## 🧪 Test URLs

Open in your browser:

- Homepage: http://54.197.135.238:3000
- Backend Health: http://54.197.135.238:8000/api/health
- API Docs: http://54.197.135.238:8000/docs
- Packages: http://54.197.135.238:3000/packages
- Agent Dashboard: http://54.197.135.238:3000/agent

---

## 🐛 Quick Fixes

### Backend won't start
```bash
sudo journalctl -u tripscape-backend -n 50 --no-pager
sudo systemctl restart tripscape-backend
```

### Frontend won't start
```bash
pm2 logs tripscape-frontend --lines 50
cd ~/tripscape/frontend
npm run build
pm2 restart tripscape-frontend
```

### Port already in use
```bash
# Backend (port 8000)
sudo lsof -i :8000
sudo kill $(sudo lsof -t -i:8000)

# Frontend (port 3000)
pm2 delete tripscape-frontend
pm2 start npm --name "tripscape-frontend" -- start
```

### WebSocket not connecting
```bash
# Check backend is running
curl http://localhost:8000/api/health

# Check security group in EC2 console
# Port 8000 must be open
```

---

## ⚠️ CRITICAL: Add IAM Role

Your instance needs IAM role for AWS Bedrock (AI chatbot):

1. EC2 Console → Select `i-0712b2b90db56afb7`
2. **Actions** → **Security** → **Modify IAM role**
3. Attach role with Bedrock permissions
4. Reboot instance (optional but recommended)

---

## 📊 Monitor Resources

```bash
# CPU and memory usage
top

# Better version (needs installation)
sudo dnf install htop -y
htop

# Disk usage
df -h

# Memory usage
free -h

# Process list
ps aux | grep -E 'uvicorn|node'
```

---

## 🔒 Security Group Ports

Required inbound rules:

```
22    SSH       Your IP
80    HTTP      0.0.0.0/0
443   HTTPS     0.0.0.0/0
3000  Frontend  0.0.0.0/0
8000  Backend   0.0.0.0/0
```

---

## 📝 Important Paths

```bash
# Application
~/tripscape/

# Backend
~/tripscape/backend/
~/tripscape/backend/.env
~/tripscape/backend/venv/

# Frontend
~/tripscape/frontend/
~/tripscape/frontend/.env.production
~/tripscape/frontend/.next/

# Logs
sudo journalctl -u tripscape-backend -f
pm2 logs tripscape-frontend
```

---

## 🎯 Quick Verification

After deployment, run:

```bash
# Backend health
curl http://54.197.135.238:8000/api/health

# Frontend homepage
curl http://54.197.135.238:3000

# Check both services
sudo systemctl status tripscape-backend
pm2 status
```

Expected output:
- Backend: `{"status":"OK","message":"Server is running","environment":"production"}`
- Frontend: HTML content
- Both services: `active (running)` / `online`

---

## 📞 Need Help?

Full documentation: `DEPLOY-TO-EC2.md`

Common issues resolved in `DEPLOYMENT.md` troubleshooting section.
