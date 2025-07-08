#!/bin/bash

# Deploy to Raspberry Pi script
# Run this from your development machine

PI_HOST="pi@YOUR_PI_IP_ADDRESS"
PI_PATH="/home/pi/peakecorp-enterprise"
LOCAL_PATH="."

echo "🚀 Deploying PeakeCorp Enterprise to Raspberry Pi..."

# Build locally first
echo "🔨 Building application..."
npm run build

# Sync files to Pi (excluding node_modules)
echo "📤 Syncing files to Raspberry Pi..."
rsync -av --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.next' \
  --exclude 'logs' \
  $LOCAL_PATH/ $PI_HOST:$PI_PATH/

# Run remote commands on Pi
echo "⚙️ Installing dependencies and starting application on Pi..."
ssh $PI_HOST << EOF
  cd $PI_PATH
  npm ci --only=production
  npm run build
  pm2 restart peakecorp-enterprise || pm2 start ecosystem.config.js
EOF

echo "✅ Deployment complete!"
echo "🌐 Access your application at: http://YOUR_PI_IP_ADDRESS:3000"
