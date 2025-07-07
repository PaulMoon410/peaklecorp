#!/bin/bash

# PeakeCorp Deployment Script
echo "🚀 Deploying PeakeCorp to GitHub..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git branch -M main
fi

# Add all files
echo "📝 Adding files to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
read -p "Enter commit message (default: 'Initial PeakeCorp deployment'): " commit_message
commit_message=${commit_message:-"Initial PeakeCorp deployment"}
git commit -m "$commit_message"

# Add remote if not exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Adding GitHub remote..."
    read -p "Enter your GitHub repository URL (e.g., https://github.com/username/peakecorp-platform.git): " repo_url
    git remote add origin "$repo_url"
fi

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push -u origin main

echo "✅ PeakeCorp has been deployed to GitHub!"
echo ""
echo "🌐 Next steps:"
echo "1. Go to https://vercel.com and sign in with GitHub"
echo "2. Click 'Import Project' and select your PeakeCorp repository"
echo "3. Add your environment variables in Vercel dashboard"
echo "4. Deploy and get your live URL!"
echo ""
echo "📚 Or check DEPLOY.md for more deployment options"
