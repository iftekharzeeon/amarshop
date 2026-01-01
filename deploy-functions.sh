#!/bin/bash

echo "Deploying Supabase Edge Functions..."

# Deploy SSLCommerz payment function
supabase functions deploy sslcommerz-payment --project-ref hqnijhldgvdokmvvlaco

# Deploy SSLCommerz success callback
supabase functions deploy sslcommerz-success --project-ref hqnijhldgvdokmvvlaco

# Deploy SSLCommerz failure callback
supabase functions deploy sslcommerz-fail --project-ref hqnijhldgvdokmvvlaco

# Deploy SSLCommerz cancel callback
supabase functions deploy sslcommerz-cancel --project-ref hqnijhldgvdokmvvlaco

echo "All functions deployed successfully!"
