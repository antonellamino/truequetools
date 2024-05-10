const bookshelf = require('./db_connection');


const Usuario = bookshelf.model('Usuario', {
    tableName: 'usuarios',

    validarContrasena: async function(contrasena) { //ver si se deja
        return contrasena == this.get('contrasena');
    }
})

const Producto = bookshelf.model('Producto', {
    tableName: 'productos'
})

const Empleado = bookshelf.model('Empleado', {
    tableName: 'empleado',

    validarContrasena: async function(contrasena) { //ver si se deja
        return contrasena == this.get('contrasena');
    }
})

const Roles = bookshelf.model('Roles', {
    tableName: 'roles'
})

const Sucursal = bookshelf.model('Sucursal', {
    tableName: 'sucursales'
})

const Categoria = bookshelf.model('Categoria', {
    tableName: 'categorias'
})

module.exports = {
    Usuario,
    Empleado,
    Producto,
    Roles,
    Sucursal,
    Categoria
}