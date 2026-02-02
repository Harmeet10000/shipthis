# Route Comparison Panel Component

## Overview

The `RouteComparisonPanel` component displays a side-by-side comparison of route metrics for both the shortest and efficient routes. It subscribes to the route store and automatically updates when new route data is available.

## Features

- **Route Metrics Display**: Shows distance, duration, and CO₂ emissions for both routes
- **CO₂ Savings Calculation**: Calculates and highlights the difference in emissions
- **Visual Styling**: Uses color coding (red for shortest, green for efficient) to distinguish routes
- **Responsive Layout**: Adapts to different screen sizes with grid layout

## Usage

```tsx
import { RouteComparisonPanel } from "@/features/searchRoute/components";

function MyPage() {
  return (
    <div>
      <RouteComparisonPanel />
    </div>
  );
}
```

The component automatically subscribes to the route store and will only render when both routes are available.

## Helper Functions

### formatDistance(km: number): string

Formats distance in kilometers with one decimal place.

**Example:**

```typescript
formatDistance(12.5); // "12.5 km"
formatDistance(100.0); // "100.0 km"
```

### formatDuration(minutes: number): string

Formats duration in a human-readable format.

**Examples:**

```typescript
formatDuration(45); // "45 min"
formatDuration(90); // "1 hr 30 min"
formatDuration(120); // "2 hr"
formatDuration(125); // "2 hr 5 min"
```

### formatCO2(grams: number): string

Formats CO₂ emissions in grams with one decimal place.

**Example:**

```typescript
formatCO2(1234.5); // "1234.5 g"
formatCO2(500.0); // "500.0 g"
```

### calculateCO2Savings(shortestRoute: Route, efficientRoute: Route): number

Calculates the absolute difference in CO₂ emissions between two routes.

**Example:**

```typescript
const shortest = { co2_emissions: 1500 };
const efficient = { co2_emissions: 1200 };
calculateCO2Savings(shortest, efficient); // 300
```

## Sub-Components

### RouteMetricsCard

Displays metrics for a single route in a card format.

**Props:**

- `title: string` - The card title (e.g., "Shortest Route")
- `route: Route` - The route data to display
- `className?: string` - Optional additional CSS classes

## Styling

The component uses Tailwind CSS classes and follows the application's design system:

- **Shortest Route Card**: Red border and light red background
- **Efficient Route Card**: Green border and light green background
- **CO₂ Savings**: Green background when efficient route has lower emissions

## Requirements Satisfied

- **6.1**: Displays distance in kilometers for both routes
- **6.2**: Displays duration in minutes for both routes
- **6.3**: Displays CO₂ emissions in grams for both routes
- **6.4**: Calculates and displays CO₂ savings (absolute difference)
- **6.5**: Highlights CO₂ savings in green when efficient route has lower emissions

## Integration

The component is integrated into the search page alongside:

- `RouteCalculationForm` - For submitting route requests
- `MapRenderer` - For visualizing routes on a map

See `frontend/src/routes/_authenticated/search.tsx` for the complete integration.
