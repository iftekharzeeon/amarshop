#!/bin/bash

# Script to switch between SSLCommerz sandbox and live environments

if [ "$1" = "sandbox" ]; then
    echo "🔄 Switching to SSLCommerz Sandbox Environment..."
    
    # Set sandbox credentials (replace with your actual sandbox credentials)
    supabase secrets set SSLCOMMERZ_STORE_ID=secur686b7b6d28f32
    supabase secrets set SSLCOMMERZ_STORE_PASSWORD=secur686b7b6d28f32@ssl
    supabase secrets set SSLCOMMERZ_ENVIRONMENT=sandbox
    
    echo "✅ Sandbox environment configured"
    echo "   Store ID: secur686b7b6d28f32"
    echo "   Environment: Sandbox"
    echo "   URL: https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
    
elif [ "$1" = "live" ]; then
    if [ -z "$2" ] || [ -z "$3" ]; then
        echo "❌ Error: Please provide live store ID and password"
        echo "Usage: ./scripts/set-sslcommerz.sh live <store_id> <store_password>"
        exit 1
    fi
    
    echo "🔄 Switching to SSLCommerz Live Environment..."
    
    # Set live credentials
    supabase secrets set SSLCOMMERZ_STORE_ID=$2
    supabase secrets set SSLCOMMERZ_STORE_PASSWORD=$3
    supabase secrets set SSLCOMMERZ_ENVIRONMENT=live
    
    echo "✅ Live environment configured"
    echo "   Store ID: $2"
    echo "   Environment: Live"
    echo "   URL: https://securepay.sslcommerz.com/gwprocess/v4/api.php"
    
else
    echo "Usage:"
    echo "  Sandbox: ./scripts/set-sslcommerz.sh sandbox"
    echo "  Live:    ./scripts/set-sslcommerz.sh live <store_id> <store_password>"
    echo ""
    echo "Examples:"
    echo "  ./scripts/set-sslcommerz.sh sandbox"
    echo "  ./scripts/set-sslcommerz.sh live your_live_store_id your_live_password"
fi

# Note: You'll need to update the payment function to use the SSLCOMMERZ_ENVIRONMENT variable
