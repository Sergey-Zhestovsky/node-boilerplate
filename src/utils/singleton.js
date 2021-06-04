module.exports = (Class) => {
  let instance = null;

  return new Proxy(Class, {
    construct: (Target, args) => {
      if (instance) return instance;
      instance = new Target(...args);
      return instance;
    },
  });
};
