# 🏦 SSLCommerz Live Integration Guide

## Step 1: Apply for SSLCommerz Merchant Account

### 📋 Application Process
1. **Visit**: [https://www.sslcommerz.com/](https://www.sslcommerz.com/)
2. **Click**: "Apply for Merchant Account" or "Get Merchant Account"
3. **Fill out the merchant application form**

### 📄 Required Documents
- **Business Registration Certificate** (if registered company)
- **Trade License** (if applicable)
- **TIN Certificate**
- **Bank Account Statement** (last 3 months)
- **NID/Passport Copy** (authorized person)
- **Utility Bill** (business address proof)
- **Website Screenshots** or **App Store Link**

### 💼 Business Information Required
- Business Name
- Business Type (e-commerce, service provider, etc.)
- Business Address
- Contact Information
- Bank Account Details (for settlement)
- Expected Monthly Transaction Volume
- Product/Service Categories

## Step 2: Account Verification Process

### ⏱️ Timeline
- **Application Review**: 3-7 business days
- **Document Verification**: 2-3 business days
- **Bank Verification**: 1-2 business days
- **Final Approval**: 1-2 business days

### 📞 Contact During Process
- **Email**: merchant@sslcommerz.com
- **Phone**: +880-2-9611680
- **Business Hours**: Saturday-Thursday, 9 AM - 6 PM (Bangladesh Time)

## Step 3: Receive Live Credentials

After approval, you'll receive:
- **Live Store ID** (e.g., `your_company_name_live`)
- **Live Store Password** (secure password)
- **Merchant Dashboard Access**
- **API Documentation**

## Step 4: Update Your Application

### 4.1 Set Live Credentials
```bash
# Switch to live environment
./scripts/set-sslcommerz.sh live your_live_store_id your_live_password

# Redeploy functions with live credentials
./deploy-functions.sh
```

### 4.2 Update Render Site (if needed)
If you need to update your Render deployment:
```bash
# Rebuild and redeploy on Render
git add .
git commit -m "Switch to SSLCommerz live environment"
git push origin main
```

## Step 5: Test Live Environment

### 🧪 Testing Process
1. **Small Test Transaction**: Start with a small amount (৳10-50)
2. **Use Real Card**: Test with your own card
3. **Verify Settlement**: Check if money reaches your bank account
4. **Test All Payment Methods**: Cards, mobile banking, internet banking

### 💳 Live Payment Methods Available
- **Credit/Debit Cards**: Visa, MasterCard, American Express
- **Mobile Banking**: bKash, Rocket, Nagad, Upay
- **Internet Banking**: All major Bangladesh banks
- **Digital Wallets**: Various local and international options

## Step 6: Go Live Checklist

### ✅ Pre-Launch Checklist
- [ ] Live credentials received and configured
- [ ] Test transactions completed successfully
- [ ] Settlement verified in bank account
- [ ] Error handling tested
- [ ] Customer support process defined
- [ ] Refund process documented
- [ ] Legal compliance verified

### 🚀 Launch Day
- [ ] Monitor transactions closely
- [ ] Have SSLCommerz support contact ready
- [ ] Test customer journey end-to-end
- [ ] Verify email notifications
- [ ] Check payment success/failure pages

## Step 7: Ongoing Management

### 📊 Merchant Dashboard Features
- **Real-time Transaction Monitoring**
- **Daily/Monthly Reports**
- **Settlement Reports**
- **Refund Management**
- **Customer Dispute Handling**
- **API Usage Statistics**

### 💰 Settlement Information
- **Settlement Schedule**: Daily (next business day)
- **Cut-off Time**: Usually 6 PM Bangladesh Time
- **Weekend/Holiday**: Next working day
- **Minimum Settlement**: As per your agreement

### 🔒 Security Features
- **PCI DSS Compliance**
- **3D Secure Authentication**
- **Fraud Detection**
- **Transaction Encryption**
- **Secure Token System**

## Step 8: Troubleshooting

### Common Issues
1. **Payment Declining**: Check card limits, bank restrictions
2. **Settlement Delays**: Verify bank account details
3. **API Errors**: Check credentials and endpoint URLs
4. **Customer Complaints**: Use merchant dashboard for investigation

### Support Channels
- **Technical Support**: api@sslcommerz.com
- **Business Support**: support@sslcommerz.com
- **Emergency Hotline**: +880-2-9611680

## Current Status: Ready for Live Integration ✅

Your application is already configured to work with both sandbox and live environments. Once you receive your live credentials, simply run:

```bash
./scripts/set-sslcommerz.sh live YOUR_LIVE_STORE_ID YOUR_LIVE_PASSWORD
./deploy-functions.sh
```

Your e-commerce site will then process real payments through SSLCommerz!
