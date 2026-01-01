# Secure Shop Verse - E-commerce with SSLCommerz

A modern e-commerce website built with React, TypeScript, Supabase, and SSLCommerz payment gateway.

## Features

- 🛍️ Modern e-commerce interface
- 🔒 Secure payment processing with SSLCommerz
- 📱 Responsive design
- 🛒 Shopping cart functionality
- 💳 Multiple payment methods
- 📊 Order management
- 🔔 Real-time payment status

## Tech Stack

- **Frontend**: Vite, React, TypeScript, Tailwind CSS, shadcn-ui
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Payment Gateway**: SSLCommerz
- **Deployment**: Lovable.dev

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- SSLCommerz account (sandbox/live)
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <YOUR_GIT_URL>
cd secure-shop-verse
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables (see SSLCommerz Setup below)

4. Start development server
```bash
npm run dev
```

## SSLCommerz Setup

### 1. Get SSLCommerz Credentials

- Sign up at [SSLCommerz](https://www.sslcommerz.com/)
- Get your Store ID and Store Password from the dashboard
- For testing, use sandbox credentials

### 2. Configure Supabase Edge Functions

Go to your Supabase project dashboard:
1. Navigate to **Settings** → **Edge Functions** → **Environment Variables**
2. Add these environment variables:

```
SSLCOMMERZ_STORE_ID=your_store_id_here
SSLCOMMERZ_STORE_PASSWORD=your_store_password_here
```

### 3. Deploy Edge Functions

Run the deployment script:
```bash
# First, login to Supabase
supabase auth login

# Deploy all payment functions
./deploy-functions.sh
```

Or deploy manually:
```bash
supabase functions deploy sslcommerz-payment --project-ref hqnijhldgvdokmvvlaco
supabase functions deploy sslcommerz-success --project-ref hqnijhldgvdokmvvlaco
supabase functions deploy sslcommerz-fail --project-ref hqnijhldgvdokmvvlaco
supabase functions deploy sslcommerz-cancel --project-ref hqnijhldgvdokmvvlaco
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn-ui components
│   ├── Header.tsx       # Navigation header
│   ├── ProductCard.tsx  # Product display component
│   ├── ShoppingCart.tsx # Shopping cart sidebar
│   ├── CheckoutForm.tsx # Customer details form
│   └── PaymentStatus.tsx # Payment result handler
├── pages/
│   ├── Index.tsx        # Main e-commerce page
│   └── NotFound.tsx     # 404 page
├── integrations/
│   └── supabase/        # Supabase client & types
└── hooks/               # Custom React hooks

supabase/
├── functions/
│   ├── sslcommerz-payment/  # Payment initialization
│   ├── sslcommerz-success/  # Success callback
│   ├── sslcommerz-fail/     # Failure callback
│   └── sslcommerz-cancel/   # Cancel callback
└── migrations/              # Database schema
```

## How It Works

1. **Add to Cart**: Users browse products and add items to cart
2. **Checkout**: Users fill out shipping/billing information
3. **Payment**: System creates order in database and redirects to SSLCommerz
4. **Callback**: SSLCommerz sends payment result to our Edge Functions
5. **Update**: Order status is updated and user sees payment result

## Environment Variables

Required environment variables for Supabase Edge Functions:

- `SSLCOMMERZ_STORE_ID`: Your SSLCommerz store ID
- `SSLCOMMERZ_STORE_PASSWORD`: Your SSLCommerz store password
- `SUPABASE_URL`: Auto-provided by Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Auto-provided by Supabase

## Environment Configuration

### Development vs Production

The application needs different frontend URLs for payment callbacks depending on the environment:

- **Development**: http://localhost:8080
- **Production**: Your actual domain (e.g., https://elitestore.co)

### Quick Environment Setup

Use the provided script to easily switch between environments:

```bash
# For development
./scripts/set-environment.sh development

# For production (replace with your domain)
./scripts/set-environment.sh production https://your-domain.com
```

### Manual Configuration

Set the frontend URL for payment callbacks:

```bash
# Development
supabase secrets set FRONTEND_URL_ESHOP=http://localhost:8080

# Production
supabase secrets set FRONTEND_URL_ESHOP=https://your-domain.com
```

After changing the environment, redeploy the edge functions:
```bash
./deploy-functions.sh
```

## Testing

### Test Cards for Sandbox

SSLCommerz provides test cards for sandbox testing:

- **Visa**: 4242 4242 4242 4242
- **MasterCard**: 5555 5555 5555 4444
- **American Express**: 3782 8224 6310 005

## Deployment

### Using Lovable.dev

1. Push your changes to the repository
2. Open [Lovable Project](https://lovable.dev/projects/3f071c32-a6e6-4280-91b4-d1d25c49b0a6)
3. Click Share → Publish

### Manual Deployment

Build the project:
```bash
npm run build
```

Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

## Support

For issues related to:
- **SSLCommerz**: Contact SSLCommerz support
- **Supabase**: Check Supabase documentation
- **This Project**: Create an issue in the repository

## License

This project is built with Lovable.dev and follows their terms of service.

## Going Live with SSLCommerz

### Current Status: Sandbox Ready ✅
Your application is currently configured with SSLCommerz sandbox for testing.

### Steps to Go Live:

1. **Apply for SSLCommerz Merchant Account**:
   - Visit [https://www.sslcommerz.com/](https://www.sslcommerz.com/)
   - Submit merchant application with required documents
   - Wait for approval (3-7 business days)

2. **Switch to Live Environment**:
   ```bash
   # After receiving live credentials
   ./scripts/set-sslcommerz.sh live YOUR_LIVE_STORE_ID YOUR_LIVE_PASSWORD
   ./deploy-functions.sh
   ```

3. **Test Live Payments**:
   - Make small test transactions
   - Verify settlement in your bank account
   - Test all payment methods

For detailed instructions, see: [SSLCommerz Live Setup Guide](./SSLCommerz-Live-Setup-Guide.md)
