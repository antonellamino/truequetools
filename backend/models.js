const bookshelf = require('./db_connection');

const Usuario = bookshelf.model('Usuario', {
    tableName: 'usuarios',

    validarContrasena: async function(contrasena) { //ver si se deja
        return contrasena == this.get('contrasena');
    },

    notificaciones() {
        return this.hasMany('Notificacion', 'id_usuario');
    }
});

const Producto = bookshelf.model('Producto', {
    tableName: 'productos'
});

const Empleado = bookshelf.model('Empleado', {
    tableName: 'empleado',

    validarContrasena: async function(contrasena) { //ver si se deja
        return contrasena == this.get('contrasena');
    }
});

const Roles = bookshelf.model('Roles', {
    tableName: 'roles'
});

const Sucursal = bookshelf.model('Sucursal', {
    tableName: 'sucursales'
});

const Categoria = bookshelf.model('Categoria', {
    tableName: 'categorias'
});


const Notificacion = bookshelf.model('Notificacion', {
    tableName: 'notificaciones',
    idAttribute: 'id',
    usuario() {
        return this.belongsTo('Usuario', 'id_usuario');
    }
});

const Trueque = bookshelf.model('Trueque', {
    tableName: 'trueque',

    propietario() {
        return this.belongsTo('Usuario', 'id_propietario');
    },
    ofertante() {
        return this.belongsTo('Usuario', 'id_ofertante');
    },
    productoPropietario() {
        return this.belongsTo('Producto', 'id_producto_propietario');
    },
    productoOfertante() {
        return this.belongsTo('Producto', 'id_producto_ofertante');
    }
})

const Venta = bookshelf.model('Venta', {
    tableName: 'ventas' 
})

const Comentario = bookshelf.model('Comentario', {
    tableName: 'comentarios'
});


module.exports = {
    Usuario,
    Empleado,
    Producto,
    Roles,
    Sucursal,
    Categoria,
    Comentario,
    Notificacion,
    Trueque,
    Venta,
}
