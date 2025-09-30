# Project: LLM Metaverse Client

## Project Overview

This is a Next.js project for a metaverse experience, leveraging AI for new communication methods. It's built with React and TypeScript, using `@react-three/fiber` for 3D rendering and `colyseus.js` for real-time multiplayer functionality. The application supports both desktop and XR modes.

### Key Technologies:

- **Framework:** Next.js
- **Language:** TypeScript
- **3D Rendering:** `@react-three/fiber`, `@react-three/drei`
- **Multiplayer:** `colyseus.js`
- **UI:** Radix UI, Tailwind CSS
- **XR:** `@react-three/xr`

### Architecture:

- **`src/app`:** Contains the main application pages, including the home page (`/`), the main experience (`/experience`), and a VRM avatar preview page (`/vrm`).
- **`src/components`:** Reusable React components, organized by feature (e.g., `experience`, `main`, `player`, `vrm`).
- **`src/hooks`:** Custom React hooks for managing side effects, such as the Colyseus connection lifecycle (`useColyseusLifecycle.ts`).
- **`src/utils`:** Utility functions, including the Colyseus client setup (`colyseus.ts`).
- **`public`:** Static assets, including 3D models (`.glb`, `.vrm`) and fonts.

## Building and Running

### Development:

To run the development server:

```bash
yarn dev
```

This will start the application on [http://localhost:3000](http://localhost:3000).

To run the development server with HTTPS (required for some XR features):

```bash
yarn dev:https
```

### Production:

To build the application for production:

```bash
yarn build
```

To start the production server:

```bash
yarn start
```

### Linting:

To lint the codebase:

```bash
yarn lint
```

## Development Conventions

- **Styling:** The project uses Tailwind CSS for styling, with some components from Radix UI.
- **State Management:** Component-level state is managed with React hooks. Global state for the multiplayer experience is managed by Colyseus.
- **3D:** The 3D scenes are built with `@react-three/fiber` and `@react-three/drei`, following a declarative, component-based approach.
- **Multiplayer:** The connection to the Colyseus server is managed by the `useColyseusLifecycle` hook, which automatically connects and disconnects from the room.
