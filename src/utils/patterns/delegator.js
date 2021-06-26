/**
 * Fundamental pattern
 *
 * @example
 * ``` js
 *  class A {
 *    foo() { return 24; }
 *  }
 *
 *  class B {
 *    foo() { return 42; }
 *  }
 *
 *  const a = new A();
 *  const b = new B();
 *
 *  const delegator = new Delegator({ a, b }, a);
 *  delegator.foo(); // 24
 *  delegator.switch(b); // or delegator.switch('b');
 *  delegator.foo(); // 42
 * ```
 */
class Delegator {
  constructor(delegationMap, current) {
    this.delegationMap = delegationMap;
    this.current = current;
  }

  switch(current) {
    if (typeof current === 'string') this.current = this.delegationMap[current];
    else this.current = current;
  }
}

module.exports = new Proxy(Delegator, {
  construct: (Target, args) => {
    const instance = new Target(...args);

    const proxyHandler = {
      get: function (target, name) {
        if (name === 'switch') return target.switch.bind(target);
        return target.current[name].bind(target.current);
      },
    };

    return new Proxy(instance, proxyHandler);
  },
});
