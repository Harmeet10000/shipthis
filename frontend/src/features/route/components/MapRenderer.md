# MapRenderer Component Documentation

## Overview

The `MapRenderer` component is a React component that initializes and manages a Mapbox GL JS map instance. It provides the foundation for route visualization with proper error handling, loading states, and cleanup.

## Features Implemented

### 1. Map Initialization (Requirement 3.1)

- Initializes Mapbox GL JS map instance using the `VITE_MAPBOX_TOKEN` environment variable
- Uses the `getMapboxToken()` utility from `@/lib/mapbox` for token validation
- Sets the Mapbox access token before creating the map instance

### 2. Default Configuration (Requirement 3.2)

- **Center**: [0, 0] (default world view)
- **Zoom**: 2 (world-level zoom)
- **Style**: `mapbox://styles/mapbox/streets-v12` (Mapbox Streets style)
- Configuration is imported from `DEFAULT_MAP_CONFIG` in `@/lib/mapbox`

### 3. Map Controls (Requirement 3.3)

- Adds `NavigationControl` with zoom buttons and compass
- Positioned at top-right corner of the map
- Enables both zoom and rotation controls

### 4. Map Load Event Handling (Requirement 3.4)

- Listens for the map 'load' event
- Sets `isMapLoaded` state to true when map finishes loading
- Logs success message to console
- Shows loading indicator until map is ready

### 5. Cleanup on Unmount (Requirement 3.5)

- Implements proper cleanup in useEffect return function
- Calls `map.remove()` to destroy the map instance
- Clears the map ref and resets loading state
- Prevents memory leaks

### 6. Error Handling (Requirement 10.2)

- Validates Mapbox token is configured before initialization
- Checks that map container ref is available
- Catches initialization errors and displays user-friendly messages
- Listens for map 'error' events and handles them gracefully
- Displays error UI with icon and descriptive message

## Component Structure

```tsx
MapRenderer
├── mapContainerRef (ref to DOM element)
├── mapRef (ref to Mapbox map instance)
├── isMapLoaded (state for tracking load status)
└── mapError (state for error messages)
```

## State Management

### Local State

- `isMapLoaded: boolean` - Tracks whether the map has finished loading
- `mapError: string | null` - Stores error messages for display

### Refs

- `mapContainerRef: RefObject<HTMLDivElement>` - Reference to the map container DOM element
- `mapRef: RefObject<mapboxgl.Map | null>` - Reference to the Mapbox map instance

## Error States

The component handles several error scenarios:

1. **Missing Mapbox Token**: Displays message to configure `VITE_MAPBOX_TOKEN`
2. **Container Not Available**: Displays message about missing container
3. **Initialization Failure**: Catches and displays initialization errors
4. **Map Load Errors**: Listens for map error events and displays appropriate messages

## UI States

### Loading State

- Displays a centered loading spinner with "Loading map..." text
- Shown until the map 'load' event fires
- Semi-transparent overlay over the map container

### Error State

- Displays a centered error card with:
  - Red error icon
  - "Map Error" heading
  - Descriptive error message
- Replaces the entire map container

### Loaded State

- Shows the fully interactive Mapbox map
- Navigation controls visible in top-right corner
- No loading overlay

## Usage Example

```tsx
import { MapRenderer } from "@/features/searchRoute/components";

function SearchPage() {
  return (
    <div className="h-screen">
      <MapRenderer />
    </div>
  );
}
```

## Dependencies

- `react` - useEffect, useRef, useState hooks
- `mapbox-gl` - Mapbox GL JS library
- `mapbox-gl/dist/mapbox-gl.css` - Mapbox styles
- `@/lib/mapbox` - Mapbox configuration utilities

## Environment Variables

Required environment variable:

```env
VITE_MAPBOX_TOKEN=pk.your_mapbox_token_here
```

## Next Steps

The MapRenderer component is ready for the next tasks:

- **Task 8.2**: Add route layer rendering logic
- **Task 8.3**: Implement map bounds adjustment
- **Task 8.4**: Integrate GeoJSON validation

The component exposes the map instance through `mapRef` which can be used by future enhancements to add route layers, markers, and other map features.

## Testing

To test the component:

1. Ensure `VITE_MAPBOX_TOKEN` is set in `frontend/.env.development`
2. Navigate to `/search` route (authenticated)
3. Verify the map loads successfully
4. Check that zoom and rotation controls work
5. Test error handling by removing the Mapbox token

## Files Created/Modified

### Created

- `frontend/src/features/searchRoute/components/MapRenderer.tsx` - Main component
- `frontend/src/routes/_authenticated/search.tsx` - Test route

### Modified

- `frontend/src/features/searchRoute/components/index.ts` - Added MapRenderer export

## Requirements Satisfied

✅ **Requirement 3.1**: Map initialization with Mapbox token  
✅ **Requirement 3.2**: Default center and zoom configuration  
✅ **Requirement 3.3**: Standard map controls (zoom, rotation)  
✅ **Requirement 3.5**: Cleanup on component unmount  
✅ **Requirement 10.2**: Error handling with user-friendly messages
