const Role = require('./Role');
const Action = require('./Action');
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

    this.initiated = false;
    this.synchronized = false;
  }

  /**
   * @typedef {Object} RoleSchema
   *   @property {string} descriptor
   *   @property {string} name
   *   @property {string[]} inherits
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
        .map((descriptor) => roleSchemas.find((r) => r.descriptor === descriptor) ?? null)
        .filter((v) => v !== null);

      rolesGraph.set(roleSchema, inheritance);
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
    const walkToBuildRoles = (role, metNodes) => {
      if (metNodes.includes(role.descriptor)) {
        throw new Error(`Role tree cannot be recursive, element: '${role.descriptor}' found twice`);
      }

      metNodes.push(role.descriptor);
      const inheritance = rolesGraph.get(role);
      let inherits = [];

      if (inheritance.length) {
        inherits = inheritance.map((roleSchema) => walkToBuildRoles(roleSchema, metNodes));
      }

      return new Role(null, role.descriptor, role.name, inherits, getActionsByList(role.actions));
    };

    const metNodes = [];
    this.root = walkToBuildRoles(root, metNodes);

    // metNodes might be unequal to roleSchemas[].descriptor
    if (metNodes.length !== roleSchemas.length) {
      logger.warn(
        `Looks like role tree has unresolved nodes. Resolved: ${
          metNodes.length
        }, unresolved: ${Math.abs(metNodes.length - roleSchemas.length)}`
      );
    }

    // normalize tree
    /**
     * @param {Role} role
     */
    const walkToNormalize = (role) => {
      if (role.)
    };

    this.roles = [];
    this.actions = [...actions.values()];
    this.initialize = true;
  }

  async synchronize() {
    if (!this.initialized) return;
    // ...
    this.synchronized = true;
  }

  /**
   * Walk through Role tree
   * @param {(Role) => void} callback
   */
  goTrough(callback) {}

  getAction(actinName) {}

  getRole(roleDescriptor) {}

  find() {}

  permitByRole(currentRole, targetRole) {}

  permitByAction(currentAction, targetAction) {}

  permitByStrategy(currentRole, strategy) {
    // waterfall
    // grand-waterfall
    // restrict
    // fully-restrict
  }
}

module.exports = Controller;
