#!/bin/bash

# PeakeCorp Enterprise Platform - Raspberry Pi Setup Script
# Run this script on your Raspberry Pi to set up the development environment

echo "🍓 Setting up PeakeCorp Enterprise Platform on Raspberry Pi..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+ (required for Next.js 14)
echo "🔧 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"

# Install Git if not already installed
echo "📋 Installing Git..."
sudo apt install -y git

# Install PM2 for process management
echo "⚡ Installing PM2 for production deployment..."
sudo npm install -g pm2

# Install development tools
echo "🛠️ Installing development tools..."
sudo apt install -y build-essential python3-dev

# Create project directory
echo "📁 Creating project directory..."
mkdir -p ~/peakecorp-enterprise
cd ~/peakecorp-enterprise

# Set up environment
echo "🌍 Creating environment file..."
cat > .env.local << EOL
# PeakeCorp Enterprise Configuration
NEXT_PUBLIC_HIVE_RPC_ENDPOINT=https://api.hive.blog
NEXT_PUBLIC_HIVE_ENGINE_RPC=https://api.hive-engine.com/rpc
NEXT_PUBLIC_PEAKECOIN_SYMBOL=PEAKE
NEXT_PUBLIC_APP_NAME=PeakeCorp Enterprise
NEXT_PUBLIC_CORPORATE_MODE=true
NEXT_PUBLIC_ENVIRONMENT=development

# Corporate Settings
PEAKECORP_ADMIN_KEY=your_admin_key_here
PEAKECORP_CORPORATE_ACCOUNT=your_corporate_hive_account
PEAKECORP_COMPLIANCE_LEVEL=enterprise

# Security Settings
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here
EOL

echo "🔐 Environment file created at .env.local"

# Create PM2 ecosystem file for production
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: 'peakecorp-enterprise',
    script: 'npm',
    args: 'start',
    cwd: '/home/pi/peakecorp-enterprise',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 3000
    }
  }]
};
EOL

echo "⚙️ PM2 ecosystem configuration created"

# Install nginx for reverse proxy (optional)
echo "🌐 Installing Nginx (optional reverse proxy)..."
sudo apt install -y nginx

# Create nginx configuration
sudo tee /etc/nginx/sites-available/peakecorp << EOL
server {
    listen 80;
    server_name peakecorp.local *.local;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Enable nginx site
sudo ln -sf /etc/nginx/sites-available/peakecorp /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Raspberry Pi setup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Clone your GitHub repository:"
echo "   git clone https://github.com/YOUR_USERNAME/peakecorp-enterprise.git ."
echo ""
echo "2. Install dependencies:"
echo "   npm install"
echo ""
echo "3. Run development server:"
echo "   npm run dev"
echo ""
echo "4. Or start with PM2 for production:"
echo "   npm run build"
echo "   pm2 start ecosystem.config.js"
echo ""
echo "🌐 Access your app at:"
echo "   - Local: http://localhost:3000"
echo "   - Network: http://$(hostname -I | cut -d' ' -f1):3000"
echo "   - With Nginx: http://peakecorp.local"
EOL
