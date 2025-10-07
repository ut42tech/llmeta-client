import { Schema, type, MapSchema } from "@colyseus/schema";
import { colyseus } from "use-colyseus";

// Same as Server/src/rooms/MyRoom.ts
export enum MessageType {
  CHANGE_PROFILE,
  MOVE,
}

export type ProfileData = {
  isXR?: boolean;
  isHandTracking?: boolean;
};

export type MoveData = {
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  leftHandPosition?: { x: number; y: number; z: number };
  leftHandRotation?: { x: number; y: number; z: number };
  rightHandPosition?: { x: number; y: number; z: number };
  rightHandRotation?: { x: number; y: number; z: number };
};

export class Vec3 extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;
}

export class Player extends Schema {
  @type("boolean") isXR: boolean = false;
  @type("boolean") isHandTracking: boolean = false;
  @type(Vec3) position: Vec3 = new Vec3();
  @type(Vec3) rotation: Vec3 = new Vec3();
  @type(Vec3) leftHandPosition: Vec3 = new Vec3();
  @type(Vec3) leftHandRotation: Vec3 = new Vec3();
  @type(Vec3) rightHandPosition: Vec3 = new Vec3();
  @type(Vec3) rightHandRotation: Vec3 = new Vec3();
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

// here is where we create the colyseus client and hooks
export const {
  client,
  connectToColyseus,
  disconnectFromColyseus,
  useColyseusRoom,
  useColyseusState,
} = colyseus<MyRoomState>(
  process.env.NEXT_PUBLIC_SERVER_ENDPOINT || "http://localhost:2567",
  MyRoomState,
);
