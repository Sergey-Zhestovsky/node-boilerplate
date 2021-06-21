const Role = require('./Role');
const Action = require('./Action');
const PermissionStrategies = require('./PermissionStrategies');
const roleSchemaConfig = require('../../config/roles.config');
const logger = require('../../libs/Logger');

class Controller {
  constructor() {
    /** @type {Role | null} */
    this.root = null;
    /** @type {Role[]} */
    this.roles = [];
    /** @type {Action[]} */
    this.actions = [];

    this.permissionStrategies = new PermissionStrategies(this.root);

    this.initiated = false;
    this.synchronized = false;
  }

  /**
   * @typedef {Object} RoleSchema
   *   @property {string} descriptor
   *   @property {string} name
   *   @property {string[] | null} inherits
   *   @property {string[]} actions
   *
   * @param {Object<string, RoleSchema>} roleSchemasObj
   */
  initialize(roleSchemasObj = roleSchemaConfig) {
    const roleSchemas = Object.values(roleSchemasObj);
    /** @type {Map<string, Action} */
    const actions = new Map();
    /** @type {Map<RoleSchema, RoleSchema[]} */
    const rolesGraph = new Map();
    /** @type {Map<string, Role[]} */
    const rolesMap = new Map();
    /** @type {RoleSchema | null} */
    let root = null;

    const getActionsByList = (list) => {
      return list.map((a) => actions.get(a)).filter((v) => v);
    };

    // create graph structure from roles
    roleSchemas.forEach((roleSchema) => {
      if (rolesGraph.has(roleSchema)) return;

      roleSchema.actions.forEach((action) => {
        if (!actions.has(action)) actions.set(action, new Action(null, action));
      });

      const inheritance = roleSchema.inherits
        ?.map((descriptor) => roleSchemas.find((r) => r.descriptor === descriptor) ?? null)
        .filter((v) => v !== null);

      rolesGraph.set(roleSchema, inheritance ?? []);
    });

    // get root element from graph
    let tempForRoot = [...roleSchemas];
    rolesGraph.forEach((val) => {
      tempForRoot = tempForRoot.filter((tRoom) => !val.includes(tRoom));
    });

    if (tempForRoot.length > 1) throw new Error('Role tree cannot be with more than one root');
    if (tempForRoot.length === 0) throw new Error('Role tree should have one root');
    root = tempForRoot[0];

    // walk through tree recursively from the root
    /**
     * @param {RoleSchema} role
     * @param {string[]} metNodes
     * @returns {Role}
     */
    const walkToBuildRoles = (role, metNodes, unstackArray = []) => {
      if (metNodes.includes(role.descriptor)) {
        throw new Error(`Role tree cannot be recursive, element: '${role.descriptor}' found twice`);
      }

      metNodes.push(role.descriptor);
      unstackArray.push(role.descriptor);
      const inheritance = rolesGraph.get(role);
      let inherits = [];

      if (inheritance.length) {
        inherits = inheritance
          .map((roleSchema) => {
            if (rolesMap.has(roleSchema.descriptor)) return null;
            return walkToBuildRoles(roleSchema, metNodes, unstackArray);
          })
          .filter((v) => v !== null);
      }

      const index = unstackArray.indexOf(role.descriptor);
      unstackArray.splice(index, 1);
      const res = new Role(
        null,
        role.descriptor,
        role.name,
        inherits,
        getActionsByList(role.actions)
      );
      rolesMap.set(res.descriptor, res);
      return res;
    };

    const metNodes = [];
    this.root = walkToBuildRoles(root, metNodes);
    this.permissionStrategies.root = this.root;

    // metNodes might be unequal to roleSchemas[].descriptor
    if (metNodes.length !== roleSchemas.length) {
      logger.warn(
        `Looks like role tree has unresolved nodes. Resolved: ${
          metNodes.length
        }, unresolved: ${Math.abs(metNodes.length - roleSchemas.length)}`
      );
    }

    this.roles = [...rolesMap.values()];
    this.actions = [...actions.values()];
    this.initialize = true;
  }

  async synchronize() {
    if (!this.initialized) return;
    // TODO: connect and synchronize with db
    // Rules: if action changed, added or removed - synchronize;
    // if role added - synchronize;
    // if role changed or removed - if role did not used: accept otherwise reject.
    // Also, set `synchronized` for every role and action.
    this.synchronized = true;
  }

  /**
   * Pre-order walk through Role tree
   * @param {(role: Role) => void} callback
   */
  preOrderWalkTrough(callback) {
    this.root.preOrderWalk(callback);
  }

  /**
   * Post-order walk through Role tree
   * @param {(role: Role) => void} callback
   */
  postOrderWalkTrough(callback) {
    this.root.postOrderWalk(callback);
  }

  /**
   * Get action by name
   * @param {string} actinName
   * @returns {Action | null}
   */
  getAction(actinName) {
    return this.actions.find((a) => a.name === actinName) ?? null;
  }

  /**
   * Get role by name
   * @param {string} roleDescriptor
   * @returns {Role | null}
   */
  getRole(roleDescriptor) {
    return this.roles.find((r) => r.descriptor === roleDescriptor) ?? null;
  }

  /**
   * Check for permission of `current role` relative to `target role` based of inheritance tree.
   * For example, if `current role` inherits `target role` then permission accepted.
   * Otherwise, if `target role` inherits `current role` then `current role` stays lover in tree and
   *  permission will be denied.
   * @param {Role | string} currentRole
   * @param {Role | string} targetRole
   * @returns {boolean}
   */
  permitByRole(currentRole, targetRole) {
    const cRole = typeof currentRole === 'string' ? this.getRole(currentRole) : currentRole;
    const tRole = typeof targetRole === 'string' ? this.getRole(targetRole) : targetRole;
    if (!cRole || !tRole) return false;
    return cRole.include(tRole);
  }

  /**
   * Can `current role` access particular action.
   * @param {Role | string} currentRole
   * @param {Action | string} action
   * @returns {boolean}
   */
  permitByAction(currentRole, action) {
    const cRole = typeof currentRole === 'string' ? this.getRole(currentRole) : currentRole;
    const cAction = typeof action === 'string' ? this.getAction(action) : action;
    if (!cRole || !cAction) return false;
    return cRole.can(cAction);
  }

  /**
   * Check for user permission based on permission strategies.
   * @param {string} strategy
   * @param {Role | string} currentRole
   * @param {Role | string} targetRole
   * @param {any} options
   */
  permitByStrategy(strategy, currentRole, targetRole, options) {
    const cRole = typeof currentRole === 'string' ? currentRole : currentRole.descriptor;
    const tRole = typeof targetRole === 'string' ? targetRole : targetRole.descriptor;
    return this.permissionStrategies.getStrategy(strategy)(cRole, tRole, options);
  }
}

module.exports = Controller;
