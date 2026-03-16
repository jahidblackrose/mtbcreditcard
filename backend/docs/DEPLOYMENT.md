# Deployment Guide

## Prerequisites

- Oracle Database (XE or Enterprise)
- Redis server
- Python 3.11+
- Docker (optional but recommended)

## Environment Configuration

Create `.env` file with production settings:

```bash
# Application
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO

# Database
DB_HOST=oracle-prod.example.com
DB_PORT=1521
DB_SERVICE_NAME=PROD
DB_USER=mtb_credit
DB_PASSWORD=secure_password

# Redis
REDIS_HOST=redis-prod.example.com
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

# JWT (CHANGE IN PRODUCTION!)
JWT_SECRET_KEY=your-super-secret-key-min-32-chars
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
FRONTEND_URL=https://mtb.com.bd
ALLOWED_ORIGINS=https://mtb.com.bd,https://www.mtb.com.bd

# Rate Limiting
OTP_RATE_LIMIT_PER_HOUR=5
DRAFT_RATE_LIMIT_PER_MINUTE=10
GENERAL_RATE_LIMIT_PER_MINUTE=100
```

## Docker Deployment

### Build Image

```bash
docker build -t mtb-credit-card-api:1.0.0 .
```

### Run Container

```bash
docker run -d \
  --name mtb-api \
  -p 8000:8000 \
  --env-file .env \
  --restart unless-stopped \
  mtb-credit-card-api:1.0.0
```

### Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Restart
docker-compose restart api
```

## Manual Deployment

### System Setup

```bash
# Install Python 3.11
apt install python3.11 python3.11-venv

# Create virtual environment
python3.11 -m venv /opt/mtb-api/venv

# Activate
source /opt/mtb-api/venv/bin/activate

# Install dependencies
pip install -e .
```

### Oracle Instant Client

```bash
# Download from Oracle website
wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basic-linux.x64-21.1.0.0.0.zip

# Extract
unzip instantclient-basic-linux.x64-21.1.0.0.0.zip -d /opt/oracle

# Set library path
export LD_LIBRARY_PATH=/opt/oracle/instantclient_21_1:$LD_LIBRARY_PATH

# Add to /etc/environment or systemd service
```

### Create Systemd Service

```bash
# /etc/systemd/system/mtb-api.service
[Unit]
Description=MTB Credit Card API
After=network.target oracle.service redis.service

[Service]
Type=notify
User=mtbapi
Group=mtbapi
WorkingDirectory=/opt/mtb-api
Environment="PATH=/opt/mtb-api/venv/bin"
EnvironmentFile=/opt/mtb-api/.env
ExecStart=/opt/mtb-api/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
systemctl enable mtb-api
systemctl start mtb-api
systemctl status mtb-api
```

## Nginx Configuration

```nginx
# /etc/nginx/sites-available/mtb-api
server {
    listen 443 ssl http2;
    server_name api.mtb.com.bd;

    ssl_certificate /etc/ssl/certs/mtb-api.crt;
    ssl_certificate_key /etc/ssl/private/mtb-api.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # API endpoints
    location /api/v1/ {
        proxy_pass http://127.0.0.1:8000/api/v1/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # CORS headers
        add_header Access-Control-Allow-Origin https://mtb.com.bd always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
        add_header Access-Control-Allow-Credentials true always;

        if ($request_method = OPTIONS) {
            return 204;
        }
    }

    # Health check
    location /health {
        proxy_pass http://127.0.0.1:8000/health;
        access_log off;
    }
}
```

## Redis Setup

### Local Redis

```bash
# Install
apt install redis-server

# Configure /etc/redis/redis.conf
requirepass your_redis_password
maxmemory 256mb
maxmemory-policy allkeys-lru

# Start
systemctl start redis-server
```

### Redis Cluster

```bash
# Using Docker
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7-alpine \
  redis-server --requirepass password --appendonly yes
```

## Database Setup

### Create Database User

```sql
-- As SYSDBA
CREATE USER mtb_credit IDENTIFIED BY secure_password;
GRANT CONNECT, RESOURCE TO mtb_credit;
GRANT CREATE VIEW, CREATE PROCEDURE TO mtb_credit;
ALTER USER mtb_credit DEFAULT TABLESPACE users QUOTA UNLIMITED ON users;

-- Grant access to reference tables
GRANT SELECT ON TCC_REF_CARD_PRODUCTS TO mtb_credit;
GRANT SELECT ON TCC_REF_BANKS TO mtb_credit;
-- etc...
```

### Run Package Script

```bash
# Execute package script
sqlplus mtb_credit/password@PROD @database/packages/pkg_credit_card_application_body.sql
```

## Health Checks

### API Health

```bash
curl http://localhost:8000/health
```

### Database Health

```bash
sqlplus mtb_credit/password@PROD << EOF
SELECT 1 FROM DUAL;
EXIT;
EOF
```

### Redis Health

```bash
redis-cli -a password ping
# Should return PONG
```

## Monitoring

### Application Logs

```bash
# Docker
docker-compose logs -f api

# Systemd
journalctl -u mtb-api -f

# Log file
tail -f /opt/mtb-api/logs/app.log
```

### Performance Monitoring

```bash
# API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8000/health

# Database connections
sqlplus mtb_credit/password@PROD << EOF
SELECT COUNT(*) FROM v$session WHERE username = 'MTB_CREDIT';
EOF
```

## Backup & Recovery

### Database Backup

```bash
# Using expdp
expdp mtb_credit/password@PROD DIRECTORY=DATA_PUMP_DIR DUMPFILE=mtb_credit_$(date +%Y%m%d).dmp LOGFILE=mtb_credit_$(date +%Y%m%d).log
```

### Redis Backup

```bash
# Save snapshot
redis-cli -a password BGSAVE

# Copy RDB file
cp /var/lib/redis/dump.rdb /backup/redis_$(date +%Y%m%d).rdb
```

### Application Backup

```bash
# Backup code and config
tar -czf mtb-api_$(date +%Y%m%d).tar.gz /opt/mtb-api
```

## Scaling

### Horizontal Scaling

```bash
# Run multiple instances
docker run -d --name mtb-api-1 -p 8001:8000 mtb-credit-card-api
docker run -d --name mtb-api-2 -p 8002:8000 mtb-credit-card-api
docker run -d --name mtb-api-3 -p 8003:8000 mtb-credit-card-api
```

### Load Balancer (Nginx)

```nginx
upstream mtb_api_cluster {
    least_conn;
    server 127.0.0.1:8001;
    server 127.0.0.1:8002;
    server 127.0.0.1:8003;
}

server {
    location /api/v1/ {
        proxy_pass http://mtb_api_cluster;
    }
}
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable SSL/TLS
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Configure CORS correctly
- [ ] Use strong JWT secret key
- [ ] Enable database audit logging
- [ ] Set up log monitoring
- [ ] Regular security updates
