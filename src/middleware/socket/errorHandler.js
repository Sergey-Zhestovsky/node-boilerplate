require('events').captureRejections = true;

const rejectHandler = (server, socket) => {
  socket[Symbol.for('nodejs.rejection')] = (error) => {};
};

const basicHandler = (server, socket) => {
  socket.on('error', (error) => {});
};

module.exports = [rejectHandler, basicHandler];
