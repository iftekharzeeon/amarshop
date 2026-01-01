# Secure Shop Verse - Employee Verification E-commerce

This is an enhanced e-commerce application with employee verification and OTP-based authentication system.

## New Features

### 1. Product Management from Database

- Products are now loaded from Supabase database
- Easy to update product information through database
- Fallback to demo data if database is not available

### 2. Employee Verification System

- Employee ID verification against database
- OTP-based two-factor authentication
- Auto-fill customer information after verification
- Timer-based OTP with resend functionality

### 3. Enhanced Checkout Process

1. Select items to buy
2. Proceed to checkout
3. Verify Employee ID
4. Send OTP to employee
5. Verify OTP
6. Auto-fill customer information
7. Complete payment

## Database Setup

To fully enable all features, you need to run the following SQL migration in your Supabase dashboard:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL script from `cloud-migration.sql`

### Option 2: Using Supabase CLI

```bash
# Link your project (if not already linked)
supabase link --project-ref your-project-id

# Push the migration
supabase db push
```

### Database Schema

The application uses the following tables:

#### Products Table

- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `price` (DECIMAL)
- `original_price` (DECIMAL, nullable)
- `image_url` (TEXT)
- `category` (VARCHAR)
- `rating` (INTEGER)
- `in_stock` (BOOLEAN)

#### Employees Table

- `id` (SERIAL PRIMARY KEY)
- `employee_id` (VARCHAR, unique)
- `full_name` (VARCHAR)
- `email` (VARCHAR)
- `phone` (VARCHAR)
- `department` (VARCHAR)
- `designation` (VARCHAR)
- `is_active` (BOOLEAN)

#### OTP Sessions Table

- `id` (UUID PRIMARY KEY)
- `employee_id` (VARCHAR, foreign key)
- `otp_code` (VARCHAR)
- `expires_at` (TIMESTAMP)
- `verified` (BOOLEAN)

## Demo Employee IDs

You can test the employee verification with these demo Employee IDs:

- `EMP001` - আহমেদ হাসান (IT Department)
- `EMP002` - ফাতিমা খাতুন (HR Department)
- `EMP003` - মোহাম্মদ করিম (Sales Department)
- `EMP004` - রহিমা বেগম (Finance Department)
- `EMP005` - তানভীর রহমান (IT Department)

## How to Use

### Testing Employee Verification

1. Add items to cart and proceed to checkout
2. Enter any of the demo Employee IDs (e.g., `EMP001`)
3. Click "Verify" - you should see a green checkmark
4. Click "Send OTP for Verification"
5. Check the toast notification for the demo OTP code
6. Enter the 6-digit OTP code
7. Click "Verify OTP"
8. Customer information will be auto-filled

### OTP Features

- **Timer**: OTP expires in 5 minutes with countdown display
- **Resend**: Option to resend OTP after expiry
- **Demo Mode**: Any 6-digit number works as OTP for demonstration

## Fallback Mode

The application gracefully handles database connectivity issues:

- If database tables don't exist, it uses demo data
- Employee verification works with hardcoded demo employees
- OTP verification accepts any 6-digit code in demo mode
- Clear notifications indicate when running in demo mode

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start Supabase (for local development)
supabase start
```

## Deployment

The application is configured to work with Supabase cloud database. Make sure to:

1. Run the database migration
2. Update environment variables if needed
3. Deploy the application

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Radix UI, Shadcn/ui
- **State Management**: React hooks
- **Authentication**: Supabase Auth (for future features)
- **Payment**: SSLCommerz integration

## Security Features

- Row Level Security (RLS) enabled on all tables
- Input validation and sanitization
- OTP expiration and verification
- Employee status verification
- Secure payment gateway integration
