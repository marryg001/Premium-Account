# Project TODO

## Database Schema
- [x] Create products table (id, name, description, price, category)
- [x] Create orders table (id, userId, productId, quantity, totalPrice, discountCode, finalPrice, email, status, createdAt)
- [x] Create vouchers table (id, code, discountPercent, isActive)

## Backend API
- [x] Product listing endpoint
- [x] Voucher validation endpoint
- [x] Order creation endpoint
- [ ] Invoice generation endpoint

## Frontend Pages
- [x] Landing page with hero banner and product showcase
- [x] Product catalog page
- [x] Checkout page with email input and voucher code
- [x] Payment instructions page (crypto wallets)
- [x] Order confirmation page with invoice

## Features
- [x] Black Friday banner with FRIDAY50 code
- [x] Voucher system (FRIDAY50: 50%, MONDAY60: 60%)
- [x] Email validation (Gmail, Proton, Yahoo, Hotmail, Outlook only)
- [x] Invoice generation with order details
- [x] Crypto payment instructions with QR codes
- [x] Contact information display (@jayce6666)

## Styling
- [x] Professional e-commerce design
- [x] Responsive layout
- [x] Product cards with pricing
- [x] Payment instruction cards with wallet addresses

## New Updates
- [x] Add Base network QR code image
- [x] Make payment section interactive with chain selection
- [x] Display selected chain's wallet address and QR code at 600x600px
