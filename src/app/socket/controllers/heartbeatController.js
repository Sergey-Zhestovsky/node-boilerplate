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
    /**
     * Part of proactive action with `socket`.
     * There can be actions with `server` so controllers should be placed
     * in server creation level.
     * This controller actions can depends on several conditions, like:
     * - `socket` state & `socket` actions;
     * - `node server` state & `node server` actions.
     *
     * E.g.:
     * if (product.stock === 0) {
     *   rooms.productRoom.to(product.id).emit('Product out of stock');
     * }
     *
     * E.g.:
     * socket.user.meeting.state.changes() =>
     * if (socket.user.meeting.state === 'INACTIVE') {
     *   rooms.meetingRoom
     *     .to(socket, socket.user.meeting.id)
     *     .emit('user inactive', socket.user.id);
     * }
     */
    rooms.heartbeatRoom.join(socket);
    const heartbeatEvent = rooms.heartbeatRoom.Events.heartbeat;

    /**
     * Part of reactive action with `socket`.
     * This event is global and nothing to do with room joining.
     * Therefore rooms should not have Events object `Object<string, SocketEvent>`.
     * 
     * There is a need to create SocketHandler class that implements handle()
     * method for handling event. Event to handle stored in SocketHandler.Event ?.
     * Also, need to create SocketHandlerConstructor to construct SocketHandler-s
     * with `server` & `socket` object.
     * 
     * E.g. 
     * const socketHandlers = new SocketHandlerConstructor(server: io.Server, handlers: SocketHandler[]);
     * socketHandlers.inject(socket: Socket);
     * 
     * SocketHandler.handle(server: Server, socket: Socket, payload: any);
     * looks like payload before handling needs validation.
     * Validation can be done in SocketHandler:
     * SocketHandler.validate(payload: any): boolean?;
     * 
     * If payload valid => 
     *   create DTO ?
     * If payload invalid =>
     *   return error object. (What happens if validator throws error ?)
     */
    socket.on(heartbeatEvent.Name, async (payload) => {
      const response = await HealthService.getServerStatus(false);
      socket.emit(heartbeatEvent.Name, response);
    });

    /**
     * Ctx object is excessive ?!
     * Creating Rooms and Events on spot.
     * ! Rooms needs `server` object.
     * 
     * ? Therefore rooms & events should be imported directly from controllers and
     * handlers. Controllers have access to `server` & `socket` objects as well as
     * handlers.
     */

    /**
     * Should be any rooms events from client?
     * Like if client joined `room:product` then he can emit events `room:product:<name-of-event>`
     * and receive events `room:product:<name-of-event>`.
     * 
     * Implementation: 
     * Emit to users in room:
     * server.to('room:product').emit('room:product:<name-of-event>');
     * Emit to user if in room:
     * if (socket.rooms.has('room:product')) {
     *   socket.emit('room:product:<name-of-event>')
     * }
     * 
     * Looks like rooms have own set of events.
     * Therefore, there are 2 types of events: `global` & `local`.
     * ???
     */
  });
};

module.exports = heartbeatController;
