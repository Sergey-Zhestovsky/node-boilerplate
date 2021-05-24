const SocketEvent = require('../../utils/socket/socket-event');

class HeartbeatEvent extends SocketEvent {
  get Name() {
    return 'heartbeat';
  }
}

module.exports = HeartbeatEvent;
