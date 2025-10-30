# 🎯 START HERE - Deploy Tripscape to EC2

**Your EC2 Instance:** `54.197.135.238` (i-0712b2b90db56afb7)

---

## 🚀 Deploy in 3 Simple Steps

### Step 1️⃣: Pre-Flight Check (2 minutes)

#### A. Add IAM Role (CRITICAL for AI Chatbot)
1. Open [EC2 Console](https://console.aws.amazon.com/ec2/)
2. Find instance: `i-0712b2b90db56afb7`
3. **Actions** → **Security** → **Modify IAM role**
4. Create new role if needed:
   - Service: EC2
   - Permission: `bedrock:InvokeModel`
   - Name: `tripscape-bedrock-role`
5. Attach role and **Reboot instance**

#### B. Verify Security Group
Instance should allow these ports:
- 22 (SSH) - Your IP
- 80, 443 (HTTP/HTTPS) - 0.0.0.0/0
- 3000, 8000 (App ports) - 0.0.0.0/0

[Check Security Group](https://console.aws.amazon.com/ec2/v2/home#SecurityGroups:)

---

### Step 2️⃣: Connect to EC2 (1 minute)

Open terminal and run:

```bash
ssh -i "tripscape-pem-key.pem" ec2-user@54.197.135.238
```

**Troubleshooting:**
- Permission denied? Run: `chmod 400 tripscape-pem-key.pem`
- Connection refused? Check security group port 22
- Can't find key? Make sure you're in the right directory

---

### Step 3️⃣: Deploy Application (10 minutes)

Once connected to EC2, **copy and paste** this entire block:

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
```

**Wait for:** Script to finish (~10 minutes). You'll see "✅ Deployment Complete!"

---

## ✅ Verify Deployment

### Quick Check (on EC2):
```bash
# Backend status
sudo systemctl status tripscape-backend

# Frontend status
pm2 status

# Test endpoints
curl http://localhost:8000/api/health
curl http://localhost:3000
```

### Browser Check:
Open these URLs in your browser:

1. **Frontend**: http://54.197.135.238:3000
   - Should see Tripscape homepage ✅

2. **Backend**: http://54.197.135.238:8000/api/health
   - Should see: `{"status":"OK",...}` ✅

3. **API Docs**: http://54.197.135.238:8000/docs
   - Should see Swagger UI ✅

4. **Packages**: http://54.197.135.238:3000/packages
   - Should see 7 travel packages ✅

5. **Agent Dashboard**: http://54.197.135.238:3000/agent
   - Should see green "Connected" badge ✅

---

## 🎯 Test Core Features

### Test 1: Packages
1. Go to http://54.197.135.238:3000/packages
2. Click "View Details" on any package
3. Should see full package details ✅

### Test 2: AI Chatbot
1. Go to homepage: http://54.197.135.238:3000
2. Click chatbot bubble (bottom-right)
3. Type: "Show me destinations"
4. Should get AI response ✅
   - *If no response: Check IAM role is attached*

### Test 3: Agent System
1. Open http://54.197.135.238:3000/agent (agent dashboard)
2. Open http://54.197.135.238:3000 (main site) in new tab
3. Click chatbot, type "connect to agent"
4. Customer should appear in agent queue ✅
5. Click "Accept" in agent dashboard
6. Send messages between customer/agent ✅

---

## 🐛 Something Not Working?

### Backend Error
```bash
# Check logs
sudo journalctl -u tripscape-backend -n 50

# Restart
sudo systemctl restart tripscape-backend
```

### Frontend Error
```bash
# Check logs
pm2 logs tripscape-frontend --lines 50

# Restart
pm2 restart tripscape-frontend
```

### Can't Access from Browser
- Check security group ports (3000, 8000)
- Check services are running (commands above)

### AI Chatbot Not Responding
- **Most common:** IAM role not attached
- Go to EC2 Console → Modify IAM role
- Attach `tripscape-bedrock-role`
- Reboot instance

---

## 📚 Need More Help?

Detailed guides available:

1. **PRE-DEPLOY-CHECKLIST.md** - Complete checklist
2. **QUICK-DEPLOY.md** - Fast commands reference
3. **DEPLOY-TO-EC2.md** - Detailed step-by-step guide
4. **DEPLOYMENT.md** - General deployment reference

---

## ✨ Success!

Once all features are working, your Tripscape travel platform is **LIVE**! 🎉

**Your URLs:**
- Frontend: http://54.197.135.238:3000
- Backend API: http://54.197.135.238:8000
- API Docs: http://54.197.135.238:8000/docs
- Agent Dashboard: http://54.197.135.238:3000/agent

**Next Steps:**
- Get a domain name (optional)
- Setup SSL/HTTPS (recommended)
- Configure monitoring
- Add more packages/content

---

**Questions?** Check the detailed guides or AWS documentation.

**Happy Deploying! 🚀**
