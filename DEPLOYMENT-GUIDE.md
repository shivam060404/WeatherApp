# Vercel Deployment Guide

## Prerequisites
1. A free Vercel account (https://vercel.com)
2. Node.js installed locally
3. Git installed locally

## Deployment Steps

### 1. Prepare Your Project
Make sure your project has the following files:
- `package.json` - Defines dependencies and scripts
- `vercel.json` - Vercel configuration
- `index.js` - Main entry point
- `api/` directory - Contains serverless functions
- `public/` directory - Static frontend files

### 2. Initialize Git Repository (if not already done)
```bash
git init
git add .
git commit -m "Initial commit"
```

### 3. Deploy Using Vercel CLI

#### Install Vercel CLI globally:
```bash
npm install -g vercel
```

#### Deploy to Vercel:
```bash
vercel
```

Follow the prompts:
1. Log in to your Vercel account
2. Select the project directory (current directory)
3. Choose default settings or customize as needed
4. Wait for deployment to complete

### 4. Deploy Using Git Integration

#### Push to GitHub/GitLab/Bitbucket:
```bash
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

#### Connect to Vercel:
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your Git repository
4. Configure project settings (use default settings)
5. Click "Deploy"

## Configuration Details

### vercel.json
This file tells Vercel how to build and deploy your application:
- `builds`: Defines how to build your application
- `routes`: Defines URL routing

### API Routes
Serverless functions in the `api/` directory are automatically deployed as serverless functions:
- `api/weather.js` becomes `/api/weather`

### Static Files
Files in the `public/` directory are served as static assets.

## Environment Variables

To set environment variables in Vercel:
1. Go to your project dashboard
2. Click "Settings"
3. Click "Environment Variables"
4. Add your variables:
   - `WEATHER_API_KEY` - Your OpenWeatherMap API key

## Notes

1. **File-based Storage**: This version uses file-based JSON storage instead of MongoDB for Vercel compatibility.

2. **Free Tier**: Vercel's free tier includes:
   - Unlimited deployments
   - Automatic HTTPS
   - Custom domains
   - Serverless functions

3. **Cold Starts**: Serverless functions may have slight delays on first request (cold starts).

## Troubleshooting

### Common Issues:

1. **Build Failures**: 
   - Check that all dependencies are in `package.json`
   - Ensure `vercel.json` is correctly configured

2. **API Route Issues**:
   - Verify serverless functions export a default handler
   - Check file permissions

3. **Static File Issues**:
   - Ensure files are in the `public/` directory
   - Check file paths in your HTML/CSS

### Support
For more information, visit:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)