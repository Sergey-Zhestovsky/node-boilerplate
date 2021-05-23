const { Server, Socket } = require('socket.io');

const { HeartbeatRoom } = require('./rooms');
const { heartbeatController } = require('./controller');

/**
 * @param {Server} server
 * @param {Socket} socket
 */
const heartbeatRouter = (server, socket) => {
  const heartbeatRoom = new HeartbeatRoom(socket);
  heartbeatRoom.join();

  socket.on(HeartbeatRoom.HeartbeatEvent, async (payload) => {
    const response = await heartbeatController(payload);
    socket.emit(HeartbeatRoom.HeartbeatEvent, response);
  });
};

module.exports = heartbeatRouter;
