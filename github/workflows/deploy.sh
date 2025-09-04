#!/bin/bash

# EmTech Logistics Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="emtech-logistics"
DOCKER_COMPOSE_FILE="docker-compose.yml"
BACKUP_DIR="/opt/backups/emtech"
LOG_FILE="/var/log/emtech-deploy.log"

# Functions
log() {
    echo "$(date): $1" >> $LOG_FILE
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo "$(date): WARNING: $1" >> $LOG_FILE
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo "$(date): ERROR: $1" >> $LOG_FILE
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Pre-deployment checks
pre_deploy_checks() {
    log "Running pre-deployment checks..."
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        error "Docker is not running"
    fi
    
    # Check if Docker Compose is available
    if ! command -v docker-compose >/dev/null 2>&1; then
        error "Docker Compose is not installed"
    fi
    
    # Check if required files exist
    if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
        error "Docker Compose file not found: $DOCKER_COMPOSE_FILE"
    fi
    
    # Check disk space
    AVAILABLE_SPACE=$(df /opt | awk 'NR==2{print $4}')
    if [ "$AVAILABLE_SPACE" -lt 1048576 ]; then # Less than 1GB
        warn "Low disk space available: $(($AVAILABLE_SPACE/1024)) MB"
    fi
    
    log "Pre-deployment checks completed successfully"
}

# Backup database
backup_database() {
    log "Creating database backup..."
    
    mkdir -p $BACKUP_DIR
    
    BACKUP_FILE="$BACKUP_DIR/emtech_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    docker-compose exec -T postgres pg_dump -U emtech -d emtech_logistics > $BACKUP_FILE
    
    if [ $? -eq 0 ]; then
        log "Database backup created: $BACKUP_FILE"
        gzip $BACKUP_FILE
        log "Backup compressed: $BACKUP_FILE.gz"
    else
        error "Failed to create database backup"
    fi
    
    # Keep only last 7 backups
    ls -t $BACKUP_DIR/emtech_backup_*.sql.gz | tail -n +8 | xargs rm -f
}

# Deploy application
deploy_application() {
    log "Deploying EmTech Logistics application..."
    
    # Pull latest images
    log "Pulling latest Docker images..."
    docker-compose pull
    
    # Stop services gracefully
    log "Stopping services..."
    docker-compose stop backend
    
    # Update backend service
    log "Starting updated backend service..."
    docker-compose up -d backend
    
    # Wait for backend to be healthy
    log "Waiting for backend to be healthy..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:8080/api/actuator/health >/dev/null 2>&1; then
            log "Backend is healthy"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            error "Backend failed to become healthy after $max_attempts attempts"
        fi
        
        log "Attempt $attempt/$max_attempts: Backend not ready yet, waiting..."
        sleep 10
        ((attempt++))
    done
    
    # Update other services
    log "Updating other services..."
    docker-compose up -d nginx redis prometheus grafana
    
    log "Deployment completed successfully"
}

# Post-deployment checks
post_deploy_checks() {
    log "Running post-deployment checks..."
    
    # Check if all services are running
    local services=("postgres" "redis" "backend" "nginx")
    
    for service in "${services[@]}"; do
        if docker-compose ps $service | grep -q "Up"; then
            log "$service is running"
        else
            error "$service is not running"
        fi
    done
    
    # Test API endpoint
    if curl -f http://localhost:8080/api/actuator/health >/dev/null 2>&1; then
        log "API health check passed"
    else
        error "API health check failed"
    fi
    
    # Test frontend
    if curl -f http://localhost:80 >/dev/null 2>&1; then
        log "Frontend accessibility check passed"
    else
        warn "Frontend accessibility check failed"
    fi
    
    log "Post-deployment checks completed"
}

# Rollback function
rollback() {
    log "Rolling back deployment..."
    
    # Restore from backup if needed
    local latest_backup=$(ls -t $BACKUP_DIR/emtech_backup_*.sql.gz | head -n1)
    
    if [ -n "$latest_backup" ]; then
        log "Latest backup found: $latest_backup"
        read -p "Do you want to restore from backup? (y/N): " -n 1 -r
        echo
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log "Restoring database from backup..."
            gunzip -c $latest_backup | docker-compose exec -T postgres psql -U emtech -d emtech_logistics
            log "Database restored from backup"
        fi
    fi
    
    # Restart services
    docker-compose restart
    
    log "Rollback completed"
}

# Cleanup function
cleanup() {
    log "Cleaning up unused Docker resources..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    # Remove unused networks
    docker network prune -f
    
    log "Cleanup completed"
}

# Main deployment process
main() {
    log "Starting EmTech Logistics deployment process..."
    
    case "${1:-deploy}" in
        "deploy")
            pre_deploy_checks
            backup_database
            deploy_application
            post_deploy_checks
            cleanup
            log "Deployment process completed successfully"
            ;;
        "rollback")
            rollback
            ;;
        "backup")
            backup_database
            ;;
        "cleanup")
            cleanup
            ;;
        "health")
            post_deploy_checks
            ;;
        *)
            echo "Usage: $0 {deploy|rollback|backup|cleanup|health}"
            echo "  deploy   - Full deployment process (default)"
            echo "  rollback - Rollback to previous version"
            echo "  backup   - Create database backup only"
            echo "  cleanup  - Clean up unused Docker resources"
            echo "  health   - Run health checks"
            exit 1
            ;;
    esac
}

# Trap for cleanup on script exit
trap 'echo "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@"