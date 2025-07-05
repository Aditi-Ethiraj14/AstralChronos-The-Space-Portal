# AstralChronos - Space Exploration Platform

## 🚀 Overview

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
- **Data Storage**: Lightweight backend powered by a static JSON file, acting as the primary data store.

## ✨ Key Components

### Space Data Integration
- **NASA APIs**: Integration with NASA's Astronomy Picture of the Day (APOD) and other space data APIs
- **ISS Tracking**: Real-time International Space Station location tracking
- **Astronomical Events**: Historical space event timeline and calendar system with AI integration
- **Moon Phase Data**: Lunar cycle information and visualization

### Interactive Features
- **Space Timeline**: Chronological visualization of major space exploration milestones
- **Space Dashboard**: Real-time data display for ISS location, moon phases, and NASA imagery
- **Quiz System**: Educational quizzes on space topics with progress tracking
- **Virtual Tourism**: Space travel planning for fictional planetary destinations
- **Space Quizzes**: Interactive, fun quizzes to test your space knowledge.

### AI Integration
- **Chatbot Assistant**: Voice and text-enabled space exploration assistant
- **N8N Webhooks**: Integration with N8N automation platform for AI capabilities
- **Dynamic Content and Real-Time Updates**: Webhook responses can provide real-time space event information
- **Speech Recognition**: Browser-based speech-to-text functionality
- **Text-to-Speech**: Browser-based speech synthesis for responses

### User Interface
- **Responsive Design**: Seamlessly adapts across all devices with a fully responsive layout.
- **Space Theme**: Dark theme with cosmic color palette
- **Interactive Elements**: Hover effects, animations, and smooth scrolling navigation

## 🤖 Dependencies

### Development Dependencies
- **Build Tools**: Vite, ESBuild for production builds
- **TypeScript**: Full TypeScript support with configuration

### Core Dependencies
- **React Ecosystem**: React, React Query for state management
- **UI Components**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, class-variance-authority for component variants

### External APIs
- **NASA Open Data**: APOD, ISS tracking, and other space data endpoints
- **N8N Platform**: Webhook integrations for AI chatbot and tourism features
- **Moon Phase APIs**: Third-party lunar data services (configurable)
- **News APIs**: Space news integration (configurable)
- **Webhooks**: Integrated with AI agenst and LLM Modles using n8n AI workflow
- **3D Models**: Seamlessly embedded interactive models powered by Sketchfab for immersive visualization

## 🛠️ Installation & Setup Instructions

Follow these steps to run the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/AstralChronos.git
cd AstralChronos
````

### 2. Install dependencies

```bash
npm install
npm install cross-env
```

> `cross-env` ensures environment variables work across different OS platforms like Windows, macOS, and Linux.

### 3. Create and configure your `.env` file

```bash
cp .env.example .env
```

Now open the `.env` file and fill in the required API keys:

### 4. Start the development server

```bash
npm run dev
```

This will launch the app in development mode.
You can now view it in your browser at:

```
http://localhost:5000
```
