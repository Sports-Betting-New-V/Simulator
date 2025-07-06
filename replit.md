# BetSim Pro - AI-Powered Sports Betting Simulator

## Overview

BetSim Pro is a comprehensive full-stack TypeScript sports betting simulator that combines real-time sports data, AI-powered predictions, and sophisticated betting mechanics. The application provides users with a risk-free environment to test betting strategies using virtual currency while experiencing realistic market conditions.

### Key Features
- **AI-Powered Predictions**: Uses OpenAI GPT-4o to generate intelligent betting recommendations
- **Real Sports Data**: Integrates with ESPN Sports API for live NBA, NFL, MLB, and NHL games
- **Virtual Bankroll**: Users start with $10,000 virtual currency for betting simulation
- **Comprehensive Analytics**: Tracks win rates, ROI, profit/loss, and betting patterns
- **Theme Support**: Full dark/light mode with automatic system preference detection
- **Responsive Design**: Mobile-optimized interface built with shadcn/ui components

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite build system
- **Routing**: Wouter for lightweight client-side routing
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom betting-themed design system
- **State Management**: TanStack Query (React Query) for server state management
- **Component Structure**: Modular design with reusable UI components

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints with JSON responses
- **Authentication**: Replit Auth with session management
- **Middleware**: Custom logging, error handling, and request parsing
- **Development**: Vite integration for hot module replacement during development

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL via Neon serverless connection
- **Migrations**: Drizzle Kit for schema management and database migrations
- **Session Storage**: PostgreSQL-based session store for authentication

## Key Components

### Data Models
- **Users**: Virtual bankroll management, profile data, and authentication
- **Games**: Sports games with comprehensive betting lines (spreads, moneylines, totals)
- **Predictions**: AI-generated betting recommendations with confidence scoring
- **Bets**: Complete betting history with status tracking and payout calculations
- **Sessions**: Secure session management for user authentication

### Business Logic Services
- **ESPN Service**: Fetches real-time sports data from ESPN API
- **Prediction Engine**: Generates AI predictions using OpenAI GPT-4o
- **Betting Service**: Handles bet placement, validation, and payout calculations
- **Analytics Engine**: Calculates comprehensive user statistics and performance metrics

### Frontend Components
- **Dashboard**: Main user interface with performance overview
- **Predictions**: AI recommendation display with confidence levels
- **Betting Forms**: Interactive bet placement with real-time validation
- **Analytics**: Detailed performance tracking and statistics
- **Theme System**: Dark/light mode toggle with betting-specific color schemes

## Data Flow

1. **Game Data**: ESPN API → Backend Service → Database → Frontend Components
2. **AI Predictions**: Game Data → OpenAI API → Prediction Service → Database → Frontend
3. **Betting Process**: User Input → Validation → Database Update → Bankroll Adjustment
4. **Analytics**: Bet History → Statistical Calculations → Performance Metrics → Dashboard

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Client-side state management
- **axios**: HTTP client for API requests
- **openai**: OpenAI API integration for predictions

### UI Dependencies
- **@radix-ui/react-***: Comprehensive UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant management
- **lucide-react**: Icon library for UI elements

### Authentication & Session
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon serverless PostgreSQL with environment-based configuration
- **API Integration**: Direct ESPN API calls with error handling and rate limiting

### Production Considerations
- **Build Process**: Vite build for frontend, esbuild for backend bundling
- **Environment Variables**: Secure management of API keys and database credentials
- **Error Handling**: Comprehensive error boundaries and API error management
- **Performance**: Query optimization and caching strategies

### Replit Integration
- **Authentication**: Native Replit Auth integration
- **Database**: Automatic PostgreSQL provisioning
- **Development Tools**: Replit-specific Vite plugins for enhanced development experience

## Changelog

```
Changelog:
- July 06, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```