/**
 * User and UI-related type definitions
 */

/**
 * Realtime user information for presence tracking
 */
export interface RealtimeUser {
  id: string;
  name: string;
  image: string;
}

/**
 * Avatar information for display
 */
export interface AvatarInfo {
  name: string;
  image: string;
}
