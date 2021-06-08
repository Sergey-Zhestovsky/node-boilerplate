const Action = require('./Action');

class Role {
  /**
   * @param {string} [id]
   * @param {string} descriptor
   * @param {string} name
   * @param {Role} [inherits]
   * @param {Action[]} [actions]
   */
  constructor(id, descriptor, name, inherits, actions) {
    /** @type {string | null} */
    this.id = id ?? null;
    /** @type {string} */
    this.descriptor = descriptor;
    /** @type {string} */
    this.name = name;
    /** @type {Role | null} */
    this.inherits = inherits ?? null;
    /** @type {Action[]} */
    this.actions = actions ?? [];
  }

  get Synchronized() {
    return this.id !== null;
  }

  /**
   * Find and return provided role in the tree
   * @param {Role | string} role
   * @returns {Role | null}
   */
  find(role) {}

  /**
   * If current role contains provided role in the tree
   * @param {Role | string} role
   * @returns {boolean}
   */
  contain(role) {}

  /**
   * If current role equals or contains provided role in the tree
   * @param {Role | string} role
   * @returns {boolean}
   */
  include(role) {}

  /**
   * Check if role has permissions for particular action
   * @param {Action | string} action
   * @returns {boolean}
   */
  can(action) {}

  /**
   * Allies to `can` method
   * @param {Action | string} action
   * @returns {boolean}
   */
  hasPrivilege(action) {
    return this.can(action);
  }
}

module.exports = Role;
