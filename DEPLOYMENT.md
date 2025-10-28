# Deployment Guide

This guide covers deploying the Tripscape application to production manually.

## Environment Setup

### Backend (.env)
```env
ENVIRONMENT=production
PORT=8000
DEBUG=False
CORS_ORIGINS=https://your-frontend-domain.com
SECRET_KEY=your-strong-random-secret-key
```

### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## Deployment Options

### Platform-Specific Deployments

#### Backend - Railway / Render / Fly.io

1. Connect your repository
2. Set environment variables from `.env.example`
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

#### Backend - Heroku

```bash
cd backend
heroku create your-app-name
heroku config:set ENVIRONMENT=production
heroku config:set CORS_ORIGINS=https://your-frontend.vercel.app
git push heroku main
```

#### Frontend - Vercel (Recommended)

1. Import project from Git
2. Root directory: `frontend`
3. Framework preset: Next.js
4. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
5. Deploy

#### Frontend - Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Set environment variables
4. Deploy

### Traditional Server Deployment

#### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Linux/Mac (Windows: venv\Scripts\activate)
pip install -r requirements.txt

# Install process manager
pip install gunicorn

# Run with gunicorn (production)
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run build
npm start  # Production server

# Or use PM2
npm install -g pm2
pm2 start npm --name "tripscape-frontend" -- start
```

## Security Checklist

- [ ] Update `SECRET_KEY` with a strong random value
- [ ] Configure CORS origins to only allowed domains
- [ ] Enable HTTPS/SSL certificates
- [ ] Set `ENVIRONMENT=production`
- [ ] Set `DEBUG=False`
- [ ] Use environment variables for sensitive data
- [ ] Enable rate limiting (add middleware)
- [ ] Set up monitoring and logging
- [ ] Regular dependency updates
- [ ] Database backups (when applicable)

## Monitoring

### Backend Health Check
```bash
curl https://your-backend-domain.com/api/health
```

### Frontend Health Check
```bash
curl https://your-frontend-domain.com
```

## Troubleshooting

### CORS Issues
- Ensure backend CORS_ORIGINS includes frontend domain
- Check protocol (http vs https)

### Build Failures
- Check Node.js version (18+)
- Check Python version (3.8+)
- Verify all environment variables are set

### Performance
- Enable CDN for static assets
- Configure caching headers
- Use database connection pooling
- Monitor application metrics
