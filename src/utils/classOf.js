const classOf = (entity, targetClass, constructorArgs) => {
  try {
    const instance = new entity(constructorArgs);
    return instance instanceof targetClass;
  } catch (error) {
    return false;
  }
};

module.exports = classOf;
