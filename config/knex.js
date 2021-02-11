const environment = process.env.NODE_ENV || 'local';
const knexConfig = require('../knexfile');
const environmentConfig = knexConfig[environment];
const knex = require('knex');
// console.log(environment, environmentConfig);
const connection = knex(environmentConfig);

module.exports = connection;