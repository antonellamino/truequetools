const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'basedatos1234',
        database: 'truequetools',
        charset: 'utf8'
    }
})
const bookshelf = require('bookshelf')(knex)


module.exports = bookshelf;