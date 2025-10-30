# ✅ Pre-Deployment Checklist - EC2 Instance i-0712b2b90db56afb7

**Instance:** `54.197.135.238` | **Type:** t2.small | **Key:** `tripscape-pem-key.pem`

---

## Before You Deploy

### 1. Security Group Configuration ⚠️
Check your security group has these inbound rules:

- [ ] Port 22 (SSH) - Your IP or 0.0.0.0/0
- [ ] Port 80 (HTTP) - 0.0.0.0/0
- [ ] Port 443 (HTTPS) - 0.0.0.0/0
- [ ] Port 3000 (Frontend) - 0.0.0.0/0
- [ ] Port 8000 (Backend) - 0.0.0.0/0

**How to check:**
1. EC2 Console → Instances → Select `i-0712b2b90db56afb7`
2. Click **Security** tab
3. Click on your security group
4. Check **Inbound rules**

---

### 2. IAM Role for AWS Bedrock 🔐 **CRITICAL**
Your instance shows **"IAM Role: –"** which means NO role attached.

**You MUST do this for AI chatbot to work:**

1. EC2 Console → Select instance `i-0712b2b90db56afb7`
2. **Actions** → **Security** → **Modify IAM role**
3. If no role exists:
   - Click **Create new IAM role**
   - Create role with policy:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [{
         "Effect": "Allow",
         "Action": [
           "bedrock:InvokeModel",
           "bedrock:Retrieve",
           "bedrock:InvokeModelWithResponseStream"
         ],
         "Resource": "*"
       }]
     }
     ```
   - Name it: `tripscape-bedrock-role`
4. Attach the role to instance
5. **Reboot instance** (recommended)

**Status:** ⚠️ NOT DONE - Complete this before deploying!

---

### 3. SSH Key File 🔑
- [ ] You have `tripscape-pem-key.pem` file
- [ ] Key file permissions set: `chmod 400 tripscape-pem-key.pem` (Mac/Linux)
- [ ] You can connect: `ssh -i tripscape-pem-key.pem ec2-user@54.197.135.238`

---

### 4. Local Configuration ✅
These are already done:

- [x] Backend `.env` updated with EC2 IP `54.197.135.238`
- [x] Frontend `.env.production` updated with EC2 IP
- [x] CORS configured for EC2 hostname
- [x] WebSocket URLs configured
- [x] Production mode enabled
- [x] Strong SECRET_KEY generated

---

## Deployment Steps

### Step 1: Connect to EC2
```bash
ssh -i "tripscape-pem-key.pem" ec2-user@54.197.135.238
```

**Expected:** You should see Amazon Linux 2023 welcome message.

---

### Step 2: Run One-Shot Installation Script

Open `QUICK-DEPLOY.md` and copy the **entire** "One-Shot Deployment Script" section.

Paste it into your EC2 terminal and press Enter.

**Time:** 5-10 minutes

**Watch for:**
- Python 3.11 installation
- Node.js 18 installation
- Git clone
- Backend pip install
- Frontend npm install & build
- Backend service starts
- Frontend PM2 starts

---

### Step 3: Verify Services Running

After script completes:

```bash
# Check backend
sudo systemctl status tripscape-backend
# Should show: "active (running)" in green

# Check frontend
pm2 status
# Should show: "online" status

# Test backend API
curl http://localhost:8000/api/health
# Should return: {"status":"OK",...}

# Test frontend
curl http://localhost:3000
# Should return: HTML content
```

---

### Step 4: Test from Your Browser

Open these URLs in your browser:

- [ ] **Frontend Homepage**: http://54.197.135.238:3000
  - Should load Tripscape homepage with hero section
  
- [ ] **Backend Health**: http://54.197.135.238:8000/api/health
  - Should show JSON: `{"status":"OK","message":"Server is running","environment":"production"}`
  
- [ ] **API Documentation**: http://54.197.135.238:8000/docs
  - Should show Swagger UI with API endpoints
  
- [ ] **Packages Page**: http://54.197.135.238:3000/packages
  - Should show 7 travel packages
  
- [ ] **Package Detail**: http://54.197.135.238:3000/packages/pkg-001
  - Should show Dubai package details
  
- [ ] **Agent Dashboard**: http://54.197.135.238:3000/agent
  - Should show agent dashboard with connection status
  - Green badge = connected
  - Red badge = check backend WebSocket

---

### Step 5: Test Core Features

#### Test Chatbot:
1. Go to http://54.197.135.238:3000
2. Click chatbot bubble (bottom-right)
3. Type: "Show me beach destinations"
4. Should get AI response (if IAM role attached)
5. If no response, check IAM role is attached

#### Test Agent System:
1. Open http://54.197.135.238:3000/agent in one tab
2. Open http://54.197.135.238:3000 in another tab
3. Click chatbot on main site
4. Type: "connect to agent"
5. Customer should appear in agent dashboard queue
6. Click "Accept" in agent dashboard
7. Send messages between customer and agent

---

## Post-Deployment Checks

### Backend Logs
```bash
# View live logs
sudo journalctl -u tripscape-backend -f

# Last 50 lines
sudo journalctl -u tripscape-backend -n 50
```

**Look for:**
- "Application startup complete"
- No errors about missing packages
- No AWS credential errors (if IAM role attached)

---

### Frontend Logs
```bash
# View live logs
pm2 logs tripscape-frontend

# Last 50 lines
pm2 logs tripscape-frontend --lines 50
```

**Look for:**
- "Ready in X ms"
- No build errors
- No connection refused errors

---

### System Resources

Check your t2.small instance isn't overloaded:

```bash
# Install htop
sudo dnf install htop -y

# Monitor resources
htop

# Check disk space
df -h

# Check memory
free -h
```

**Expected:**
- CPU: < 50% when idle
- Memory: ~1-1.5GB used (you have 2GB)
- Disk: < 5GB used

---

## Troubleshooting

### ❌ Backend shows "failed" status

```bash
# Check what went wrong
sudo journalctl -u tripscape-backend -n 100 --no-pager

# Common fixes:
# 1. Port in use
sudo lsof -i :8000
sudo systemctl restart tripscape-backend

# 2. Missing dependencies
cd ~/tripscape/backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart tripscape-backend

# 3. Environment file issues
cat ~/tripscape/backend/.env
# Verify CORS_ORIGINS has your EC2 IP
```

---

### ❌ Frontend shows "stopped" or "errored"

```bash
# Check error logs
pm2 logs tripscape-frontend --lines 50

# Common fixes:
# 1. Rebuild
cd ~/tripscape/frontend
npm run build
pm2 restart tripscape-frontend

# 2. Port in use
pm2 delete tripscape-frontend
pm2 start npm --name "tripscape-frontend" -- start

# 3. Check environment
cat ~/tripscape/frontend/.env.production
# Verify URLs point to 54.197.135.238
```

---

### ❌ Can't access from browser

**Check security group:**
1. EC2 Console → Select instance
2. Security tab → Check inbound rules
3. Ports 3000 and 8000 must be open to 0.0.0.0/0

**Check services are listening:**
```bash
sudo lsof -i :3000  # Frontend
sudo lsof -i :8000  # Backend
```

---

### ❌ WebSocket not connecting (agent dashboard red badge)

**Verify backend is running:**
```bash
curl http://localhost:8000/api/health
```

**Check WebSocket endpoint:**
```bash
# Should list WebSocket routes
curl http://localhost:8000/openapi.json | grep -i websocket
```

**Check security group:**
- Port 8000 must be open for WebSocket upgrade

---

### ❌ AI Chatbot not responding

**This is because IAM role is NOT attached!**

1. Go to EC2 Console
2. Select instance `i-0712b2b90db56afb7`
3. Actions → Security → Modify IAM role
4. Attach `tripscape-bedrock-role`
5. **Reboot instance** (Actions → Instance state → Reboot)
6. After reboot, check logs:
   ```bash
   sudo journalctl -u tripscape-backend -n 50
   ```

---

## Success Criteria ✅

Your deployment is successful when:

- [x] Both services show "active/running" status
- [x] Frontend loads at http://54.197.135.238:3000
- [x] Backend returns health check at :8000/api/health
- [x] All 7 packages display on /packages
- [x] Package details pages work (/packages/pkg-001)
- [x] Agent dashboard shows green "Connected" badge
- [x] Chatbot opens and responds (with IAM role)
- [x] Agent system can connect customer to agent

---

## Final Checklist

Before considering deployment complete:

### Configuration ✅
- [x] EC2 instance running (54.197.135.238)
- [ ] Security group ports open (22, 80, 443, 3000, 8000)
- [ ] IAM role attached (tripscape-bedrock-role)
- [x] Backend .env configured
- [x] Frontend .env.production configured

### Services ✅
- [ ] Backend service active and running
- [ ] Frontend PM2 process online
- [ ] Backend health check returns OK
- [ ] Frontend homepage loads

### Features ✅
- [ ] Packages page works
- [ ] Package details work
- [ ] Chatbot opens and responds
- [ ] Agent dashboard connects (green badge)
- [ ] Customer-to-agent chat works

### Monitoring ✅
- [ ] Backend logs show no errors
- [ ] Frontend logs show no errors
- [ ] System resources under 80% usage
- [ ] No security group errors

---

## 🎉 Deployment Complete!

Once all checkboxes are marked, your Tripscape application is fully deployed and ready for production use!

**Access your app:**
- Frontend: http://54.197.135.238:3000
- Backend: http://54.197.135.238:8000
- API Docs: http://54.197.135.238:8000/docs

**Need help?** Check `DEPLOY-TO-EC2.md` for detailed instructions.

---

**Instance Details for Reference:**
```
Instance ID:    i-0712b2b90db56afb7
Instance Name:  tripscape
Public IP:      54.197.135.238
DNS:            ec2-54-197-135-238.compute-1.amazonaws.com
Instance Type:  t2.small (1 vCPU, 2GB RAM)
OS:             Amazon Linux 2023
Region:         us-east-1
Key:            tripscape-pem-key.pem
```
