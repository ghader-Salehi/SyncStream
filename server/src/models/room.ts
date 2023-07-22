enum RoomType {
  "TEMPORARY",
  "PERMANENT",
}

export class Room {
  id: string;
  name: string;
  title: string;
  type: RoomType;
  adminId: String;
  users: [];

  constructor(name: string, title = "", type: number, adminId: string) {
    this.id = "";
    this.name = name;
    this.title = "";
    this.type = 0;
    this.adminId = "";
  }
}
