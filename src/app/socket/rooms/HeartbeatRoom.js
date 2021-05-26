const Room = require('../../utils/socket/Room');
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

module.exports = HeartbeatRoom;
