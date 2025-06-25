# AstralChronos - Space Exploration Platform

## Overview

AstralChronos is a comprehensive space exploration platform that combines historical space events, real-time astronomical data, interactive features, and AI-powered experiences. The application serves as an educational and engagement hub for space enthusiasts, featuring timeline visualization, live space data dashboards, interactive quizzes, virtual space tourism planning, and an AI chatbot assistant.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: Radix UI components with shadcn/ui component library
- **Styling**: Tailwind CSS with custom space-themed color palette
- **Build Tool**: Vite for development and production builds
- **Animations**: Framer Motion for smooth animations and transitions

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Development Server**: Custom Vite integration for hot module replacement
- **Data Storage**: In-memory storage with interface for future database integration
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)

### Database Strategy
- **Current**: In-memory storage implementation (MemStorage class)
- **Planned**: PostgreSQL with Drizzle ORM for production deployment
- **Schema**: User authentication system with extensible design
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Space Data Integration
- **NASA APIs**: Integration with NASA's Astronomy Picture of the Day (APOD) and other space data APIs
- **ISS Tracking**: Real-time International Space Station location tracking
- **Astronomical Events**: Historical space event timeline and calendar system
- **Moon Phase Data**: Lunar cycle information and visualization

### Interactive Features
- **Space Timeline**: Chronological visualization of major space exploration milestones
- **Astronomical Calendar**: Monthly view of space events with interactive date selection
- **Space Dashboard**: Real-time data display for ISS location, moon phases, and NASA imagery
- **Quiz System**: Educational quizzes on space topics with progress tracking
- **Virtual Tourism**: AI-powered space travel planning for fictional planetary destinations

### AI Integration
- **Chatbot Assistant**: Voice and text-enabled space exploration assistant
- **N8N Webhooks**: Integration with N8N automation platform for AI capabilities
- **Speech Recognition**: Browser-based speech-to-text functionality
- **Text-to-Speech**: Browser-based speech synthesis for responses

### User Interface
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Space Theme**: Dark theme with cosmic color palette (space-black, cosmic-blue, nebula-purple, stellar-orange)
- **Interactive Elements**: Hover effects, animations, and smooth scrolling navigation
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## Data Flow

### Client-Side Data Flow
1. **Static Data**: JSON files loaded dynamically for space events, planet information, and quiz content
2. **API Integration**: React Query manages NASA API calls with caching and error handling
3. **Real-time Updates**: Periodic refetching of ISS location and astronomical data
4. **User Interactions**: Event-driven updates for calendar selections, quiz progress, and chatbot conversations

### Server-Side Data Flow
1. **API Proxying**: Express routes proxy NASA API calls to handle CORS and API key management
2. **Data Processing**: Server-side filtering and formatting of space event data
3. **Session Management**: User authentication and session persistence
4. **External Integrations**: N8N webhook communications for AI-powered features

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Query for state management
- **UI Components**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date manipulation and formatting

### Development Dependencies
- **Build Tools**: Vite, ESBuild for production builds
- **TypeScript**: Full TypeScript support with strict configuration
- **Database**: Drizzle ORM with PostgreSQL adapter (Neon serverless)
- **Development**: TSX for TypeScript execution, Replit-specific plugins

### External APIs
- **NASA Open Data**: APOD, ISS tracking, and other space data endpoints
- **N8N Platform**: Webhook integrations for AI chatbot and tourism features
- **Moon Phase APIs**: Third-party lunar data services (configurable)
- **News APIs**: Space news integration (configurable)

## Deployment Strategy

### Platform Configuration
- **Target Platform**: Replit with autoscaling deployment
- **Environment**: Node.js 20 with PostgreSQL 16 support
- **Build Process**: Vite production build with Express server bundling
- **Port Configuration**: Internal port 5000, external port 80

### Environment Variables
- **API Keys**: NASA API key, moon phase API, news API keys
- **Webhooks**: N8N endpoint URLs for AI integrations
- **Database**: PostgreSQL connection string for production
- **Security**: Session secrets and authentication tokens

### Production Considerations
- **Static Assets**: Vite builds optimized client bundles to `dist/public`
- **Server Bundle**: ESBuild creates single-file server bundle for deployment
- **Database Migrations**: Drizzle migrations for schema updates
- **Session Storage**: PostgreSQL-backed sessions for user persistence

## Changelog

Changelog:
- June 25, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.