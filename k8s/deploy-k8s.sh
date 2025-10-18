#!/bin/bash

# MonkMedia NRCS Kubernetes Deployment Script
# This script deploys the MonkMedia NRCS application to Kubernetes

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
    
    if ! command_exists kubectl; then
        print_error "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if kubectl can connect to cluster
    if ! kubectl cluster-info >/dev/null 2>&1; then
        print_error "Cannot connect to Kubernetes cluster. Please check your kubeconfig."
        exit 1
    fi
    
    print_success "All prerequisites are met!"
}

# Function to build and push Docker image
build_and_push_image() {
    print_status "Building and pushing Docker image..."
    
    # Build the image
    docker build -t monkmedia-nrcs:latest .
    
    # Tag for your registry (replace with your registry)
    # docker tag monkmedia-nrcs:latest your-registry.com/monkmedia-nrcs:latest
    # docker push your-registry.com/monkmedia-nrcs:latest
    
    print_success "Docker image built successfully!"
}

# Function to create namespace
create_namespace() {
    print_status "Creating namespace..."
    kubectl apply -f k8s/namespace.yaml
    print_success "Namespace created successfully!"
}

# Function to create secrets
create_secrets() {
    print_status "Creating secrets..."
    kubectl apply -f k8s/secret.yaml
    print_success "Secrets created successfully!"
}

# Function to create configmaps
create_configmaps() {
    print_status "Creating configmaps..."
    kubectl apply -f k8s/configmap.yaml
    print_success "ConfigMaps created successfully!"
}

# Function to deploy MongoDB
deploy_mongodb() {
    print_status "Deploying MongoDB..."
    kubectl apply -f k8s/mongodb.yaml
    
    # Wait for MongoDB to be ready
    print_status "Waiting for MongoDB to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/monkmedia-mongodb -n monkmedia-nrcs
    print_success "MongoDB deployed successfully!"
}

# Function to deploy Redis
deploy_redis() {
    print_status "Deploying Redis..."
    kubectl apply -f k8s/redis.yaml
    
    # Wait for Redis to be ready
    print_status "Waiting for Redis to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/monkmedia-redis -n monkmedia-nrcs
    print_success "Redis deployed successfully!"
}

# Function to deploy application
deploy_app() {
    print_status "Deploying application..."
    kubectl apply -f k8s/app.yaml
    
    # Wait for application to be ready
    print_status "Waiting for application to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/monkmedia-app -n monkmedia-nrcs
    print_success "Application deployed successfully!"
}

# Function to create ingress
create_ingress() {
    print_status "Creating ingress..."
    kubectl apply -f k8s/ingress.yaml
    print_success "Ingress created successfully!"
}

# Function to show deployment status
show_status() {
    print_status "Deployment Status:"
    echo ""
    
    # Show pods
    kubectl get pods -n monkmedia-nrcs
    
    echo ""
    
    # Show services
    kubectl get services -n monkmedia-nrcs
    
    echo ""
    
    # Show ingress
    kubectl get ingress -n monkmedia-nrcs
    
    echo ""
    print_status "To view logs:"
    echo "  kubectl logs -f deployment/monkmedia-app -n monkmedia-nrcs"
    
    echo ""
    print_status "To port forward:"
    echo "  kubectl port-forward service/monkmedia-app 5000:5000 -n monkmedia-nrcs"
}

# Function to create admin user
create_admin_user() {
    print_status "Creating admin user..."
    
    # Port forward to access the application
    kubectl port-forward service/monkmedia-app 5000:5000 -n monkmedia-nrcs &
    PORT_FORWARD_PID=$!
    
    # Wait for port forward to be ready
    sleep 5
    
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
    
    # Kill port forward
    kill $PORT_FORWARD_PID 2>/dev/null || true
    
    print_success "Admin user created (email: admin@monkmedia.com, password: admin123)"
}

# Main deployment function
deploy() {
    print_status "Starting MonkMedia NRCS Kubernetes deployment..."
    echo ""
    
    check_prerequisites
    build_and_push_image
    create_namespace
    create_secrets
    create_configmaps
    deploy_mongodb
    deploy_redis
    deploy_app
    create_ingress
    create_admin_user
    show_status
    
    echo ""
    print_success "MonkMedia NRCS deployed to Kubernetes successfully!"
    print_status "You can access the application using port-forward or ingress"
}

# Function to delete deployment
delete() {
    print_status "Deleting MonkMedia NRCS deployment..."
    kubectl delete namespace monkmedia-nrcs
    print_success "Deployment deleted successfully!"
}

# Function to show help
show_help() {
    echo "MonkMedia NRCS Kubernetes Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy    Deploy the application to Kubernetes (default)"
    echo "  delete    Delete the deployment"
    echo "  status    Show deployment status"
    echo "  help      Show this help message"
    echo ""
}

# Main script logic
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    delete)
        delete
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