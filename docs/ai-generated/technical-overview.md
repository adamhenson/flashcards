# Flashcards App - Technical Documentation

## Architecture Overview

The flashcards app is built with Next.js 15 using the App Router pattern. It's a client-side application that stores user preferences in localStorage and displays flashcards in a smooth slideshow format.

## Key Components

### Pages

- **`/` (Home/Config)**: Configuration page where users select their collection, interval, and color palette
- **`/slideshow`**: The main slideshow page that displays flashcards with cross-fade animations

### Data Structure

Flashcard collections are stored as JSON files in `/apps/frontend/data/`. Each collection follows this structure:

```typescript
{
  "name": "Collection Name",
  "items": [
    {
      "main": "Word (pronunciation) – type",
      "subs": [
        "Definition.",
        "a) Example sentence.",
        "b) Another example sentence."
      ]
    }
  ]
}
```

### Color Palettes

Three predefined color palettes are available:
- **Earth Tones**: Natural, warm colors
- **Ocean Blues**: Cool blues with warm accents
- **Midnight**: Dark, moody tones (all with white text)

Colors are randomly selected from the chosen palette for each flashcard transition.

### State Management

User configuration is persisted to `localStorage` with the key `flashcards_config`. This includes:
- Selected collection name
- Interval duration in seconds
- Chosen color palette theme

## Animation System

The slideshow uses CSS opacity transitions for smooth cross-fade effects:

1. Current card is displayed with `opacity: 1`
2. When transitioning, next card is rendered on top with `opacity: 1`
3. Current card fades to `opacity: 0` over 1 second
4. After transition, next card becomes current card
5. Process repeats based on user-defined interval

## Type Safety

All data structures are fully typed with TypeScript:
- `FlashcardItem`: Individual card structure
- `FlashcardCollection`: Complete collection with metadata
- `SlideshowConfig`: User configuration
- `ColorPalette`: Color palette definition

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev:web

# Type check
npm run typecheck

# Lint and format
npm run lint
npm run format

# Build for production
npm run build
```

## Deployment

The app is designed for Vercel deployment. Simply connect your GitHub repository to Vercel and it will automatically deploy on push to main.

### Vercel Configuration

No special configuration is needed. The app will be built using:
- Build command: `npm run build --workspace @hensonism/flashcards`
- Output directory: `apps/frontend/.next`
- Install command: `npm install`

## Future Enhancements

Potential improvements could include:
- Custom flashcard creation interface
- Import/export functionality for collections
- Analytics tracking for word retention
- Audio pronunciation support
- Spaced repetition algorithms
- Dark/light mode toggle
- Keyboard shortcuts for navigation

