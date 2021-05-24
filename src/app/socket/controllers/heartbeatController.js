const { Server } = require('socket.io');

const HealthService = require('../../../services/HealthService');
const Room = require('../../utils/socket/room');
const SocketEvent = require('../../utils/socket/socket-event');

/**
 * @param {Server} server
 * @param {{ rooms: Object<string, Room>, events: Object<string, SocketEvent> }} ctx
 */
const heartbeatController = (server, { rooms, events }) => {
  server.on('connect', (socket) => {
    rooms.heartbeatRoom.join(socket);
    const heartbeatEvent = rooms.heartbeatRoom.Events.heartbeat;

    socket.on(heartbeatEvent.Name, async (payload) => {
      const response = await HealthService.getServerStatus(false);
      socket.emit(heartbeatEvent.Name, response);
    });
  });
};

module.exports = heartbeatController;
