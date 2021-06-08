/**
 * @typedef {String} RoleDescriptor
 * @typedef {String} Action
 *
 * @typedef {Object} RoleSchema
 *   @property {RoleDescriptor} descriptor
 *   @property {string} name
 *   @property {RoleDescriptor[]} inherits
 *   @property {Action[]} actions
 */

/** @type {RoleSchema} */
exports.admin = {
  descriptor: 'ADMIN',
  name: 'admin',
  inherits: ['MODERATOR'],
  actions: ['admin_panel-bool'],
};

/** @type {RoleSchema} */
exports.moderator = {
  descriptor: 'MODERATOR',
  name: 'moderator',
  inherits: ['USER'],
  actions: ['moderator_panel-bool'],
};

/** @type {RoleSchema} */
exports.user = {
  descriptor: 'USER',
  name: 'user',
  inherits: null,
  actions: ['user-panel_bool'],
};
