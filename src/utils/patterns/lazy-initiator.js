/**
 * Fundamental pattern
 *
 * @type {<T extends object>(Class: T) =>  T}
 */
const lazyInitiator = (Class) => {
  return new Proxy(Class, {
    construct: (Target, args) => {
      let initiated = false;
      let instance = {};

      const lazyInitiate = () => {
        if (!initiated) {
          instance = new Target(...args);
          initiated = true;
        }

        return instance;
      };

      return new Proxy(
        {},
        {
          get: (_, name) => {
            lazyInitiate();
            return instance[name];
          },

          set: (_, name, val) => {
            lazyInitiate();

            try {
              instance[name] = val;
              return true;
            } catch (error) {
              return false;
            }
          },

          has: (_, name) => {
            lazyInitiate();
            return instance[name] !== undefined;
          },

          preventExtensions: () => {
            lazyInitiate();

            try {
              Object.preventExtensions(instance);
              return true;
            } catch (error) {
              return false;
            }
          },

          deleteProperty: (_, name) => {
            lazyInitiate();

            try {
              delete instance[name];
              return true;
            } catch (error) {
              return false;
            }
          },

          defineProperty: (_, name, propertyDescriptor) => {
            lazyInitiate();
            return Object.defineProperty(instance, name, propertyDescriptor);
          },

          getOwnPropertyDescriptor: (_, name) => {
            lazyInitiate();
            return Object.getOwnPropertyDescriptor(instance, name);
          },
        }
      );
    },
  });
};

module.exports = lazyInitiator;
