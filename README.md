# Location Tracker App

A lightweight, well-optimized location tracking application built with React Native and TypeScript. The app collects user location every 8 seconds, sends push notifications after 10 minutes of inactivity, and provides a clean UI for managing location history.

## Features

### Core Functionality

- **Location Tracking**: Collects user location every 8 seconds (configurable)
- **Background Location**: Works in background using react-native-background-actions
- **Inactivity Detection**: Sends push notification after 10 minutes without movement
- **Notification Handling**: Stops tracking when notification is pressed

### User Interface

- **Beautiful UI**: Built with Tailwind CSS and NativeWind
- **Intuitive Navigation**: Bottom tab navigation with custom tab bar
- **Location History**: Comprehensive list of recorded locations
- **Swipeable Actions**: Delete, edit, or view locations on map

### Settings

- **Tracking Toggle**: Enable/disable location tracking
- **Notification Settings**: Turn push notifications on/off
- **Sampling Frequency**: Adjust location sampling interval (8 seconds to any value)
- **Background Tracking**: Configurable background operation

## Technical Stack

- **Framework**: React Native 0.82.1
- **TypeScript**: Strongly typed codebase
- **Navigation**: React Navigation 7.x with custom tab bar
- **UI Library**: NativeWind (Tailwind CSS for React Native)
- **Performance**: FlashList for efficient list rendering
- **Location Services**: react-native-background-actions, @notifee/react-native
- **Architecture**: Clean component structure with hooks and stores

## Architecture

```
src/
├── components/          # Reusable UI components
├── lib/                 # Core logic and utilities
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Location and notification services
│   ├── storage/         # Zustand and MMKV for state management
│   └── theme/           # Theme configuration
├── screens/             # App screens and navigation
└── assets/              # Static assets
```

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Install iOS dependencies: `cd ios && pod install`
4. Run the app:
   - Android: `npm run android`
   - iOS: `npm run ios`

## Configuration

### Location Tracking Settings

- **Sampling Interval**: Adjustable from 8 seconds to any value
- **Tracking Toggle**: Enable/disable location tracking
- **Background Operation**: Configurable background tracking

### Push Notifications

- **Notification Toggle**: Enable/disable push notifications
- **Inactivity Detection**: Automatic notification after 10 minutes of inactivity
- **Notification Handling**: Stops tracking when notification is pressed

## Development

This project follows best practices for React Native development:

- TypeScript for type safety
- React Navigation for screen management
- Zustand for state management
- MMKV for persistent storage
- NativeWind for styling
- FlashList for efficient list rendering
- Proper error handling and logging
- Clean component structure with hooks
