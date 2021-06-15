/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

const rbac = require('../api/rbac');

const printRBAC = () => {
  const walk = (role, leftRange) => {
    const res = role.inherits.map((childRole) => {
      const childRes = walk(childRole, leftRange);
      leftRange = Math.max(childRes.leftRange, leftRange);
      return childRes;
    });

    const zone = { left: leftRange, right: leftRange };

    res.forEach(({ range }) => {
      if (zone.left > range.left) zone.left = range.left;
      if (zone.right < range.right) zone.right = range.right;
    });

    role.zone = zone;
    role.position = (zone.right + zone.left) / 2;
    console.log(role.descriptor, leftRange, res, role.zone, role.position);
    if (role.position > leftRange) leftRange = role.lastPositionInRow;
    return { range: zone, leftRange: leftRange };
  };

  walk(rbac.root, 0);

  // rbac.preOrderWalkTrough((role) => {
  //   console.log(role.descriptor, role.zone, role.position);
  // });

  const printLayers = (rolesLayer, iterator) => {
    let str = '';
    let lastPositionInRow = 0;
    const nextLayer = [];

    rolesLayer.forEach((role) => {
      const prefix = new Array(role.position - lastPositionInRow).fill('   ').join('');
      lastPositionInRow = role.position;
      str += `${prefix}(${iterator++})`;
      nextLayer.push(...role.inherits);
    });

    console.log(str);
    printLayers(nextLayer, iterator);
  };

  // printLayers([rbac.root]);
};

module.exports = printRBAC;
