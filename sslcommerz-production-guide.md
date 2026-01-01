# SSLCommerz Production Integration Guide

## 1. Update Environment Variables

Replace sandbox credentials with live credentials in Supabase secrets:

```bash
# Set live SSLCommerz credentials
supabase secrets set SSLCOMMERZ_STORE_ID=your_live_store_id
supabase secrets set SSLCOMMERZ_STORE_PASSWORD=your_live_store_password

# Redeploy functions
./deploy-functions.sh
```

## 2. Update Payment Gateway URL

Change the SSLCommerz API endpoint from sandbox to live:

### Current (Sandbox):
```
https://sandbox.sslcommerz.com/gwprocess/v4/api.php
```

### Production (Live):
```
https://securepay.sslcommerz.com/gwprocess/v4/api.php
```

## 3. Code Changes Required

Update the payment function to use live URL:

```typescript
// In sslcommerz-payment/index.ts
const sslcommerzResponse = await fetch(
  "https://securepay.sslcommerz.com/gwprocess/v4/api.php", // Changed from sandbox
  {
    method: "POST",
    body: sslcommerzData,
  }
);
```

## 4. Testing Process

### Phase 1: Sandbox Testing ✅ (Current)
- Use sandbox credentials
- Use sandbox URL
- Test with test cards

### Phase 2: Live Testing (After Account Approval)
- Use live credentials
- Use live URL
- Test with real cards (small amounts)

### Phase 3: Production Ready
- Full integration with live credentials
- Real customer transactions

## 5. SSLCommerz Live Account Benefits

- **Real Payment Processing**: Actual money transfers
- **Bangladesh Bank Approved**: Fully compliant
- **Multiple Payment Methods**: 
  - All major banks in Bangladesh
  - Mobile banking (bKash, Rocket, Nagad)
  - Credit/Debit cards (Visa, MasterCard)
  - Internet banking

## 6. Merchant Dashboard Features

After going live, you'll have access to:
- **Transaction Reports**
- **Settlement Reports**
- **Refund Management**
- **API Documentation**
- **Technical Support**

## 7. Settlement Process

- **Daily Settlement**: Funds transferred to your bank account
- **Settlement Time**: Usually next business day
- **Transaction Fees**: As per your merchant agreement

## 8. Important Notes

- **Test thoroughly** in sandbox before going live
- **Keep backup** of sandbox environment for testing
- **Monitor transactions** closely after going live
- **Implement proper error handling** for production

## 9. Contact Information

**SSLCommerz Support:**
- Email: support@sslcommerz.com
- Phone: +880-2-9611680
- Website: https://www.sslcommerz.com/contact

**Business Hours:**
- Saturday to Thursday: 9 AM - 6 PM (Bangladesh Time)
- Friday: Closed
