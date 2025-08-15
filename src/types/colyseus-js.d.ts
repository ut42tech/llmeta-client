declare module "colyseus.js" {
  export interface Room<T = any> {
    id: string;
    name: string;
    sessionId: string;
    state: T;
    send(type: string | number, message?: any): void;
    leave(consented?: boolean): void;
    onLeave(cb: (code: number) => void): void;
  }

  export class Client {
    constructor(endpoint: string);
    joinOrCreate<T = any>(roomName: string, options?: any): Promise<Room<T>>;
  }

  export function getStateCallbacks(room: Room): any;
}
