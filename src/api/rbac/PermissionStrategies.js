const Role = require('./Role');

/**
 * @typedef {String} RoleDescriptor
 */

class PermissionStrategies {
  static get Strategies() {
    return {
      'waterfall': 'waterfall',
      'grand-waterfall': 'grandWaterfall',
      'restrict': 'restrict',
      'fully-restrict': 'fullyRestrict',
    };
  }

  /**
   * @param {Role} roleRoot
   */
  constructor(roleRoot) {
    this.root = roleRoot;
  }

  /**
   *
   * @param {string} strategyName
   * @returns
   */
  getStrategy(strategyName) {
    const fnName = PermissionStrategies.Strategies[strategyName];
    if (!fnName) return () => false;
    return this[fnName].bind(this);
  }

  /**
   *
   * @param {RoleDescriptor} currentRole
   * @param {RoleDescriptor} targetRole
   */
  waterfall(currentRole, targetRole) {}

  /**
   *
   * @param {RoleDescriptor} currentRole
   * @param {RoleDescriptor} targetRole
   */
  grandWaterfall(currentRole, targetRole) {}

  /**
   *
   * @typedef {Object} RestrictOptions
   *  @property {RoleDescriptor[]} rolesRestriction
   *
   * @param {RoleDescriptor} currentRole
   * @param {RoleDescriptor} targetRole
   * @param {RestrictOptions} option
   */
  restrict(currentRole, targetRole, { rolesRestriction = [] }) {}

  /**
   *
   * @param {RoleDescriptor} currentRole
   * @param {RoleDescriptor} targetRole
   */
  fullyRestrict(currentRole, targetRole) {}
}

module.exports = PermissionStrategies;
