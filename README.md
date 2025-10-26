# Flashcards

A simple yet elegant slideshow application for displaying flashcards. The app cycles through randomized flashcards with smooth cross-fade animations and customizable color palettes.

## Features

- 📚 **Multiple Collections**: Choose from various flashcard collections including:
  - Fancy Words Generic
  - Fancy Words AI
  - Fancy Words Software Engineers
  - Fancy Words System Design and Architecture

- 🎨 **Color Palettes**: Three beautiful color themes:
  - Tropical Sunset Vibes
  - Sunny Beach Retro Vibes
  - Rich Earthy Jewel

- ⏱️ **Customizable Timing**: Set your preferred interval (in seconds) between flashcards

- ⏸️ **Playback Controls**: Pause/resume the slideshow at any time

- 💾 **Persistent Configuration**: Your settings are saved automatically

- 📱 **Responsive Design**: Works beautifully on any screen size

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **Biome** - Fast linting and formatting
- **Husky** - Pre-commit hooks

## Getting Started

### Prerequisites

- Node.js 22.20.0
- npm 10.9.2

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev:web
```

Visit `http://localhost:3000` to start using the app.

### Building for Production

```bash
# Build the app
npm run build

# Type check
npm run typecheck
```

## How It Works

1. **Configure**: Choose your flashcard collection, set the interval timing, and pick a color palette
2. **Start**: Click "Start Slideshow" to begin
3. **Enjoy**: Watch as flashcards smoothly transition with cross-fade animations
4. **Control**: Use the Pause/Resume button or Exit to return to configuration

## Deployment

This app is designed to be deployed on Vercel:

```bash
vercel deploy
```

## Project Structure

```
apps/frontend/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Configuration page
│   ├── slideshow/         # Slideshow page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── data/                   # Flashcard collection JSON files
├── lib/                    # Utility functions
│   ├── collections.ts     # Collection management
│   ├── palettes.ts        # Color palette definitions
│   └── storage.ts         # LocalStorage utilities
└── types/                  # TypeScript type definitions
```

## License

Private
