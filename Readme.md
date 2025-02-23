# TimeCapsuleConn

TimeCapsuleConn is a modern web application that allows users to create and share digital time capsules. Users can store memories, photos, and videos that unlock at specific future dates, making it a unique platform for preserving and sharing moments.

## Features

- **Digital Time Capsules**: Create time capsules with photos, videos, and descriptions
- **Location Tagging**: Add location context to your memories using Google Maps integration
- **Scheduled Unlocking**: Set future dates for when your capsules become accessible
- **Group Sharing**: Create and manage groups to share memories with specific people
- **Progress Tracking**: Visual progress bars show time remaining until capsule unlocking
- **Upcoming Events**: Track your soon-to-unlock capsules
- **Private/Public Groups**: Flexibility to create both private and public sharing groups

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Maps Integration**: Google Maps Places API
- **File Handling**: Local storage (configurable for S3 in production)

## Prerequisites

- Node.js (v18 or higher)
- MongoDB instance
- Google Maps API key
- Clerk account for authentication

## Environment Variables

Create a `.env` file in the root directory with the following variables:
