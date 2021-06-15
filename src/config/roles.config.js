/**
 * @typedef {String} RoleDescriptor
 * @typedef {String} Action
 *
 * @typedef {Object} RoleSchema
 *   @property {RoleDescriptor} descriptor
 *   @property {string} name
 *   @property {RoleDescriptor[] | null} inherits
 *   @property {Action[]} actions
 */

/** @type {RoleSchema} */
exports.superUser = {
  descriptor: 'SUPER_USER',
  name: 'admin',
  inherits: ['ADMIN', 'STUFF'],
  actions: ['admin_panel-bool'],
};

/** @type {RoleSchema} */
exports.admin = {
  descriptor: 'ADMIN',
  name: 'admin',
  inherits: ['MODERATOR', 'STUFF'],
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
exports.stuff = {
  descriptor: 'STUFF',
  name: 'admin',
  inherits: ['PRE_STUFF'],
  actions: ['admin_panel-bool'],
};

/** @type {RoleSchema} */
exports.user = {
  descriptor: 'USER',
  name: 'user',
  inherits: ['ANON_USER'],
  actions: ['user-panel_bool'],
};

/** @type {RoleSchema} */
exports.anonUser = {
  descriptor: 'ANON_USER',
  name: 'user',
  inherits: null,
  actions: ['user-panel_bool'],
};

/** @type {RoleSchema} */
exports.preStuff = {
  descriptor: 'PRE_STUFF',
  name: 'admin',
  inherits: ['PRE_PRE_STUFF', 'PRE_POST_STUFF'],
  actions: ['admin_panel-bool'],
};

/** @type {RoleSchema} */
exports.prePreStuff = {
  descriptor: 'PRE_PRE_STUFF',
  name: 'admin',
  inherits: null,
  actions: ['admin_panel-bool'],
};

/** @type {RoleSchema} */
exports.prePostStuff = {
  descriptor: 'PRE_POST_STUFF',
  name: 'admin',
  inherits: null,
  actions: ['admin_panel-bool'],
};
