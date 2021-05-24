const Room = require('../../utils/socket/room');

class HeartbeatRoom extends Room {
  static get RoomName() {
    return 'ROOM::HEARTBEAT';
  }

  static get Events() {
    return {
      heartbeat: 'heartbeat',
    };
  }

  constructor(socket) {
    super(socket, HeartbeatRoom.RoomName);
  }
}

exports.HeartbeatRoom = HeartbeatRoom;
