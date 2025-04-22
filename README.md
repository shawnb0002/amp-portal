# AMP CSR Portal

A Next.js-based Customer Service Representative (CSR) portal for managing vehicle subscriptions and customer accounts.

## Overview

The AMP CSR Portal is a comprehensive dashboard that enables customer service representatives to:

- Manage customer profiles and accounts
- Handle vehicle subscriptions and transfers
- Process payments and billing information
- Track customer activity and vehicle status

## Key Features

### Customer Management
- View and edit customer profiles
- Search and filter customer lists
- Track customer activity history
- Verify email addresses during registration

### Vehicle Management
- Create and manage vehicle subscriptions
- Transfer vehicles between customers
- Edit vehicle details and status
- View vehicle subscription history

### Subscription Handling
- Create new subscriptions
- Cancel existing subscriptions
- Update subscription details
- View subscription status and history

### Payment Processing
- Handle billing information
- Process payments
- Update payment details
- View payment history

### User Interface
- Responsive sidebar navigation
- Collapsible menu for space efficiency
- Quick action buttons for common tasks
- Status badges for visual feedback
- Loading states and error handling

## Technical Stack

- **Framework**: Next.js with TypeScript
- **UI Components**: Custom components with Radix UI primitives
- **State Management**: React Query for server state
- **Database**: Supabase
- **Styling**: Tailwind CSS

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable React components
  - `/addCustomerModal` - Customer creation workflow
  - `/dashboard` - Main dashboard components
  - `/forms` - Form components for data entry
  - `/ui` - Shared UI components
  - `/userProfile` - User profile management
- `/hooks` - Custom React hooks for data fetching and state management
- `/lib` - Utility functions and configurations
- `/types` - TypeScript type definitions

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Supabase Documentation](https://supabase.com/docs)
