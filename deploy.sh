#!/bin/bash

# MonkMedia NRCS Deployment Script
# This script deploys the MonkMedia NRCS application using Docker Compose

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "All prerequisites are met!"
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p uploads
    mkdir -p logs
    mkdir -p ssl
    
    print_success "Directories created successfully!"
}

# Function to setup environment
setup_environment() {
    print_status "Setting up environment..."
    
    if [ ! -f .env ]; then
        if [ -f .env.production ]; then
            cp .env.production .env
            print_success "Environment file created from production template"
        else
            print_warning "No environment file found. Please create .env file manually."
            exit 1
        fi
    else
        print_success "Environment file already exists"
    fi
}

# Function to build the application
build_application() {
    print_status "Building the application..."
    
    # Build the Docker image
    docker build -t monkmedia-nrcs:latest .
    
    print_success "Application built successfully!"
}

# Function to start services
start_services() {
    print_status "Starting services..."
    
    # Start services with Docker Compose
    docker-compose up -d
    
    print_success "Services started successfully!"
}

# Function to wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for MongoDB
    print_status "Waiting for MongoDB..."
    until docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
        sleep 2
    done
    print_success "MongoDB is ready!"
    
    # Wait for Redis
    print_status "Waiting for Redis..."
    until docker-compose exec redis redis-cli ping >/dev/null 2>&1; do
        sleep 2
    done
    print_success "Redis is ready!"
    
    # Wait for Application
    print_status "Waiting for Application..."
    until curl -f http://localhost:5000/api/health >/dev/null 2>&1; do
        sleep 2
    done
    print_success "Application is ready!"
}

# Function to show deployment status
show_status() {
    print_status "Deployment Status:"
    echo ""
    
    # Show running containers
    docker-compose ps
    
    echo ""
    print_status "Application URLs:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:5000"
    echo "  Health Check: http://localhost:5000/api/health"
    
    echo ""
    print_status "To view logs:"
    echo "  docker-compose logs -f"
    
    echo ""
    print_status "To stop services:"
    echo "  docker-compose down"
}

# Function to create admin user
create_admin_user() {
    print_status "Creating admin user..."
    
    # Wait a bit for the application to be fully ready
    sleep 10
    
    # Create admin user via API
    curl -X POST http://localhost:5000/api/auth/register \
        -H "Content-Type: application/json" \
        -d '{
            "firstName": "Admin",
            "lastName": "User",
            "email": "admin@monkmedia.com",
            "password": "admin123",
            "department": "admin",
            "role": "admin"
        }' >/dev/null 2>&1 || true
    
    print_success "Admin user created (email: admin@monkmedia.com, password: admin123)"
}

# Main deployment function
deploy() {
    print_status "Starting MonkMedia NRCS deployment..."
    echo ""
    
    check_prerequisites
    create_directories
    setup_environment
    build_application
    start_services
    wait_for_services
    create_admin_user
    show_status
    
    echo ""
    print_success "MonkMedia NRCS deployed successfully!"
    print_status "You can now access the application at http://localhost:3000"
}

# Function to stop services
stop() {
    print_status "Stopping services..."
    docker-compose down
    print_success "Services stopped successfully!"
}

# Function to restart services
restart() {
    print_status "Restarting services..."
    docker-compose restart
    print_success "Services restarted successfully!"
}

# Function to show logs
logs() {
    docker-compose logs -f
}

# Function to update application
update() {
    print_status "Updating application..."
    docker-compose down
    docker-compose pull
    docker-compose up -d
    print_success "Application updated successfully!"
}

# Function to show help
show_help() {
    echo "MonkMedia NRCS Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy    Deploy the application (default)"
    echo "  stop      Stop all services"
    echo "  restart   Restart all services"
    echo "  logs      Show application logs"
    echo "  update    Update the application"
    echo "  status    Show deployment status"
    echo "  help      Show this help message"
    echo ""
}

# Main script logic
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs
        ;;
    update)
        update
        ;;
    status)
        show_status
        ;;
    help)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac