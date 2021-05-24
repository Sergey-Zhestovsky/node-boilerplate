const Room = require('../../utils/socket/room');
const HeartbeatEvent = require('../events/HeartbeatEvent');

class HeartbeatRoom extends Room {
  getName() {
    return 'ROOM::HEARTBEAT';
  }

  get Events() {
    return {
      heartbeat: new HeartbeatEvent(),
    };
  }
}

exports.HeartbeatRoom = HeartbeatRoom;
