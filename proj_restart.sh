#!/bin/bash

# aiBnb QR Code-Based Instructional System Restart Script
# This script manages the aiBnb application services (Frontend, Backend)

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
FORCE_KILL=false
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Function to show help
show_help() {
    cat << EOF
${GREEN}aiBnb QR Code-Based Instructional System Restart Script${NC}

${BLUE}USAGE:${NC}
    ./proj_restart.sh [OPTIONS]

${BLUE}DESCRIPTION:${NC}
    This script manages the aiBnb application services including:
    - Frontend (Next.js on port 3000)
    - Backend (Node.js/Express on port 8000)
    - Uses Supabase cloud database (no local DB needed)

${BLUE}OPTIONS:${NC}
    --force         Kill existing processes before starting new ones
    --help, -h      Show this help message

${BLUE}BEHAVIOR:${NC}
    ${GREEN}Default mode (no --force):${NC}
    - Checks if services are running
    - Starts only stopped services
    - Preserves existing running processes

    ${YELLOW}Force mode (--force):${NC}
    - Kills ALL related processes (node, npm)
    - Starts fresh instances of all services
    - Use with caution as it terminates all processes

    ${GREEN}Database:${NC}
    - Uses Supabase cloud database
    - No local database setup required
    - Automatically reads SUPABASE_URL from .env

${BLUE}SERVICES MANAGED:${NC}
    1. ${GREEN}Backend${NC}  - Node.js/Express API server (port 8000)
    2. ${GREEN}Frontend${NC} - Next.js development server (port 3000)
    3. ${GREEN}Database${NC} - Supabase cloud PostgreSQL

${BLUE}EXAMPLES:${NC}
    ./proj_restart.sh                    # Start stopped services only
    ./proj_restart.sh --force            # Kill all & restart everything  
    ./proj_restart.sh --help             # Show this help

${BLUE}REQUIREMENTS:${NC}
    - Node.js and npm installed
    - Valid Supabase configuration in .env file
    - Script must be run from project root directory

${BLUE}PORTS USED:${NC}
    - Frontend: http://localhost:3000
    - Backend:  http://localhost:8000
    - Database: Supabase cloud (no local ports)

${BLUE}PROJECT STRUCTURE:${NC}
    - Backend: ./server.js, ./app.js, ./controllers/, ./routes/
    - Frontend: ./frontend/ directory with Next.js app
    - Config: .env file in project root

EOF
}

# Function to check if a process is running on a port
is_port_in_use() {
    local port=$1
    lsof -i :$port > /dev/null 2>&1
    return $?
}

# Function to kill processes
kill_processes() {
    print_step "Killing existing processes..."
    
    # Kill node processes
    if pgrep -f node > /dev/null; then
        print_status "Killing node processes..."
        pkill -f node
        sleep 2
    fi
    
    # Kill npm processes
    if pgrep -f npm > /dev/null; then
        print_status "Killing npm processes..."
        pkill -f npm
        sleep 2
    fi
    
    print_status "Process cleanup completed."
}

# Function to check Supabase configuration
check_supabase_config() {
    if [[ -f "$ENV_FILE" ]]; then
        # Read Supabase configuration from .env file
        local supabase_url=$(grep "^SUPABASE_URL=" "$ENV_FILE" | cut -d'=' -f2 | tr -d "'" | tr -d '"')
        local supabase_key=$(grep "^SUPABASE_ANON_KEY=" "$ENV_FILE" | cut -d'=' -f2 | tr -d "'" | tr -d '"')
        
        if [[ -z "$supabase_url" || "$supabase_url" == "your-supabase-url-here" ]]; then
            print_warning "SUPABASE_URL not properly configured in .env file."
            print_warning "Please update .env with your Supabase project credentials."
            return 1
        fi
        
        if [[ -z "$supabase_key" || "$supabase_key" == "your-supabase-anon-key-here" ]]; then
            print_warning "SUPABASE_ANON_KEY not properly configured in .env file."
            print_warning "Please update .env with your Supabase project credentials."
            return 1
        fi
        
        # Extract project ID from URL for display
        local project_id=$(echo "$supabase_url" | sed -n 's/.*\/\/\([^.]*\)\.supabase\.co.*/\1/p')
        if [[ -n "$project_id" ]]; then
            print_status "Supabase project configured: $project_id"
        else
            print_status "Supabase configuration found: $supabase_url"
        fi
        
        return 0
    else
        print_error ".env file not found. Please create .env file with Supabase configuration."
        print_error "Required variables: SUPABASE_URL, SUPABASE_ANON_KEY"
        return 1
    fi
}

# Function to test Supabase connectivity
test_supabase_connectivity() {
    print_step "Testing Supabase connectivity..."
    
    # Check if curl is available
    if ! command -v curl &> /dev/null; then
        print_warning "curl not found. Cannot test Supabase connectivity."
        return 0
    fi
    
    local supabase_url=$(grep "^SUPABASE_URL=" "$ENV_FILE" | cut -d'=' -f2 | tr -d "'" | tr -d '"')
    local supabase_key=$(grep "^SUPABASE_ANON_KEY=" "$ENV_FILE" | cut -d'=' -f2 | tr -d "'" | tr -d '"')
    
    if [[ -n "$supabase_url" && -n "$supabase_key" ]]; then
        # Test basic connectivity to Supabase REST API
        local response=$(curl -s -o /dev/null -w "%{http_code}" \
            -H "apikey: $supabase_key" \
            -H "Authorization: Bearer $supabase_key" \
            "$supabase_url/rest/v1/" 2>/dev/null)
        
        if [[ "$response" == "200" ]]; then
            print_status "Supabase connectivity: ${GREEN}Connected${NC}"
    else
            print_warning "Supabase connectivity: ${YELLOW}Cannot verify (HTTP $response)${NC}"
        fi
    fi
}

# Function to start backend
start_backend() {
    if is_port_in_use 8000; then
        print_status "Backend is already running on port 8000."
        return 0
    fi
    
    print_step "Starting backend server..."
    cd "$SCRIPT_DIR"
    
    # Check if required files exist
    if [[ ! -f "server.js" ]]; then
        print_error "server.js not found. Make sure you're in the project root directory."
        return 1
    fi
    
    if [[ ! -f "package.json" ]]; then
        print_error "package.json not found. Make sure you're in the project root directory."
        return 1
    fi
    
    # Start backend in background with PORT=8000
    print_status "Starting backend with PORT=8000..."
    nohup env PORT=8000 node server.js > /tmp/aibnb-backend.log 2>&1 &
    sleep 5
    
    if is_port_in_use 8000; then
        print_status "Backend started successfully on port 8000."
        
        # Test health endpoint
        sleep 2
        local health_response=$(curl -s http://localhost:8000/health 2>/dev/null)
        if [[ $? -eq 0 ]]; then
            print_status "Backend health check: ${GREEN}OK${NC}"
        else
            print_warning "Backend health check: ${YELLOW}Cannot verify${NC}"
        fi
    else
        print_error "Failed to start backend. Check /tmp/aibnb-backend.log for details."
        return 1
    fi
}

# Function to start frontend
start_frontend() {
    if is_port_in_use 3000; then
        print_status "Frontend is already running on port 3000."
        return 0
    fi
    
    print_step "Starting frontend server..."
    cd "$SCRIPT_DIR"
    
    # Check if frontend directory exists
    if [[ ! -d "frontend" ]]; then
        print_error "frontend/ directory not found. Make sure you're in the project root directory."
        return 1
    fi
    
    # Check if frontend package.json exists
    if [[ ! -f "frontend/package.json" ]]; then
        print_error "frontend/package.json not found."
        return 1
    fi
    
    # Start frontend in background
    print_status "Starting Next.js development server..."
    nohup npm run dev --prefix frontend > /tmp/aibnb-frontend.log 2>&1 &
    sleep 8
    
    # Check if frontend started (it might be on 3000, 3001, or 3002 depending on availability)
    local frontend_port=""
    for port in 3000 3001 3002; do
        if is_port_in_use $port; then
            frontend_port=$port
            break
        fi
    done
    
    if [[ -n "$frontend_port" ]]; then
        print_status "Frontend started successfully on port $frontend_port."
        if [[ "$frontend_port" != "3000" ]]; then
            print_warning "Note: Frontend is on port $frontend_port (port 3000 was busy)."
        fi
    else
        print_error "Failed to start frontend. Check /tmp/aibnb-frontend.log for details."
        return 1
    fi
}

# Function to show status
show_status() {
    print_step "Service Status:"
    
    # Check Supabase status
    if check_supabase_config; then
        print_status "Database: ${GREEN}Supabase configured${NC}"
        test_supabase_connectivity
        else
        print_warning "Database: ${RED}Supabase not configured${NC}"
    fi
    
    # Check backend status
    if is_port_in_use 8000; then
        print_status "Backend:  ${GREEN}Running on port 8000${NC}"
    else
        print_warning "Backend:  ${RED}Not running${NC}"
    fi
    
    # Check frontend status
    local frontend_port=""
    for port in 3000 3001 3002; do
        if is_port_in_use $port; then
            frontend_port=$port
            break
        fi
    done
    
    if [[ -n "$frontend_port" ]]; then
        print_status "Frontend: ${GREEN}Running on port $frontend_port${NC}"
    else
        print_warning "Frontend: ${RED}Not running${NC}"
    fi
    
    echo ""
    print_status "Access your application:"
    if [[ -n "$frontend_port" ]]; then
        echo "  Frontend: http://localhost:$frontend_port"
    else
        echo "  Frontend: http://localhost:3000 (not running)"
    fi
    echo "  Backend:  http://localhost:8000"
    echo "  Health:   http://localhost:8000/health"
    echo "  API:      http://localhost:8000/api/properties"
    
    echo ""
    print_status "Logs available at:"
    echo "  Backend:  /tmp/aibnb-backend.log"
    echo "  Frontend: /tmp/aibnb-frontend.log"
    
        echo ""
    print_status "Project info:"
    echo "  Type:     QR Code-Based Instructional System"
    echo "  Stack:    Next.js + Node.js/Express + Supabase"
    echo "  Env file: $ENV_FILE"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --force)
            FORCE_KILL=true
            shift
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information."
            exit 1
            ;;
    esac
done

# Main execution
main() {
    echo -e "${GREEN}aiBnb QR Code-Based Instructional System Restart Script${NC}"
    echo "========================================================"
    
    # Change to script directory
    cd "$SCRIPT_DIR"
    
    # Check Supabase configuration first
    if ! check_supabase_config; then
        print_error "Please configure Supabase in .env file before starting services."
        exit 1
    fi
    
    # Kill processes if force flag is set
    if [[ "$FORCE_KILL" == true ]]; then
        kill_processes
    else
        print_status "Running in normal mode. Use --force to kill existing processes."
    fi
    
    # Start services
    start_backend
    start_frontend
    
    echo ""
    show_status
    
    print_status "aiBnb application startup completed!"
    print_status "Use 'pkill -f node' to stop all services if needed."
    
    echo ""
    print_status "Ready for UC-001 Sprint 1 MVP testing:"
    echo "  1. Property creation and management"
    echo "  2. Item registration and tracking"
    echo "  3. QR code generation and mapping"
    echo "  4. Dynamic content page display"
}

# Run main function
main "$@" 