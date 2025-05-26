# Hapo Cloud Technologies CMS

A modern, feature-rich Content Management System for digital signage and content distribution.

## Development Credentials

For development purposes, use these temporary credentials:

```
Email: admin@hapotech.com
Password: admin123
```

**WARNING**: These credentials are for development only. Make sure to remove them and implement proper authentication in production.

## Features

### Authentication
- Secure email/password authentication
- Role-based access control (Admin, Editor, Viewer)
- User management system

### Content Management
- Content Library with support for images, videos, and templates
- Drag-and-drop file uploads
- Content categorization and tagging
- Search and filter capabilities
- Preview functionality

### Campaign Management
- Create and schedule content campaigns
- Multi-location targeting
- Campaign analytics and reporting
- Status tracking and notifications
- Calendar view for campaign scheduling

### System Features
- Real-time notifications
- Help Center with searchable documentation
- Live chat support
- User activity tracking
- System configuration management

### Analytics
- Traffic analysis
- Dwell time tracking
- Campaign performance metrics
- User engagement statistics

## Technical Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite
- **Database**: Supabase

## Project Structure

```
src/
├── components/
│   ├── Charts/
│   │   ├── DwellTimeChart.tsx
│   │   ├── TrafficChart.tsx
│   │   └── index.tsx
│   ├── NotificationCenter.tsx
│   └── Footer.tsx
├── pages/
│   ├── Auth.tsx
│   ├── CampaignManagement.tsx
│   ├── ContentLibrary.tsx
│   ├── CreateCampaign.tsx
│   ├── HelpCenter.tsx
│   └── Settings.tsx
└── App.tsx
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables:
```
VITE_API_URL=http://localhost:8080/api
```

## Building for Production

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

Copyright © 2025 Hapo Cloud Technologies. All rights reserved.