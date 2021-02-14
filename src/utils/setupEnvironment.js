require('colors');

const { list: envVariables } = require('../data/env-variables.json');

const validateVariables = (configPath) => {
  require('dotenv').config({ path: configPath });

  const allVariables = {};
  const missedVariables = [];

  for (let variable of envVariables) {
    const pVariable = process.env[variable];

    if (pVariable === undefined) {
      missedVariables.push(pVariable);
    } else {
      allVariables[variable] = pVariable;
    }
  }

  process.initialEnvironmentConfig = { ...allVariables };
  if (missedVariables.length === 0) return true;

  const missingVariables = `'${missedVariables.join(`', '`)}'`;
  const errorMessage = `Wrong environment configuration, missing list of variables: ${missingVariables}.`;
  console.log();
  console.log(errorMessage);
  console.log();
  throw new Error(errorMessage);
};

module.exports = validateVariables;
