import knexFile from '../../knexfile';
const knex = require('knex')(knexFile['development']);

export default knex;
