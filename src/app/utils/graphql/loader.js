const fs = require('fs');
const path = require('path');

module.exports = (...pathArgs) => {
  const filePath = path.join(...pathArgs);
  return fs.readFileSync(filePath, 'utf-8');
};
