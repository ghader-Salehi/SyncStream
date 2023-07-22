import { randomUUID } from "crypto";
import EventEmitter from "events";

export class Client {
  id: string;
  room: string;
  token: string | null;
  socket: EventEmitter;

  constructor(room: string, id: string, socket: EventEmitter) {
    this.id = id;
    this.room = room;
    this.socket = socket;
  }
}
