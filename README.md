# ManulCoffee — Restaurant Website Platform

ManulCoffee started as a modern website for a fictional coffee shop in Riga.  
The project is now being developed into a reusable restaurant website platform that can be adapted for different cafes and restaurants.

The main goal is to build a reusable backend and admin system while keeping the frontend flexible, so each business can have its own design, content and branding.

## Tech Stack

- React
- TypeScript
- Vite
- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Edge Functions
- Resend
- GitHub
- Cloudflare Pages

## Development Progress

The project is being developed step by step, from a simple frontend website to a complete restaurant management platform.

### 1. Website Frontend

- [x] Created the first responsive restaurant website
- [x] Added navigation, hero section and content sections
- [x] Created restaurant menu categories and product cards
- [x] Added locations, reviews, contacts and footer
- [x] Added responsive design for desktop and mobile
- [x] Added basic page metadata

### 2. GitHub & Deployment

- [x] Created a GitHub repository
- [x] Connected the project to GitHub
- [x] Configured the production build
- [x] Deployed the website with Cloudflare Pages
- [x] Configured automatic deployment from GitHub

### 3. Supabase Backend

- [x] Connected Supabase to the React application
- [x] Created the PostgreSQL database
- [x] Created the `reservations` table
- [x] Added Row Level Security (RLS)
- [x] Added secure database policies

### 4. Reservation System

- [x] Created the customer reservation form
- [x] Connected reservations to Supabase
- [x] Added restaurant location selection
- [x] Added reservation date and time selection
- [x] Added guest count
- [x] Added reservation statuses
- [x] Added protection against duplicate active reservation slots
- [x] Added automatic checking of unavailable reservation times

### 5. Admin Authentication

- [x] Created the admin login page
- [x] Added Supabase Authentication
- [x] Created protected admin routes
- [x] Created an admin user permission system
- [x] Protected private reservation data from public access

### 6. Reservation Admin Dashboard

- [x] Created the reservation management dashboard
- [x] Added reservation search
- [x] Added reservation filters
- [x] Added reservation counters
- [x] Added reservation sorting
- [x] Added Confirm and Cancel actions
- [x] Added responsive desktop and mobile layouts

### 7. Email Notifications

- [x] Connected Resend
- [x] Created Supabase Edge Functions for server-side email sending
- [x] Added customer email after a reservation request
- [x] Added restaurant notification for new reservations
- [x] Added confirmation email when an admin confirms a reservation
- [x] Added cancellation email when an admin cancels a reservation
- [x] Kept API keys and email secrets on the server

### 8. Menu CMS

- [x] Created the `menu_items` database table
- [x] Added RLS and admin permissions
- [x] Connected the public menu to Supabase
- [x] Created the `/admin/menu` dashboard
- [x] Added new menu item creation
- [x] Added menu item editing
- [x] Added Hide / Show functionality
- [x] Added menu item deletion
- [x] Added automatic menu updates on the public website
- [x] Completed full menu CRUD functionality

## Planned Development

### 9. Business Settings & Configuration

- [ ] Move restaurant information from the code to reusable configuration
- [ ] Add editable business name and branding
- [ ] Add editable contact information
- [ ] Add editable addresses and locations
- [ ] Add opening hours
- [ ] Create Business Settings management in the admin dashboard

### 10. Multilanguage Support

- [ ] Add Latvian
- [ ] Add English
- [ ] Add Russian
- [ ] Make restaurant content manageable in multiple languages

### 11. SEO

- [ ] Improve page metadata
- [ ] Add Open Graph metadata
- [ ] Add sitemap
- [ ] Add robots configuration
- [ ] Add structured restaurant data

### 12. GDPR & Privacy

- [ ] Add Privacy Policy
- [ ] Add cookie management
- [ ] Review reservation data handling
- [ ] Improve GDPR compliance

### 13. Production Email & Domain

- [ ] Connect a custom domain
- [ ] Verify the production email domain
- [ ] Replace test email addresses
- [ ] Configure production customer and restaurant emails

### 14. Security Hardening

- [ ] Improve Edge Function authorization
- [ ] Move sensitive reservation email logic fully to the server
- [ ] Add protection against spam and abuse
- [ ] Review Supabase RLS policies
- [ ] Review admin permissions

### 15. Analytics

- [ ] Add privacy-friendly website analytics
- [ ] Track important website events
- [ ] Track reservation conversions

### 16. Backup & Recovery

- [ ] Create a database backup strategy
- [ ] Document recovery steps
- [ ] Prepare the project for production maintenance

## Project Goal

The final goal is not only to create one coffee shop website.

The project is being developed as a reusable **Restaurant Website Platform** with:

- a customizable frontend
- restaurant reservation system
- admin dashboard
- menu management
- email notifications
- business configuration
- multilingual support
- production-ready deployment

This architecture will make it possible to reuse the same core system for different restaurants while creating a unique frontend and brand identity for each client.
