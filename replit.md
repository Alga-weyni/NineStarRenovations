# Overview

This project is a professional service request management system for 9 Star Renovations, a property maintenance company serving Winnipeg. The system provides dual-purpose request forms for both landlords and tenants, with capabilities for PDF generation, email notifications, and administrative management. Users can either download blank PDF forms or submit requests online through validated forms with file upload capabilities.

The application serves as a complete business workflow solution that handles customer requests from submission through administrative processing, including automated PDF generation, email notifications to both the business and customers, and comprehensive data storage with export capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React with TypeScript in a Vite-powered single-page application. The UI leverages the shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling. The application uses Wouter for lightweight client-side routing and TanStack Query for server state management. Form handling is implemented with React Hook Form and Zod validation.

The component structure separates concerns with dedicated form components for landlord and tenant requests, reusable UI components, and shared layout components. The design system follows a consistent theme with CSS custom properties for theming support.

## Backend Architecture  
The server is built with Express.js and follows a modular architecture with separate route handlers, middleware, and services. The application uses a service-oriented approach with dedicated classes for PDF generation (PDFKit) and email handling (Nodemailer). File uploads are managed through Multer with configurable storage and validation.

Rate limiting is implemented to prevent abuse, and the server includes comprehensive error handling and logging. The API follows RESTful conventions with JSON responses and proper HTTP status codes.

## Data Storage Solution
The application uses SQLite as the primary database with better-sqlite3 for Node.js integration. The schema is managed through Drizzle ORM with TypeScript-first type safety. Database migrations are handled through Drizzle Kit with a dedicated migrations directory.

The data model includes a comprehensive requests table supporting both landlord and tenant request types with shared and type-specific fields. File references are stored as JSON arrays, and the system includes audit fields for tracking creation and updates.

## PDF Generation System
PDF generation is handled server-side using PDFKit for programmatic PDF creation. The system supports two modes: blank PDF generation for downloads and filled PDF generation from submitted form data. Templates include proper formatting, business branding, and comprehensive field mapping from the request data.

Generated PDFs are stored in the file system with organized naming conventions and are accessible for both email attachments and direct downloads through the admin interface.

## Email Integration
Email functionality is implemented using Nodemailer with SMTP configuration. The system sends dual notifications: operational alerts to the business email and confirmation receipts to customers. Email templates include HTML formatting with comprehensive request details and PDF attachments.

The email service supports configurable SMTP settings through environment variables and includes proper error handling for delivery failures.

## File Upload System
File uploads are managed through Multer with disk storage, supporting images, PDFs, and MP4 videos up to 10MB each. The system includes file type validation, size limits, and unique filename generation. Uploaded files are stored in organized directories with proper access controls.

The frontend provides a drag-and-drop interface with file validation and preview capabilities, supporting up to 3 files per request.

# External Dependencies

## Database
- **better-sqlite3**: Embedded SQLite database for data persistence
- **drizzle-orm**: TypeScript ORM for database operations and migrations

## Authentication & Security
- **express-rate-limit**: Rate limiting middleware for API protection
- **multer**: File upload handling with validation

## Email Services
- **nodemailer**: SMTP email sending (requires external SMTP service configuration)

## PDF Generation
- **pdfkit**: Server-side PDF document generation

## UI Framework
- **@radix-ui/***: Comprehensive set of UI primitives for accessible components
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Component variant management

## Form Management
- **react-hook-form**: Form state management and validation
- **@hookform/resolvers**: Validation resolvers including Zod integration
- **zod**: TypeScript-first schema validation

## Development Tools
- **vite**: Build tool and development server
- **typescript**: Type safety and enhanced developer experience
- **tsx**: TypeScript execution for development