// Use knex to create a connection to the database
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
});

// User bookshelf with knex connection settings
const bookshelf = require('bookshelf')(knex);

// Read models to export
const models = {};
models.User = require('./User')(bookshelf);

// Export models
module.exports = {
    bookshelf,
    ...models
}