/* eslint-disable no-console */

require('colors');

const env = require('../data/env.json');

/**
 * Function that running scripts from src/scripts folder
 * @param {any[]} args - console arguments, last argument should be Node environment name.
 */
const run = async (args) => {
  const passedArgs = args.slice(2);
  const scriptName = passedArgs.splice(0, 1);
  const environment = passedArgs[passedArgs.length - 1];

  if (!scriptName) return console.log('Script name is required.');
  if (!environment) return console.log('Node environment is required.');

  if (!Object.values(env).includes(environment)) {
    return console.log(`Node environment should be one of '${Object.values(env).join(`', '`)}'.`);
  }

  require('./setup-environment')(`.env.${environment}`);
  const script = await require(`../scripts/${scriptName}`);

  if (!script) {
    return console.log(`Script with name: '${scriptName}' not found in src/scripts/ dir.`);
  }

  const result = await script();
  console.log(`${`Script result:`.cyan}\n${result}`);
  console.log();
  process.exit(0);
};

run(process.argv);
