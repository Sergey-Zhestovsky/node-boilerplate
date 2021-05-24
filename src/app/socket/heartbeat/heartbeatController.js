const { Server, Socket } = require('socket.io');

const { HeartbeatRoom } = require('./rooms');
const HealthService = require('../../../services/HealthService');
const Room = require('../../utils/socket/room');
const SocketEvent = require('../../utils/socket/socket-event');

/**
 * @param {Server} server
 * @param {Socket} socket
 * @param {{ rooms: Object<string, Room>, events: Object<string, SocketEvent> }} ctx
 */
const heartbeatController = (server, socket, ctx) => {
  const heartbeatRoom = new HeartbeatRoom(socket);
  heartbeatRoom.join();

  socket.on(HeartbeatRoom.HeartbeatEvent, async (payload) => {
    const response = await HealthService.getServerStatus(false);
    socket.emit(HeartbeatRoom.HeartbeatEvent, response);
  });
};

module.exports = heartbeatController;
