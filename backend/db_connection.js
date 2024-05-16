const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
<<<<<<< Updated upstream
        password: 'pass123',
=======
        password: 'basedatos1234',
>>>>>>> Stashed changes
        database: 'truequetools',
        charset: 'utf8'
    }
})
const bookshelf = require('bookshelf')(knex)


module.exports = bookshelf;