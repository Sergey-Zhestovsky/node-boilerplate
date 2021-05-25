# Node boilerplate

Boilerplate for Node.js server side using pure js.

**Note:** Before using this boilerplate add particular lines to **.gitignore** file:

```.gitignore
.env*
!.env.example
```

Consider using [degit](https://www.npmjs.com/package/degit) to clone repository without **.git** folder.

    $ npm install -g degit

## Features

List of basic features:

- REST setup with middleware, routers, controllers, DTOs
- configured swagger
- socket setup with controllers, rooms and events
- implemented basic middleware for REST and socket
- logger setup
- client and server error classes and error handlers
- `.env` environment setup with `development`, `production` and `test` modes
- basic tests setup
- eslint & prettier configuration

## Modules

List of main modules used in this boilerplate:

- Express
- Socket.io
- Joi
- Winston

## Scripts

To run server in `development` mode:

    $ npm run dev

To run server in `production` mode:

    $ npm run prod

To run tests:

    $ npm run test

## Folder and file structure

Folder & file structure and philosophy behind it (in /src folder):

- **/api** -
  - **/classes** -
  - **/database** -
- **/app** -
  - **/graphql** -
    - **/<entity-name\>**
      - **/resolvers.js**
      - **/types.graphql**
  - **/routers** -
    - **/<entity-name\>**
      - **/controllers.js**
      - **/dto.js**
      - **/routes.js**
      - **/swagger.yaml**
  - **/socket** -
- **/config** -
- **/data** -
- **/libs** -
- **/loaders** -
- **/middleware** -
- **/scripts** -
- **/services** -
- **/tests** -
- **/utils** -

Main files:

- **express.js** -
- **servers.js** -
