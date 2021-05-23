class Room {
  static get RoomName() {
    return 'ROOM::GLOBAL';
  }

  constructor(socket, roomName = Room.RoomName) {
    this.socket = socket;
    this.roomName = roomName;
  }

  join() {
    this.socket.join(this.roomName);
  }

  toRoom() {
    return this.socket.to(this.roomName);
  }

  emit(message) {
    this.toRoom().emit(message);
  }

  leave() {
    this.socket.leave(this.roomName);
  }
}

module.exports = Room;
