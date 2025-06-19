# Hapo Cloud Technologies CMS

A modern, enterprise-grade Content Management System for digital signage and content distribution, built with React and TypeScript.

![Hapo CMS Dashboard](https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=400&q=80)

## Features

### Content Management
- Comprehensive media library supporting images, videos, audio, and documents
- Drag-and-drop file uploads with progress tracking
- Advanced content organization with tags and metadata
- Real-time content preview
- Automated content optimization

### Campaign Management
- Visual campaign builder
- Flexible scheduling with recurring patterns
- Location-based targeting
- Performance analytics and reporting
- A/B testing capabilities

### Screen Management
- Centralized screen control
- Real-time status monitoring
- Remote screen configuration
- Group management for bulk operations
- Automated health checks

### Analytics & Reporting
- Real-time traffic analysis
- Dwell time tracking
- Campaign performance metrics
- Custom report generation
- Data visualization with Recharts

### Security
- Role-based access control
- Secure authentication with JWT
- API rate limiting
- Audit logging
- Data encryption

## Tech Stack

### Frontend
- React 18.3.1
- TypeScript
- Vite
- Tailwind CSS
- Zustand for state management
- React Router v6
- React Hook Form
- Zod for validation
- Recharts for data visualization
- Lucide React for icons

### Development Tools
- ESLint
- PostCSS
- Terser for minification
- Vite compression plugin

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/hapo-cloud-cms.git
   cd hapo-cloud-cms
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   VITE_API_BASE_URL=/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Development Credentials
```
Email: admin@hapotech.com
Password: admin123
```
**Note**: These credentials are for development only.

## Project Structure
```
src/
├── components/      # Reusable UI components
├── features/        # Feature-specific components and logic
├── contexts/        # React contexts
├── hooks/          # Custom React hooks
├── lib/            # Core utilities and configurations
├── pages/          # Page components
├── services/       # API and external service integrations
├── store/          # Global state management
├── types/          # TypeScript type definitions
└── utils/          # Helper functions
```

## Building for Production

```bash
npm run build
```

This will create an optimized production build with:
- Code splitting
- Asset optimization
- Gzip and Brotli compression
- Source maps
- Tree shaking

## Performance Optimizations

- Lazy loading of routes and components
- Image optimization
- Efficient bundle splitting
- Caching strategies
- Minification and compression

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

Copyright © 2025 Hapo Cloud Technologies. All rights reserved.