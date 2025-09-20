import { Schema, type, MapSchema } from "@colyseus/schema";
import { colyseus } from "use-colyseus";

// Same as Server/src/rooms/MyRoom.ts
export class Player extends Schema {
  // position
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;
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
  undefined
);
