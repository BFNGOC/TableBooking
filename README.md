# TableBooking

A full-stack restaurant table reservation platform that allows customers to discover restaurants, book tables, make payments, and manage their reservations. Restaurant owners can manage their restaurants, tables, bookings, and business activities through a dedicated management system.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- HeroUI
- TanStack Query
- Axios

### Backend

- NestJS
- TypeScript
- MongoDB
- Mongoose
- Redis
- Elasticsearch
- Socket.IO

### Other Technologies

- VNPAY
- Cloudinary
- Docker
- GitHub Actions
- GitHub Container Registry
- k6

## Features

### Authentication & Authorization

- User registration and login
- Email verification
- JWT authentication
- Role-based authorization
- Customer, Restaurant, and Admin roles
- Restaurant onboarding and approval

### Restaurant Management

- Restaurant profile management
- Restaurant verification
- Restaurant search and discovery
- Restaurant detail pages
- Image management

### Table & Booking

- Table management
- Table availability management
- Custom booking start and end time
- Booking creation and management
- Booking cancellation
- Booking confirmation
- Check-in and no-show handling
- Double-booking protection
- Temporary booking hold and expiration

### Payment

- VNPAY integration
- Deposit payment
- Payment status management
- Payment timeout handling
- Automatic booking confirmation after successful payment

### Notifications

- In-app notifications
- Real-time notifications with Socket.IO
- Booking and payment notifications
- Unread notification count

### Dashboard

- Booking statistics
- Revenue statistics
- Customer statistics
- Cancellation rate
- Booking status analysis
- Time-based statistics and trends

### Performance & Security

- Redis for temporary/state-related workloads
- Elasticsearch for restaurant search
- MongoDB indexing and query optimization
- Request validation
- Rate limiting
- Authentication and role guards
- k6 performance testing
