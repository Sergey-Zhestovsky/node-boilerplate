const SocketEvent = require('../../utils/socket/SocketEvent');

class HeartbeatEvent extends SocketEvent {
  get Name() {
    return 'heartbeat';
  }
}

module.exports = HeartbeatEvent;
