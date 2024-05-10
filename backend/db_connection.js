const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'pass123',
        database: 'truequetools',
        charset: 'utf8'
    }
})
const bookshelf = require('bookshelf')(knex)


module.exports = bookshelf;