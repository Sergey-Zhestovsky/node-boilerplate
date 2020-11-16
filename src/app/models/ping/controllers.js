const pingController = (withTime) => {
  if (withTime) return { timeStamp: new Date() };
  return 'pong';
};

module.exports = {
  pingController,
};
