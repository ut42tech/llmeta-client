/**
 * Player-related type definitions for the multiplayer experience
 */

/**
 * 3D vector as tuple [x, y, z]
 */
export type Vector3Tuple = [number, number, number];

/**
 * 3D position object with x, y, z coordinates
 */
export interface Vector3Object {
  x: number;
  y: number;
  z: number;
}

/**
 * Colyseus server-sent player state
 */
export interface ColyseusPlayerState {
  isXR?: boolean;
  isHandTracking?: boolean;
  isVisible?: boolean;
  position?: Vector3Object;
  rotation?: Vector3Object;
  leftHandPosition?: Vector3Object;
  leftHandRotation?: Vector3Object;
  rightHandPosition?: Vector3Object;
  rightHandRotation?: Vector3Object;
}

/**
 * Player pose data for rendering
 */
export interface PlayerPose {
  position: Vector3Tuple;
  rotation: Vector3Tuple; // Euler(YXZ) - head rotation, Z is fixed at 0
  leftHandPosition?: Vector3Tuple;
  leftHandRotation?: Vector3Tuple; // Euler(YXZ)
  rightHandPosition?: Vector3Tuple;
  rightHandRotation?: Vector3Tuple; // Euler(YXZ)
}

/**
 * Remote player data
 */
export interface RemotePlayerData {
  id: string;
  name: string;
  isXR: boolean;
  isHandTracking: boolean;
  position: Vector3Tuple; // head(world)
  rotation: Vector3Tuple; // head euler(YXZ)
  leftHandPosition?: Vector3Tuple;
  leftHandRotation?: Vector3Tuple;
  rightHandPosition?: Vector3Tuple;
  rightHandRotation?: Vector3Tuple;
}
