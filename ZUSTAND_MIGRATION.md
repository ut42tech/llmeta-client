# Zustand State Management Migration

## Overview

This document describes the migration of state management from React's built-in `useState` hooks to Zustand stores, following the project's convention that "Application-wide state uses Zustand stores."

## Changes Made

### New Zustand Stores Created

#### 1. `src/stores/xr-support.ts`
- **Purpose**: Manages XR support detection state
- **State**: `xrSupported` (boolean)
- **Actions**: 
  - `setXrSupported(supported: boolean)`: Manually set XR support status
  - `checkXrSupport()`: Async function to detect XR support

#### 2. `src/stores/current-user.ts`
- **Purpose**: Manages current user data from Supabase authentication
- **State**: 
  - `name` (string | null): User's display name
  - `image` (string | null): User's avatar URL
  - `isLoading` (boolean): Loading state
- **Actions**:
  - `fetchUserData()`: Async function to fetch user data from Supabase
  - `setName(name: string | null)`: Manually set user name
  - `setImage(image: string | null)`: Manually set user image

#### 3. `src/stores/realtime-presence.ts`
- **Purpose**: Manages Supabase Realtime presence state
- **State**:
  - `users` (Record<string, RealtimeUser>): Map of users in the room
  - `channel` (RealtimeChannel | null): Current Supabase channel
- **Actions**:
  - `subscribeToRoom(roomName, userName, userImage)`: Subscribe to a presence room
  - `unsubscribeFromRoom()`: Unsubscribe from current room
  - `setUsers(users)`: Manually set users map

### Hooks Updated

All hooks were updated to use the new Zustand stores while maintaining their original API, ensuring backward compatibility:

1. **`useXrSupport()`** - Now uses `useXrSupportStore`
2. **`useCurrentUserName()`** - Now uses `useCurrentUserStore`
3. **`useCurrentUserImage()`** - Now uses `useCurrentUserStore`
4. **`useRealtimePresenceRoom(roomName)`** - Now uses `useRealtimePresenceStore`

### Components Using These Hooks

No changes were required to components using these hooks, as the hook APIs remained the same:
- `src/app/lobby/page.tsx` - Uses `useXrSupport`
- `src/app/experience/page.tsx` - Uses `useXrSupport`
- `src/components/RealtimeAvatarStack.tsx` - Uses `useRealtimePresenceRoom`

## Benefits

1. **Centralized State**: Application-wide state is now centralized in Zustand stores
2. **Better Performance**: Zustand provides better performance with selective re-renders
3. **Easier Testing**: Stores can be tested independently from components
4. **State Sharing**: Multiple components can easily share the same state without prop drilling
5. **DevTools Support**: Zustand supports Redux DevTools for debugging
6. **Consistency**: All application-wide state now follows the same pattern

## Migration Pattern

The migration followed this pattern for each piece of state:

### Before (useState):
```typescript
export const useExample = () => {
  const [value, setValue] = useState(initialValue);
  
  useEffect(() => {
    // side effects
  }, []);
  
  return value;
};
```

### After (Zustand):
```typescript
// Store
export const useExampleStore = create((set) => ({
  value: initialValue,
  setValue: (value) => set({ value }),
  // async actions if needed
}));

// Hook
export const useExample = () => {
  const { value, asyncAction } = useExampleStore();
  
  useEffect(() => {
    asyncAction();
  }, [asyncAction]);
  
  return value;
};
```

## Notes

- Component-level state (like `isClient` in ExperiencePage) was intentionally left as `useState` as it's not application-wide state
- The hook APIs were preserved to ensure backward compatibility
- All existing tests should continue to work without modification
- Lint and format checks pass successfully
