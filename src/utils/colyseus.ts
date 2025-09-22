import { Schema, type, MapSchema } from "@colyseus/schema";
import { colyseus } from "use-colyseus";

// Same as Server/src/rooms/MyRoom.ts

export enum MessageType {
  MOVE,
}
export class Vec3 extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;
}

export class Player extends Schema {
  @type(Vec3) position: Vec3 = new Vec3();
  @type(Vec3) rotation: Vec3 = new Vec3();
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
  MyRoomState
);
