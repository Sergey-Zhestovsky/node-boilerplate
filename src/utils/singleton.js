module.exports = (Class) => {
  let instance = null;

  return new Proxy(Class, {
    construct: (target, args) => {
      if (instance) return instance;
      instance = new target(...args);
      return instance;
    },
  });
};
