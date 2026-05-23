#!/usr/bin/env bash
# =============================================================================
# Presentation Creator Agent — Oracle Free-Tier Setup Script
# =============================================================================
# Run this once on a fresh Ubuntu server to install Node.js, PM2, and the app.
#
# Usage:
#   chmod +x scripts/setup.sh
#   ./scripts/setup.sh
#
# IMPORTANT: This script is for reference only. Review each step before running
# on your server. Do not run on a machine with other important workloads unless
# you understand what each step does.
# =============================================================================

set -euo pipefail

APP_DIR="/opt/presentation-creator-agent"
NODE_VERSION="20"
PM2_APP_NAME="presentation-creator-agent"
PORT=3000

echo "=== Presentation Creator Agent — Server Setup ==="
echo "Target directory: $APP_DIR"
echo ""

# -----------------------------------------------------------------------
# 1. System updates
# -----------------------------------------------------------------------
echo "[1/8] Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# -----------------------------------------------------------------------
# 2. Install Node.js via NodeSource
# -----------------------------------------------------------------------
echo "[2/8] Installing Node.js $NODE_VERSION..."
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
node --version
npm --version

# -----------------------------------------------------------------------
# 3. Install PM2 globally
# -----------------------------------------------------------------------
echo "[3/8] Installing PM2..."
if ! command -v pm2 &>/dev/null; then
  sudo npm install -g pm2
fi
pm2 --version

# -----------------------------------------------------------------------
# 4. Install Nginx (optional — for reverse proxy)
# -----------------------------------------------------------------------
echo "[4/8] Installing Nginx..."
if ! command -v nginx &>/dev/null; then
  sudo apt-get install -y nginx
fi

# -----------------------------------------------------------------------
# 5. Clone or update the repository
# -----------------------------------------------------------------------
echo "[5/8] Setting up application..."
if [ -d "$APP_DIR" ]; then
  echo "  Directory exists. Pulling latest..."
  cd "$APP_DIR"
  git pull
else
  echo "  Cloning repository..."
  sudo git clone https://github.com/boco-cyber/presentation-creator-agent.git "$APP_DIR"
  cd "$APP_DIR"
fi

# Set permissions
sudo chown -R "$USER":"$USER" "$APP_DIR"

# -----------------------------------------------------------------------
# 6. Install dependencies and build
# -----------------------------------------------------------------------
echo "[6/8] Installing dependencies and building..."
npm install
npm run build

# Create presentations storage directory
mkdir -p presentations

# Create data directory for settings
mkdir -p data

# Copy .env.example to .env if not present
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo ""
  echo "  *** Created .env from .env.example ***"
  echo "  Edit .env to configure your AI provider:"
  echo "    nano .env"
  echo ""
fi

# -----------------------------------------------------------------------
# 7. Start with PM2
# -----------------------------------------------------------------------
echo "[7/8] Starting app with PM2..."
pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
pm2 start npm --name "$PM2_APP_NAME" -- start

# Configure PM2 to auto-start on reboot
pm2 save
sudo env PATH="$PATH:$(which node)" pm2 startup systemd -u "$USER" --hp "$HOME" | tail -1 | sudo bash || true

echo ""
echo "  App is running on port $PORT"
echo "  PM2 status: pm2 status"
echo "  PM2 logs:   pm2 logs $PM2_APP_NAME"

# -----------------------------------------------------------------------
# 8. Nginx reverse proxy config
# -----------------------------------------------------------------------
echo "[8/8] Writing Nginx configuration..."

DOMAIN_PLACEHOLDER="presentations.yourdomain.com"
NGINX_CONF="/etc/nginx/sites-available/$PM2_APP_NAME"

sudo tee "$NGINX_CONF" > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN_PLACEHOLDER;

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 120s;
    }
}
EOF

sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Edit /opt/presentation-creator-agent/.env — set AI_PROVIDER and model"
echo "  2. Update Nginx config with your real domain:"
echo "     sudo nano $NGINX_CONF"
echo "  3. Obtain HTTPS certificate:"
echo "     sudo apt install certbot python3-certbot-nginx -y"
echo "     sudo certbot --nginx -d your-domain.com"
echo "  4. Open firewall ports:"
echo "     sudo ufw allow 80/tcp"
echo "     sudo ufw allow 443/tcp"
echo "     sudo ufw allow 22/tcp"
echo "     sudo ufw enable"
echo ""
echo "  Optional — run Ollama on this server:"
echo "     curl -fsSL https://ollama.com/install.sh | sh"
echo "     ollama pull llama3.2"
echo "     # Then set AI_PROVIDER=ollama in .env and restart:"
echo "     pm2 restart $PM2_APP_NAME"
echo ""
echo "  App directory: $APP_DIR"
echo "  PM2 app name:  $PM2_APP_NAME"
echo "  Running on:    http://localhost:$PORT"
