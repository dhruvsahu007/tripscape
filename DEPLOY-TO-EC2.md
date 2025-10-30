# 🚀 Tripscape Deployment - Your EC2 Instance

## 📊 Your EC2 Instance Details

```
Instance ID:    i-0712b2b90db56afb7
Instance Name:  tripscape
Public IP:      54.197.135.238
DNS:            ec2-54-197-135-238.compute-1.amazonaws.com
Instance Type:  t2.small (1 vCPU, 2GB RAM)
OS:             Amazon Linux 2023
Region:         us-east-1 (N. Virginia)
Key Pair:       tripscape-pem-key
Status:         ✅ Running
```

## ⚠️ CRITICAL: Setup IAM Role First

Your instance currently has **NO IAM role** attached. You MUST add one for AWS Bedrock to work.

### Add IAM Role to Instance:

1. Go to EC2 Console → Select instance `i-0712b2b90db56afb7`
2. **Actions** → **Security** → **Modify IAM role**
3. Click **Create new IAM role** (opens IAM console)
4. Create role with these details:
   - **Trusted entity**: AWS service → EC2
   - **Permissions**: Click "Create policy" and paste:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "bedrock:InvokeModel",
           "bedrock:Retrieve",
           "bedrock:InvokeModelWithResponseStream"
         ],
         "Resource": "*"
       }
     ]
   }
   ```
   - **Name**: `tripscape-bedrock-role`
5. Return to EC2 and attach `tripscape-bedrock-role`
6. **Update IAM role** on the instance

## 🔐 Security Group Configuration

Ensure your security group has these inbound rules:

```
Type        Protocol    Port    Source          Description
SSH         TCP         22      Your IP         SSH access
HTTP        TCP         80      0.0.0.0/0       HTTP traffic
HTTPS       TCP         443     0.0.0.0/0       HTTPS traffic
Custom TCP  TCP         3000    0.0.0.0/0       Frontend (Next.js)
Custom TCP  TCP         8000    0.0.0.0/0       Backend (FastAPI)
```

### Add Rules if Missing:
```bash
# Get your security group ID first
aws ec2 describe-instances --instance-ids i-0712b2b90db56afb7 \
  --query 'Reservations[0].Instances[0].SecurityGroups[0].GroupId'

# Then add rules (replace sg-xxxxx with your group ID)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --ip-permissions \
    IpProtocol=tcp,FromPort=3000,ToPort=3000,IpRanges='[{CidrIp=0.0.0.0/0}]' \
    IpProtocol=tcp,FromPort=8000,ToPort=8000,IpRanges='[{CidrIp=0.0.0.0/0}]'
```

## 🔗 Connect to Your Instance

### Option 1: SSH with Key File
```bash
ssh -i "tripscape-pem-key.pem" ec2-user@54.197.135.238
```

### Option 2: EC2 Instance Connect (Browser-based)
1. Go to EC2 Console
2. Select instance `i-0712b2b90db56afb7`
3. Click **Connect** → **EC2 Instance Connect**
4. Click **Connect** button

## 📦 Deployment Steps

### 1. Connect and Update System
```bash
# Connect to EC2
ssh -i "tripscape-pem-key.pem" ec2-user@54.197.135.238

# Update system (Amazon Linux 2023)
sudo dnf update -y
```

### 2. Install Python 3.11
```bash
# Amazon Linux 2023 comes with Python 3.9, install 3.11
sudo dnf install python3.11 python3.11-pip python3.11-devel -y

# Verify
python3.11 --version  # Should show Python 3.11.x
```

### 3. Install Node.js 18+
```bash
# Install Node.js 18 LTS
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install nodejs -y

# Verify
node --version  # Should show v18.x.x
npm --version
```

### 4. Install Git
```bash
sudo dnf install git -y
```

### 5. Clone Repository
```bash
cd ~
git clone https://github.com/dhruvsahu007/tripscape.git
cd tripscape
```

## 🔧 Backend Deployment

### 6. Setup Backend
```bash
cd ~/tripscape/backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 7. Configure Backend Environment
```bash
# The .env file is already configured with your EC2 IP
# Verify it:
cat .env

# Should show:
# CORS_ORIGINS=http://localhost:3000,http://54.197.135.238:3000,...
```

### 8. Create systemd Service for Backend
```bash
sudo nano /etc/systemd/system/tripscape-backend.service
```

**Paste this:**
```ini
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
```

**Save and exit** (Ctrl+X, Y, Enter)

### 9. Start Backend Service
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable tripscape-backend

# Start the service
sudo systemctl start tripscape-backend

# Check status
sudo systemctl status tripscape-backend

# Should show "active (running)" in green
```

### 10. Test Backend
```bash
# Test health endpoint
curl http://localhost:8000/api/health

# Should return: {"status":"OK","message":"Server is running","environment":"production"}

# Test from outside (use your local machine)
curl http://54.197.135.238:8000/api/health
```

## 🎨 Frontend Deployment

### 11. Setup Frontend
```bash
cd ~/tripscape/frontend

# Install dependencies
npm install
```

### 12. Verify Environment Configuration
```bash
# The .env.production is already configured
cat .env.production

# Should show:
# NEXT_PUBLIC_API_URL=http://54.197.135.238:8000
# NEXT_PUBLIC_WS_URL=ws://54.197.135.238:8000
```

### 13. Build Frontend
```bash
# Build for production (this may take 2-3 minutes)
npm run build

# You should see output like:
# ✓ Creating an optimized production build
# ✓ Compiled successfully
```

### 14. Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 15. Start Frontend with PM2
```bash
# Start Next.js in production mode
pm2 start npm --name "tripscape-frontend" -- start

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
# Copy and run the command it outputs (will look like):
# sudo env PATH=$PATH:/usr/bin ...

# Check status
pm2 status
pm2 logs tripscape-frontend
```

### 16. Test Frontend
```bash
# From EC2
curl http://localhost:3000

# From your local browser
http://54.197.135.238:3000
```

## 🧪 Verification Checklist

Open your browser and test these URLs:

- [ ] **Frontend Homepage**: http://54.197.135.238:3000
- [ ] **Backend Health**: http://54.197.135.238:8000/api/health
- [ ] **API Docs**: http://54.197.135.238:8000/docs
- [ ] **Packages Page**: http://54.197.135.238:3000/packages
- [ ] **Package Detail**: http://54.197.135.238:3000/packages/pkg-001
- [ ] **Agent Dashboard**: http://54.197.135.238:3000/agent
- [ ] **Chatbot**: Click bubble on homepage (bottom-right)
- [ ] **WebSocket**: Check agent dashboard shows green "Connected" badge

## 🔍 Troubleshooting

### Backend Issues

**Check backend logs:**
```bash
sudo journalctl -u tripscape-backend -f
```

**Common issues:**
```bash
# Port 8000 already in use
sudo lsof -i :8000
sudo kill $(sudo lsof -t -i:8000)

# Permission denied
sudo chown -R ec2-user:ec2-user ~/tripscape

# IAM role not working
# Make sure you attached the IAM role and rebooted instance
```

### Frontend Issues

**Check frontend logs:**
```bash
pm2 logs tripscape-frontend
```

**Restart frontend:**
```bash
pm2 restart tripscape-frontend
```

**Rebuild frontend:**
```bash
cd ~/tripscape/frontend
npm run build
pm2 restart tripscape-frontend
```

### WebSocket Connection Fails

**Check backend is running:**
```bash
curl http://localhost:8000/api/health
```

**Check security group:**
- Port 8000 must be open to 0.0.0.0/0
- Check in EC2 Console → Security Groups

### Can't SSH to Instance

**Fix key permissions (on your local machine):**
```bash
chmod 400 tripscape-pem-key.pem
```

## 📊 Monitoring Commands

```bash
# Backend status
sudo systemctl status tripscape-backend

# Frontend status
pm2 status

# Frontend logs (live)
pm2 logs tripscape-frontend --lines 100

# Backend logs (live)
sudo journalctl -u tripscape-backend -f

# System resources
htop  # or: top
df -h  # disk usage
free -h  # memory usage
```

## 🔄 Update Deployment

When you push code changes:

```bash
# SSH to EC2
ssh -i "tripscape-pem-key.pem" ec2-user@54.197.135.238

cd ~/tripscape
git pull origin main

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart tripscape-backend

# Update frontend
cd ../frontend
npm install
npm run build
pm2 restart tripscape-frontend
```

## 🌐 Optional: Setup Domain & SSL

### If you have a domain name:

1. **Add DNS A record** pointing to `54.197.135.238`
2. **Install Nginx** for reverse proxy
3. **Get SSL certificate** with Let's Encrypt
4. **Update environment variables** with domain name

See full `DEPLOYMENT.md` for detailed SSL setup.

## ✅ Deployment Complete!

Your Tripscape application is now live at:

- **Frontend**: http://54.197.135.238:3000
- **Backend**: http://54.197.135.238:8000
- **API Docs**: http://54.197.135.238:8000/docs
- **Agent Dashboard**: http://54.197.135.238:3000/agent

## 🎉 Next Steps

1. **Test all features** (packages, chatbot, agent system)
2. **Add IAM role** for AWS Bedrock (REQUIRED for AI chatbot)
3. **Setup monitoring** (CloudWatch, etc.)
4. **Get a domain name** (optional but recommended)
5. **Setup SSL/HTTPS** with domain

---

**Instance Details:**
- IP: `54.197.135.238`
- DNS: `ec2-54-197-135-238.compute-1.amazonaws.com`
- Type: `t2.small`
- Key: `tripscape-pem-key.pem`

**Support:** If you encounter issues, check the troubleshooting section or refer to the full `DEPLOYMENT.md` guide.
