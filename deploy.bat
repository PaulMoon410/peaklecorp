@echo off
REM PeakeCorp Deployment Script for Windows

echo 🚀 Deploying PeakeCorp to GitHub...

REM Check if git is initialized
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
    git branch -M main
)

REM Add all files
echo 📝 Adding files to Git...
git add .

REM Commit changes
echo 💾 Committing changes...
set /p commit_message="Enter commit message (default: 'Initial PeakeCorp deployment'): "
if "%commit_message%"=="" set commit_message=Initial PeakeCorp deployment
git commit -m "%commit_message%"

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo 🔗 Adding GitHub remote...
    set /p repo_url="Enter your GitHub repository URL (e.g., https://github.com/username/peakecorp-platform.git): "
    git remote add origin "%repo_url%"
)

REM Push to GitHub
echo ⬆️ Pushing to GitHub...
git push -u origin main

echo ✅ PeakeCorp has been deployed to GitHub!
echo.
echo 🌐 Next steps:
echo 1. Go to https://vercel.com and sign in with GitHub
echo 2. Click 'Import Project' and select your PeakeCorp repository
echo 3. Add your environment variables in Vercel dashboard
echo 4. Deploy and get your live URL!
echo.
echo 📚 Or check DEPLOY.md for more deployment options

pause
