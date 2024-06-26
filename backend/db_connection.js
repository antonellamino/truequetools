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

knex.raw('SELECT 1+1 as result')
    .then((response) => {
        console.log('Conexión exitosa:', response[0][0].result === 2 ? 'Sí' : 'No');
    })
    .catch((error) => {
        console.error('Error al conectar:', error);
    });

const bookshelf = require('bookshelf')(knex)


module.exports = bookshelf;