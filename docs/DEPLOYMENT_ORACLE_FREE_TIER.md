# Deployment Guide — Oracle Cloud Always Free (Ubuntu ARM)

## Prerequisites

- Oracle Cloud account (free tier)
- Ubuntu 22.04 ARM (Ampere A1) instance
- Minimum 1 OCPU, 6 GB RAM (free tier provides 4 OCPU / 24 GB total)
- SSH access to the instance

---

## Step 1: Connect and Update

```bash
ssh ubuntu@YOUR_INSTANCE_IP
sudo apt update && sudo apt upgrade -y
```

---

## Step 2: Install Node.js 20

```bash
# Using NodeSource installer
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version   # Should be v20.x.x
npm --version
```

---

## Step 3: Install Git and Other Tools

```bash
sudo apt install -y git curl nginx ufw
```

---

## Step 4: Clone and Set Up the App

```bash
# Create app directory
sudo mkdir -p /var/www/presentation-creator
sudo chown ubuntu:ubuntu /var/www/presentation-creator

# Clone your repository
git clone https://github.com/YOUR_USERNAME/presentation-creator-agent.git /var/www/presentation-creator
cd /var/www/presentation-creator

# Install dependencies
npm install

# Create .env.local (copy from example and edit)
cp .env.example .env.local
nano .env.local   # Set NEXT_PUBLIC_APP_NAME if desired

# Build for production
npm run build

# Ensure presentations directory exists
mkdir -p presentations
```

---

## Step 5: Install PM2 (Process Manager)

```bash
sudo npm install -g pm2

# Start the app with PM2
pm2 start npm --name "presentation-creator" -- start

# Save PM2 process list (auto-restart on reboot)
pm2 save

# Enable PM2 on startup
pm2 startup
# Run the command PM2 outputs (sudo env PATH=...)
```

### PM2 Useful Commands

```bash
pm2 status                    # Check app status
pm2 logs presentation-creator # View logs
pm2 restart presentation-creator
pm2 stop presentation-creator
```

---

## Step 6: Configure Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/presentation-creator
```

Paste this config:

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # Max upload size for large lesson text
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/presentation-creator /etc/nginx/sites-enabled/
sudo nginx -t           # Test config
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## Step 7: Configure Firewall

```bash
# Allow SSH (important — do this first)
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

Also open ports 80 and 443 in the Oracle Cloud Console:
- Go to: Networking > Virtual Cloud Networks > Your VCN > Security Lists
- Add ingress rules for ports 80 and 443 from 0.0.0.0/0

---

## Step 8: Set Up HTTPS with Certbot (Optional but Recommended)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d YOUR_DOMAIN
# Follow prompts — certbot will auto-update your Nginx config
```

---

## Environment Variables

Create `/var/www/presentation-creator/.env.local`:

```bash
# App name shown in browser
NEXT_PUBLIC_APP_NAME=Presentation Creator

# AI provider (optional — app works without it)
AI_PROVIDER=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

After changing `.env.local`:
```bash
npm run build
pm2 restart presentation-creator
```

---

## Update Workflow

```bash
cd /var/www/presentation-creator

# Pull latest changes
git pull

# Install any new dependencies
npm install

# Rebuild
npm run build

# Restart app
pm2 restart presentation-creator
```

---

## Data Persistence

Presentations are stored in `/var/www/presentation-creator/presentations/`. This directory is NOT tracked by git (see `.gitignore`). Back it up separately:

```bash
# Example backup to home directory
cp -r presentations ~/presentations-backup-$(date +%Y%m%d)
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| App not starting | Check `pm2 logs presentation-creator` |
| Port 3000 blocked | Ensure Nginx is running: `sudo systemctl status nginx` |
| Build fails | Check Node version: `node --version` (must be 20+) |
| 502 Bad Gateway | App may not be running: `pm2 status` |
| Presentations not saving | Check write permissions on `presentations/` dir |

```bash
# Fix permissions if needed
sudo chown -R ubuntu:ubuntu /var/www/presentation-creator/presentations
```
