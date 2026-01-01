#!/bin/bash

# Script to set environment variables for different deployment environments

if [ "$1" = "development" ]; then
    echo "Setting up development environment..."
    supabase secrets set FRONTEND_URL_AMARSHOP=http://localhost:8080
    echo "✅ Development environment configured"
    echo "   Frontend URL: http://localhost:8080"
    
elif [ "$1" = "production" ]; then
    if [ -z "$2" ]; then
        echo "❌ Error: Please provide your production domain"
        echo "Usage: ./scripts/set-environment.sh production https://your-domain.com"
        exit 1
    fi
    
    echo "Setting up production environment..."
    supabase secrets set FRONTEND_URL_AMARSHOP=$2
    echo "✅ Production environment configured"
    echo "   Frontend URL: $2"
    
else
    echo "Usage:"
    echo "  Development: ./scripts/set-environment.sh development"
    echo "  Production:  ./scripts/set-environment.sh production https://your-domain.com"
    echo ""
    echo "Examples:"
    echo "  ./scripts/set-environment.sh development"
    echo "  ./scripts/set-environment.sh production https://elitestore.co"
fi
