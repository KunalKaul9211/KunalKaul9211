# MonkMedia NRCS Deployment Guide

This guide covers multiple deployment options for the MonkMedia NRCS enterprise newsroom control system.

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended for Development)

1. **Prerequisites**
   ```bash
   # Install Docker and Docker Compose
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Deploy**
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd monkmedia-nrcs
   
   # Deploy with one command
   ./deploy.sh
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin User: admin@monkmedia.com / admin123

### Option 2: Kubernetes

1. **Prerequisites**
   ```bash
   # Install kubectl
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   
   # Install Docker (for building images)
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

2. **Deploy**
   ```bash
   # Deploy to Kubernetes
   ./k8s/deploy-k8s.sh
   ```

3. **Access the Application**
   ```bash
   # Port forward to access locally
   kubectl port-forward service/monkmedia-app 5000:5000 -n monkmedia-nrcs
   ```

## ☁️ Cloud Deployment

### AWS ECS

1. **Prerequisites**
   - AWS CLI configured
   - Docker image pushed to ECR

2. **Deploy**
   ```bash
   # Deploy using CloudFormation
   aws cloudformation create-stack \
     --stack-name monkmedia-nrcs \
     --template-body file://cloud-deploy/aws-ecs.yaml \
     --capabilities CAPABILITY_IAM
   ```

### Azure Container Instances

1. **Prerequisites**
   - Azure CLI installed and logged in

2. **Deploy**
   ```bash
   # Deploy using Azure CLI
   az container create \
     --resource-group myResourceGroup \
     --name monkmedia-nrcs \
     --image monkmedia-nrcs:latest \
     --dns-name-label monkmedia-nrcs \
     --ports 5000
   ```

### Google Cloud Run

1. **Prerequisites**
   - Google Cloud SDK installed
   - Project configured

2. **Deploy**
   ```bash
   # Build and deploy
   gcloud builds submit --tag gcr.io/PROJECT_ID/monkmedia-nrcs
   gcloud run deploy --image gcr.io/PROJECT_ID/monkmedia-nrcs --platform managed
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://username:password@host:port/database
DB_NAME=monkmedia_nrcs

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Client Configuration
CLIENT_URL=https://your-domain.com
SOCKET_URL=https://your-domain.com

# Redis Configuration
REDIS_URL=redis://host:port

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### Database Setup

The application automatically creates the necessary database collections and indexes on first run. For production, consider:

1. **MongoDB Atlas** (Recommended)
   - Managed MongoDB service
   - Automatic backups and scaling
   - Security and monitoring

2. **Self-hosted MongoDB**
   - Use the provided Docker Compose setup
   - Configure replica sets for production
   - Set up regular backups

### Redis Setup

For production, consider:

1. **Redis Cloud** (Recommended)
   - Managed Redis service
   - Automatic failover and scaling

2. **Self-hosted Redis**
   - Use the provided Docker Compose setup
   - Configure persistence and clustering

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Enable database encryption
- [ ] Configure backup strategies
- [ ] Set up intrusion detection
- [ ] Regular security updates

### SSL/TLS Configuration

1. **Obtain SSL Certificate**
   ```bash
   # Using Let's Encrypt
   certbot certonly --standalone -d your-domain.com
   ```

2. **Configure Nginx**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name your-domain.com;
       
       ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
       
       # SSL configuration
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
       ssl_prefer_server_ciphers off;
   }
   ```

## 📊 Monitoring and Logging

### Application Monitoring

1. **Health Checks**
   - Endpoint: `/api/health`
   - Returns system status and metrics

2. **Logging**
   - Application logs: `/app/logs/app.log`
   - Access logs: Nginx access logs
   - Error logs: Nginx error logs

3. **Metrics**
   - CPU and memory usage
   - Database connection pool
   - Request/response times
   - Error rates

### Recommended Monitoring Tools

- **Prometheus + Grafana**: Metrics and dashboards
- **ELK Stack**: Log aggregation and analysis
- **New Relic**: Application performance monitoring
- **DataDog**: Full-stack monitoring

## 🔄 CI/CD Pipeline

The repository includes GitHub Actions workflow for automated deployment:

1. **Test**: Run unit and integration tests
2. **Build**: Build Docker image
3. **Deploy**: Deploy to staging/production

### Customizing CI/CD

1. **Update Secrets**
   - Add your Docker registry credentials
   - Configure cloud provider credentials
   - Set up notification webhooks

2. **Modify Workflow**
   - Edit `.github/workflows/deploy.yml`
   - Add additional test stages
   - Configure deployment environments

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check MongoDB connection
   docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
   ```

2. **Redis Connection Issues**
   ```bash
   # Check Redis connection
   docker-compose exec redis redis-cli ping
   ```

3. **Application Not Starting**
   ```bash
   # Check application logs
   docker-compose logs -f app
   ```

4. **Port Conflicts**
   ```bash
   # Check port usage
   netstat -tulpn | grep :5000
   ```

### Performance Optimization

1. **Database Optimization**
   - Add appropriate indexes
   - Configure connection pooling
   - Enable query optimization

2. **Application Optimization**
   - Enable gzip compression
   - Configure caching
   - Optimize static assets

3. **Infrastructure Optimization**
   - Use CDN for static assets
   - Configure load balancing
   - Scale horizontally

## 📞 Support

For deployment support:

1. **Check Logs**: Review application and system logs
2. **Documentation**: Refer to this guide and README
3. **Issues**: Create GitHub issues for bugs
4. **Community**: Join our community forum

## 🔄 Updates and Maintenance

### Updating the Application

1. **Docker Compose**
   ```bash
   ./deploy.sh update
   ```

2. **Kubernetes**
   ```bash
   kubectl set image deployment/monkmedia-app monkmedia-app=monkmedia-nrcs:latest -n monkmedia-nrcs
   ```

3. **Cloud Deployments**
   - Update container images
   - Redeploy using cloud provider tools

### Backup Strategy

1. **Database Backups**
   ```bash
   # MongoDB backup
   mongodump --uri="mongodb://username:password@host:port/database" --out=/backup/$(date +%Y%m%d)
   ```

2. **File Backups**
   ```bash
   # Backup uploads directory
   tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/
   ```

3. **Configuration Backups**
   ```bash
   # Backup configuration files
   tar -czf config-backup-$(date +%Y%m%d).tar.gz .env nginx.conf
   ```

---

**MonkMedia NRCS** - Professional Enterprise Newsroom Control System