const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { Usuario, Sucursal, Producto, Categoria, Empleado, Comentario, Notificacion, Trueque, Venta } = require('./models');


// Configuración de Bookshelf
//Model.knex(knex);

// Configuración de Express
const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));





// endpoint para registrar un usuario cliente
//luego del registro se tiene que redirigir al login
app.post('/registro-cliente', async (req, res) => {
    try {
        // extraer los datos del cuerpo de la solicitud
        const { nombre, apellido, correo, fecha_nacimiento, sucursal_preferencia, contrasena } = req.body;

        //verificar si ya existe un usuario con el mismo correo
        let usuarioExistente;

        try {
            console.log(correo);
            usuarioExistente = await Usuario.where({ correo }).fetch({ require: false });
            console.log(usuarioExistente);
        } catch (error) {
            console.error('Error al buscar usuario existente:', error);
            usuarioExistente = null;
            //return res.status(500).json({ error: 'Error interno del servidor al buscar usuario existente' });
        }
        if (usuarioExistente !== null) {
            return res.status(400).json({ error: 'Ya existe un usuario con este correo electrónico' });
        }

        // crear un nuevo usuario utilizando el model Usuario
        const nuevoUsuario = await Usuario.forge({
            nombre,
            apellido,
            correo,
            fecha_nacimiento,
            sucursal_preferencia,
            rol_id: 3,
            contrasena
        }).save();

        // devolver una respuesta de éxito
        res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario: nuevoUsuario });
    } catch (error) {
        // respuesta si hay error
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor al registrar el usuario' });
    }
});


// endpoint para iniciar sesion cliente
// borrar los logs
//no anda cuando el email es invalido pero la contrasena correcta
app.post('/iniciar-sesion-cliente', async (req, res) => {

    const { correo, contrasena } = req.body;

    try {
        let usuario;
        try {
            usuario = await Usuario.where({ correo }).fetch({ require: false });
        } catch (fetchError) {
            console.error("Error al buscar el usuario:", fetchError);
        }

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        let contrasenaValida;
        try {
            contrasenaValida = await usuario.validarContrasena(contrasena);
        } catch (passwordError) {
            return res.status(500).send('Error Interno del Servidor');
        }

        if (!contrasenaValida) {
            return res.status(401).json({ error: 'Contraseña invalida' });
        }

        // Generar token JWT
        const token = jwt.sign({
            id: usuario.get('id'),
            correo: usuario.get('correo'),
            rol_id: usuario.get('rol_id')
        }, 'secreto', { expiresIn: '1h' });

        const userId = usuario.get('id');
        const rol_id = usuario.get('rol_id');
        console.log("Token generado:", token);

        // Responder con éxito
        return res.status(200).json({ mensaje: 'Inicio de sesión exitoso', token, userId, rol_id });

    } catch (error) {
        return res.status(500).send('Error Interno del Servidor');
    }
});


const multer = require('multer');
const upload = multer();
app.post('/publicarProducto', upload.array('foto', 4), async (req, res) => {
    try {
        const { nombre, descripcion, sucursal_elegida, categoria_id, usuario_id } = req.body;
        const imagenes = req.files;

        // Array para almacenar las imágenes en base64
        let imagenesBase64 = [];
        // Recorrer cada imagen y convertirla en base64
        for (let i = 0; i < imagenes.length; i++) {
            const imagenBase64 = imagenes[i].buffer.toString('base64');
            imagenesBase64.push(imagenBase64);
        }


        // Guardar el producto con las imágenes en la base de datos
        const nuevoProducto = await Producto.forge({
            nombre,
            descripcion,
            sucursal_elegida,
            categoria_id,
            usuario_id,
            imagen_1: imagenesBase64[0], // Spread operator para agregar las imágenes al objeto
            imagen_2: imagenesBase64[1],
            imagen_3: imagenesBase64[2],
            imagen_4: imagenesBase64[3]

        });

        console.log("datos", nuevoProducto);

        await nuevoProducto.save();

        return res.status(201).json({ mensaje: 'Producto creado exitosamente' });

    } catch (error) {
        console.error('Error al registrar el producto:', error);
        return res.status(500).json({ error: 'No se pudo registrar el producto' });
    }
});





//solo admin
app.post('/agregar-sucursal', async (req, res) => {
    try {

        const { nombre, direccion, telefono } = req.body;
        const existingSucursal = await Sucursal.where({ nombre }).fetch({ require: false });
        if (existingSucursal) {
            return res.status(400).json({ error: `La sucursal ya existe` });
        }

        const nuevaSucursal = await Sucursal.forge({
            nombre,
            direccion,
            telefono
        })
        await nuevaSucursal.save();



        res.status(201).json({ mensaje: 'Sucursal creada exitosamente', sucursal: nuevaSucursal });
    } catch (error) {
        console.error('error al registrar la sucursal:', error);
        res.status(500).json({ error: 'no se pudo registrar la sucursal' });
    }
});


app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.fetchAll();
        res.json({ usuarios });
    } catch (error) {
        console.error('error al obtener los usuarios:', error);
        res.status(500).json({ error: 'ocurrio un error al obtener las sucursales' });
    }
});



//solo admin
app.get('/sucursales', async (req, res) => {
    try {
        const sucursales = await Sucursal.fetchAll();
        res.json({ sucursales });
    } catch (error) {
        console.error('error al obtener las sucursales:', error);
        res.status(500).json({ error: 'ocurrio un error al obtener las sucursales' });
    }
});


//solo admin
app.get('/categorias', async (req, res) => {
    try {
        const categorias = await Categoria.fetchAll();
        res.json({ categorias });
    } catch (error) {
        console.error('error al obtener las categorias:', error);
        res.status(500).json({ error: 'ocurrio un error al obtener las categorias' });
    }
});



//ver productos para intercambiar
app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.fetchAll();
        res.json({ productos });
    } catch (error) {
        console.error('error al obtener los productos:', error);
        res.status(500).json({ error: 'ocurrio un error al obtener los productos' });
    }
})


//ver productos de un usuario especifico
app.get('/productos-usuario', async (req, res) => {
    try {
        const { usuarioId } = req.query;

        //verifica si usuarioID esta presente, si no la solicitud deberia fallar porque es un parametro requerido
        if (!usuarioId) {
            return res.status(400).json({ error: 'usuarioId es requerido' });
        }

        const productos = await Producto.where({ usuario_id: usuarioId }).fetchAll();

        res.json({ productos });

    } catch (error) {
        console.error('error al obtener los productos:', error);
        res.status(500).json({ error: 'ocurrio un error al obtener los productos' });
    }
});







//prueba
// Importar Bookshelf y el modelo de usuario
// Endpoint para obtener información de usuarios por ids, devuelve el correo, con el id
app.post('/usuarios', async (req, res) => {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds)) {
        return res.status(400).json({ error: 'Se esperaba una matriz de IDs de usuario' });
    }

    try {
        const usuariosEncontrados = await Usuario.where('id', 'in', userIds).fetchAll();

        if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
            return res.status(404).json({ error: 'No se encontraron usuarios para los IDs proporcionados' });
        }

        const usuariosInfo = usuariosEncontrados.map(usuario => ({
            id: usuario.get('id'),
            correo: usuario.get('correo')
        }));
        console.log(usuariosInfo);

        res.json({ usuarios: usuariosInfo }); // Devolver el objeto con la información de los usuarios
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ error: 'Error al buscar usuarios' });
    }
});

//ver porque se hacen dos llamadas


// ------------------------DEMO 2---------------------------------


//filtro para sucursal y categoria, devuelve por uno por otro o por los dos o asi deberia funcionar
app.get('/productos-filtrados', async (req, res) => {
    try {
        const { sucursal_elegida, categoria_id, nombre } = req.query;

        const query = Producto.forge().where('estado', false); // Agrega la condición de estado aquí

        if (sucursal_elegida) {
            query.where('sucursal_elegida', sucursal_elegida);
        }
        if (categoria_id) {
            query.where('categoria_id', categoria_id);
        }
        if (nombre) {
            query.where('nombre', 'LIKE', `%${nombre}%`);
        }

        const productos = await query.fetchAll();
        res.json({ productos });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
});




// endpoint para registrar un usuario empleado, solo admin
app.post('/registrar-empleado', async (req, res) => {
    try {
        const { nombre, apellido, contrasena, nombre_usuario } = req.body;

        const existingEmpleado = await Empleado.where({ nombre_usuario }).fetch({ require: false });
        if (existingEmpleado) {
            return res.status(400).json({ error: `El empleado con nombre de usuario ${nombre_usuario} ya existe` });
        }

        const newEmpleado = await Empleado.forge({
            nombre,
            apellido,
            contrasena,
            nombre_usuario,
            rol_id: 2
        }).save();

        res.status(201).json({ message: 'Empleado registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



//INICIO DE SESION COMO EMPLEADO a
app.post('/iniciar-sesion-empleado', async (req, res) => {
    const { nombre_usuario, contrasena } = req.body;
    console.log(nombre_usuario, contrasena);

    try {
        // const empleado = await Empleado.where({ nombre_usuario: nombre_usuario }).fetch();
        const empleado = await Empleado.where({ nombre_usuario }).fetch({ require: false });

        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }

        let contrasenaValida;
        try {
            contrasenaValida = await empleado.validarContrasena(contrasena);
        } catch (passwordError) {
            return res.status(500).send('Error Interno del Servidor');
        }

        if (!contrasenaValida) {
            return res.status(401).json({ error: 'Contraseña inválida' });
        }

        const token = jwt.sign({
            id: empleado.get('id'),
            rol_id: empleado.get('rol_id')
        }, 'secreto', { expiresIn: '1h' });

        const userId = empleado.get('id');
        const rol = empleado.get('rol_id');
        console.log(rol);

        return res.status(200).json({ mensaje: 'Inicio de sesión exitoso', token, userId, rol });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});



app.get('/todo', async (req, res) => {
    try {
        const productos = await Producto.query(qb => {
            qb.join('sucursales', 'productos.sucursal_elegida', 'sucursales.id')
                .join('categorias', 'productos.categoria_id', 'categorias.id')
                .select('productos.*', 'sucursales.nombre as nombre_sucursal', 'categorias.nombre as nombre_categoria');
        }).fetchAll();

        console.log(productos.toJSON());
        res.json({ productos: productos.toJSON() });
    } catch (error) {
        console.error('error:', error);
        res.status(500).json({ error: 'err' });
    }
});

app.get('/ventas', async (req, res) => {
    try {
        const ventas = await Venta.fetchAll();
        res.json({ ventas });
    } catch (error) {
        console.error('error al obtener las ventas:', error);
        res.status(500).json({ error: 'ocurrio un error al obtener las ventas' });
    }
})


app.post('/agregar-venta', async (req, res) => {
    try {
        const { articulo, fecha_venta, valor, email_usuario, id_trueque } = req.body;

        const nuevaVenta = await Venta.forge({
            articulo,
            fecha_venta,
            valor,
            email_usuario,
            id_trueque
        }).save();

        res.status(201).json({ nuevaVenta, message: 'Venta registrada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})




// ----------------------------------- comentarios--------------------------

app.get('/datos-producto', async (req, res) => {
    const id = req.query.id; //ok
    try {
        //CONSULTA A LA BD FILTRANDO LA TABLA PRODUCTOS POR ID RECIBIDO
        const producto = await Producto.query(qb => {
            qb.where('productos.id', id)
                .join('sucursales', 'productos.sucursal_elegida', 'sucursales.id')
                .join('categorias', 'productos.categoria_id', 'categorias.id')
                .join('usuarios', 'productos.usuario_id', 'usuarios.id')
                .select('productos.*',
                    'sucursales.nombre as nombre_sucursal',
                    'categorias.nombre as nombre_categoria',
                    'usuarios.nombre as nombre_usuario',
                    'productos.usuario_id');
        }).fetch();

        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener datos del producto:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});




app.get('/comentarios', async (req, res) => { //ok
    const id = req.query.id;
    try {
        const comentarios = await Comentario.query(c => {
            c.where('comentarios.id_producto', id)
                .join('usuarios', 'comentarios.id_usuario', 'usuarios.id')
                .select('comentarios.*',
                    'usuarios.nombre as nombre_usuario');
        }).fetchAll();
        if (comentarios) {
            res.json(comentarios);
        } else {
            res.status(404).json({ message: 'comentarios no encontrados' });
        }
    } catch (error) {
        console.error('Error al obtener comentarios del producto:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }

});



app.post('/agregar-comentario', async (req, res) => { //ok
    const { id_producto, id_usuario, comentario } = req.body;
    try {
        const nuevoComentario = await Comentario.forge({
            id_producto,
            id_usuario,
            comentario
        }).save();
        res.status(201).json(nuevoComentario);
    } catch (error) {
        console.error('Error al agregar el comentario:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});



app.post('/agregar-respuesta', async (req, res) => {//ok
    const { id_comentario, respuesta } = req.body;
    try {
        const comentario = await Comentario.where({ id: id_comentario }).fetch();
        comentario.set({ respuesta });
        await comentario.save();
        res.status(201).json(comentario);
    } catch (error) {
        console.error('Error al agregar la respuesta:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});


//filtro para sucursal y categoria, devuelve por uno por otro o por los dos o asi deberia funcionar
app.get('/productos-filtrados', async (req, res) => {
    try {
        const { sucursal_elegida, categoria_id } = req.query;

        const query = Producto.forge();

        if (sucursal_elegida) {
            query.where('sucursal_elegida', sucursal_elegida);
        }
        if (categoria_id) {
            query.where('categoria_id', categoria_id);
        }

        const productos = await query.fetchAll();
        res.json({ productos });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
});




// endpoint para registrar un usuario empleado, solo admin
// app.post('/registrar-empleado', async (req, res) => {
//     try {
//         const { nombre, contrasena } = req.body;

//         // verificar si ya existe un usuario con el mismo nombre de usuario
//         const existingusuario = await Empleado.where({ nombre }).fetch();
//         if (existingusuario) {
//             return res.status(400).send(`El usuario con dni ${nombre} ya existe`);
//         }

//         // crear un nuevo usuario con el rol de empleado
//         const newusuario = await Empleado.forge({
//             nombre,
//             contrasena,
//             rol_id: 2
//         });
//         newusuario.save();

//         res.status(201).send('Empleado registrado exitosamente');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error interno del servidor');
//     }
// });



//endpooint a usar cuando el admin quiera obtener la lista de empleados
app.get('/empleados', async (req, res) => {
    try {
        // console.log("entra a empleados");
        const usuarios = await Empleado.where({ rol_id: 2 }).fetchAll();
        res.json({ usuarios });
    } catch (error) {
        console.error('error al obtener los empleados:', error);
        res.status(500).json({ error: 'ocurrio un error al obtener los empleados' });
    }
})


app.get('/datos-producto', async (req, res) => {
    const id = req.query.id;
    try {
        //CONSULTA A LA BD FILTRANDO LA TABLA PRODUCTOS POR ID RECIBIDO
        const producto = await Producto.query(qb => {
            qb.where('productos.id', id)
                .join('sucursales', 'productos.sucursal_elegida', 'sucursales.id')
                .join('categorias', 'productos.categoria_id', 'categorias.id')
                .join('usuarios', 'productos.usuario_id', 'usuarios.id')
                .select('productos.*',
                    'sucursales.nombre as nombre_sucursal',
                    'categorias.nombre as nombre_categoria',
                    'usuarios.nombre as nombre_usuario',
                    'productos.usuario_id');
        }).fetch();

        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener datos del producto:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

app.get('/comentarios', async (req, res) => {
    const id = req.query.id;
    try {
        const comentarios = await Comentario.query(c => {
            c.where('comentarios.id_producto', id)
                .join('usuarios', 'comentarios.id_usuario', 'usuarios.id')
                .select('comentarios.*',
                    'usuarios.nombre as nombre_usuario');
        }).fetchAll();
        if (comentarios) {
            res.json(comentarios);
        } else {
            res.status(404).json({ message: 'comentarios no encontrados' });
        }
    } catch (error) {
        console.error('Error al obtener comentarios del producto:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }

});

app.post('/agregar-comentario', async (req, res) => {
    const { id_producto, id_usuario, comentario } = req.body;
    try {
        const nuevoComentario = await Comentario.forge({
            id_producto,
            id_usuario,
            comentario
        }).save();
        res.status(201).json(nuevoComentario);
    } catch (error) {
        console.error('Error al agregar el comentario:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});


app.post('/agregar-respuesta', async (req, res) => {
    const { id_comentario, respuesta } = req.body;
    try {
        const comentario = await Comentario.where({ id: id_comentario }).fetch();
        comentario.set({ respuesta });
        await comentario.save();
        res.status(201).json(comentario);
    } catch (error) {
        console.error('Error al agregar la respuesta:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

app.get('/productos_truequear', async (req, res) => {
    try {
        const { productoId, usuarioId, categoriaId } = req.query;

        const productos = await Producto.query(p => {
            p.where('usuario_id', usuarioId)
             .andWhere('categoria_id', categoriaId)
             .andWhere('estado', false) // Excluye productos con estado = true
             .join('categorias', 'productos.categoria_id', 'categorias.id')
             .whereNotIn('productos.id', function() {
                 this.select('id_producto_propietario')
                     .from('trueque')
                     .where('id_producto_ofertante', productoId)
                     .andWhere('estado', '<>', 'cancelado') // Nueva condición para estado del trueque
                     .union(function() {
                         this.select('id_producto_ofertante')
                             .from('trueque')
                             .where('id_producto_propietario', productoId)
                             .andWhere('estado', '<>', 'cancelado'); // Nueva condición para estado del trueque
                     });
             })
             .select('productos.*', 'categorias.nombre as nombre_categoria');
        }).fetchAll();

        res.json({ productos });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Ocurrió un error al obtener los productos' });
    }
});





// Endpoint para obtener notificaciones
app.get('/notificaciones', async (req, res) => {
    const idusuario = req.query.userId; // Accede al userId a través de req.query
    try {
        const notificaciones = await Notificacion.where({ id_usuario: idusuario }).fetchAll(); // Usa fetchAll() directamente después de where()
        res.json({ notificaciones });
    } catch (error) {
        console.error('Error al obtener las notificaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener las notificaciones' });
    }
});


// Endpoint para obtener la cantidad de notificaciones no leídas de un usuario
app.get('/notificaciones/no-leidas', async (req, res) => {
    const idUsuario = req.query.userId;
    try {
        // Consultar la base de datos para obtener la cantidad de notificaciones no leídas
        const count = await Notificacion.where({ id_usuario: idUsuario, leido: false }).count();
        res.json({ count });
    } catch (error) {
        console.error('Error al obtener la cantidad de notificaciones no leídas:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener la cantidad de notificaciones no leídas' });
    }
});

//endpoint para guardar notificaciones
app.post('/enviar-notificacion', async (req, res) => {
    try {
        const { id_usuario, mensaje, link } = req.body;

        console.log(id_usuario);
        console.log(mensaje);
        console.log(link);


        const nuevaNotificacion = await Notificacion.forge({
            id_usuario,
            mensaje,
            leido: false,  // Default es 'false' según tu esquem
            link
        });

        nuevaNotificacion.save();

        res.status(201).json({ message: 'Notificación creada', notificacion: nuevaNotificacion });

    } catch (error) {
        console.error('Error al crear la notificación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


app.put('/notificaciones/leer', (req, res) => {
    const { userId } = req.body;
    Notificacion.where({ id_usuario: userId }).save({ leido: true }, { patch: true })
        .then(() => {
            res.status(200).send('Notificaciones marcadas como leídas correctamente.');
        })
        .catch(error => {
            console.error('Error al marcar las notificaciones como leídas:', error);
            res.status(500).send('Error al marcar las notificaciones como leídas.');
        });
});



app.post('/agregar-notificacion', async (req, res) => {
    try {
        const { idUser, comentario, link } = req.body;
        const nuevaNotificacion = await Notificacion.forge({
            id_usuario: idUser,
            mensaje: comentario,
            link: link,
            leido: false
        });
        await nuevaNotificacion.save();
        res.status(200).json({ message: 'Se agregó la notificación' });
    } catch (error) {
        console.error('Error al agregar la notificación de comentario:', error);
        res.status(500).json({ error: 'Hubo un error al procesar la solicitud' });
    }
});

app.post('/guardar-trueque', async (req, res) => {
    try {
        const { id_propietario, id_ofertante, id_producto_propietario, id_producto_ofertante, id_sucursal } = req.body;

        const nuevoTrueque = await Trueque.forge({
            id_propietario,
            id_ofertante,
            id_producto_propietario,
            id_producto_ofertante,
            id_sucursal
        });

        console.log("aaasfa");
        console.log(nuevoTrueque);

        await nuevoTrueque.save(); // Guarda el nuevo trueque en la base de datos.
        res.status(201).json(nuevoTrueque); // Envía de vuelta el trueque guardado con un código de estado 201 (Creado).
    } catch (error) {
        console.error('Error al guardar el trueque:', error); // Imprime en consola si hay un error.
        res.status(500).json({ message: 'Error del servidor' }); // Envía un mensaje de error con un código de estado 500 (Error Interno del Servidor).
    }
});

app.get('/mis_trueques', async (req, res) => {
    try {
        const { usuario_id } = req.query; // Cambiado de req.body a req.query
        if (!usuario_id) {
            return res.status(400).json({ error: 'Usuario ID es requerido' });
        }

        
        const trueques = await Trueque.query(qb => {
            qb.where('id_propietario', usuario_id)
                .orWhere('id_ofertante', usuario_id)
                .leftJoin('productos as propietario_productos', 'trueque.id_producto_propietario', 'propietario_productos.id')
                .leftJoin('productos as ofertante_productos', 'trueque.id_producto_ofertante', 'ofertante_productos.id')
                .select('trueque.*', 'propietario_productos.imagen_1 as imagenPropietario', 'ofertante_productos.imagen_1 as imagenOfertante')
                .orderBy('trueque.id', 'desc'); // Ordenar por id en orden descendente
        }).fetchAll({
            withRelated: ['propietario', 'ofertante', 'productoPropietario', 'productoOfertante']
        });


        res.json({ trueques });

    } catch (error) {
        console.error('Error al obtener los trueques:', error);
        res.status(500).json({ error: 'Error al obtener los trueques' });
    }
});

app.post('/elegir_horario', async (req, res) => {
    try {
        const { fechaHora, idTrueque } = req.body;
        console.log("AL ELEGIR HORARIO ME LLEGA");
        console.log(fechaHora);

        const trueque = await Trueque.where({ id: idTrueque }).fetch();


        if (!trueque) {
            return res.status(404).json({ error: 'Trueque no encontrado' });
        }


        const dateObject = new Date(fechaHora);
        // Guardar la fecha y hora en el modelo de Trueque
        trueque.set('fecha', fechaHora);
        const estado = 'esperando_confirmacion';
        trueque.set('estado', estado);

        // Guardar los cambios en la base de datos
        await trueque.save();
        console.log("LO QUE QUEDO EN EL TRUEQUE");
        console.log(trueque.get('fecha'));

        res.status(200).json({ message: 'Fecha y hora del trueque actualizadas correctamente', trueque: trueque });
    } catch (error) {
        console.error('Error al actualizar la fecha y hora del trueque:', error);
        res.status(500).json({ error: 'Error al actualizar la fecha y hora del trueque' });
    }
});


app.post('/rechazar_trueque', async (req, res) => {
    try {
        const { idTrueque } = req.body;

        const trueque = await Trueque.where({ id: idTrueque }).fetch();
        const estadoTrueque = "cancelado";
        trueque.set({ estado: estadoTrueque });

        await trueque.save();

        const propietarioID = trueque.get('id_producto_propietario');
        const ofertanteID = trueque.get('id_producto_ofertante');

        const productoPropietario = await Producto.where({ id: propietarioID }).fetch();
        const productoOfertante = await Producto.where({ id: ofertanteID }).fetch();

        const estadoProductos = false;

        productoPropietario.set({ estado: estadoProductos });
        productoOfertante.set({ estado: estadoProductos });

        await productoPropietario.save();
        await productoOfertante.save();

        res.status(200).json({ message: 'Trueque rechazado exitosamente' });

    } catch (error) {
        console.error('Error al rechazar el trueque:', error);
        res.status(500).json({ error: 'Error al rechazar el trueque' });
    }
});


app.post('/aceptar_trueque', async (req, res) => {
    try {
        const { idTrueque } = req.body;
        const trueque = await Trueque.where({ id: idTrueque }).fetch();
        const estado = "confirmado";
        trueque.set({ estado });

        await trueque.save();

        res.status(200).json({ message: 'Trueque aceptado con éxito' });
    } catch (error) {
        console.error('Error al aceptar el trueque:', error);
        res.status(500).json({ error: 'Error al aceptar el trueque' });
    }
});

const axios = require('axios');

app.post('/confirmar_trueque', async (req, res) => {
    try {
        const { idTrueque } = req.body;
        const trueque = await Trueque.where({ id: idTrueque }).fetch(); //obtengo el trueque

        if (!trueque) {
            return res.status(404).json({ error: 'Trueque no encontrado' });
        }

        const propietarioID = trueque.get('id_producto_propietario');
        const ofertanteID = trueque.get('id_producto_ofertante');

        const producto1 = await Producto.where({ id: propietarioID }).fetch(); //obtengo los productos
        const producto2 = await Producto.where({ id: ofertanteID }).fetch();
        
        console.log("id propietario",propietarioID);
        console.log("id ofertante",ofertanteID);

        estado = "completado";  //confirmo el trueque
        trueque.set({ estado });
        await trueque.save();

        estado = true;

        producto1.set({ estado });  //cambio el estado de los productos
        producto2.set({ estado });

        await producto1.save();
        await producto2.save();

        console.log("llego al try");
        // Llamada al endpoint cancelar_otros_trueques
        try {
            await axios.post('http://localhost:5000/cancelar_otros_trueques', {
                idProducto1: propietarioID,
                idProducto2: ofertanteID,
                idTruequeConfirmado: idTrueque
            });

            console.log("Llamada a /cancelar_otros_trueques exitosa");

        } catch (cancelError) {
            console.error('Error al cancelar otros trueques:', cancelError);
            return res.status(500).json({ error: 'Error al cancelar otros trueques' });
        }

        res.status(200).json({ message: 'Trueque confirmado exitosamente', trueque });
    } catch (error) {
        console.error('Error al confirmar el trueque:', error);
        res.status(500).json({ error: 'Error al confirmar el trueque' });
    }
});

app.get('/trueques_Sucursal', async (req, res) => {
    try {
        const idSucursal = req.query.idSucursal;

        if (!idSucursal) {
            return res.status(400).json({ error: 'El idSucursal es requerido' });
        }

        const trueques = await Trueque.where({ id_sucursal: idSucursal, estado: 'confirmado' })
            .fetchAll({ withRelated: ['productoPropietario', 'productoOfertante', 'propietario', 'ofertante'] });

        res.json({ trueques });
    } catch (error) {
        console.error('Error al obtener trueques:', error);
        res.status(500).json({ error: 'Error al obtener trueques' });
    }
});

// ------------------------DEMO 3---------------------------------

const { differenceInHours } = require('date-fns');

app.post('/cancelar_trueque', async (req, res) => {
    try {
        const { idTrueque } = req.body;
        const trueque = await Trueque.where({ id: idTrueque }).fetch();

        if (!trueque) {
            return res.status(404).json({ error: 'Trueque no encontrado' });
        }

        const fechaTrueque = new Date(trueque.get('fecha'));
        const fechaActual = new Date();
        
        const diferenciaHoras = differenceInHours(fechaTrueque, fechaActual);

        console.log(`Fecha del Trueque: ${fechaTrueque}`);
        console.log(`Fecha Actual: ${fechaActual}`);
        console.log(`Diferencia en horas: ${diferenciaHoras}`);

        if (diferenciaHoras < 24) {
            return res.status(400).json({ error: 'No se puede cancelar el trueque con menos de 24 horas de antelación' });
        }

        trueque.set('estado', 'cancelado');
        await trueque.save();

        res.status(200).json({ message: 'Trueque cancelado con éxito', estado: 'cancelado' });

    } catch (error) {
        console.error('Error al cancelar trueque:', error);
        res.status(500).json({ error: 'Error al cancelar trueque' });
    }
});

app.post('/cancelar_otros_trueques', async (req, res) => {
    const { idProducto1, idProducto2, idTruequeConfirmado } = req.body;
    
    try {
        console.log("intento cancelar otros trueques");
        const trueques = await Trueque.query(qb => {  //obtengo todos los trueques a cancelar
            qb.where(function() {
                this.where('id_producto_propietario', idProducto1)
                    .orWhere('id_producto_ofertante', idProducto1)
                    .orWhere('id_producto_propietario', idProducto2)
                    .orWhere('id_producto_ofertante', idProducto2);
            })
            .andWhere('estado', '!=', 'confirmado')
            .andWhere('id', '!=', idTruequeConfirmado);
        }).fetchAll();

        for (const trueque of trueques.models) {
            console.log("itero");
            trueque.set({ estado: 'cancelado' });
            await trueque.save();
            console.log("ya cancelé");
            // Obtener los nombres de los productos usando el endpoint existente
            const nomproducto1 = await axios.get(`http://localhost:5000/producto_especifico/${trueque.get('id_producto_propietario')}`);
            const nomproducto2 = await axios.get(`http://localhost:5000/producto_especifico/${trueque.get('id_producto_ofertante')}`);
            // Obtener IDs de propietario y ofertante
            const propietarioID = trueque.get('id_propietario');
            const ofertanteID = trueque.get('id_ofertante');
            console.log("intento agregar notificaciones");
            // Crear notificaciones para el propietario y el ofertante
            await Promise.all([
                axios.post(`http://localhost:5000/agregar-notificacion`, {
                    idUser: propietarioID,
                    comentario: `Se ha cancelado el trueque con el producto ${nomproducto1.data.nombre} por indisponibilidad de un producto`,
                    link: `/truequesPendientes/${propietarioID}`
                }),
                axios.post(`http://localhost:5000/agregar-notificacion`, {
                    idUser: ofertanteID,
                    comentario: `Se ha cancelado el trueque con el producto ${nomproducto2.data.nombre} por indisponibilidad de un producto`,
                    link: `/truequesPendientes/${ofertanteID}`
                })
            ]);
        }

        res.status(200).json({ message: 'Otros trueques cancelados exitosamente' });
    } catch (error) {
        console.error('Error al cancelar otros trueques:', error);
        res.status(500).json({ error: 'Error al cancelar otros trueques' });
    }
});

app.post('/eliminar-comentario', async (req, res) => {
    try {
        const { id_comentario } = req.body; // Asegúrate de usar el mismo nombre que en el frontend
        const comentario = await Comentario.where({ id: id_comentario }).fetch();
        await comentario.destroy();
        res.status(200).json({ message: 'Comentario eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el comentario:', error);
        res.status(500).json({ error: 'Error al eliminar el comentario' });
    }
});

app.get('/cantidad-trueques', async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;

        const cantidadTrueques = await Trueque.query()
            .where('estado', 'completado')
            .whereBetween('fecha', [fechaInicio, fechaFin])
            .join('Sucursales', 'Trueque.id_sucursal', 'Sucursales.id')
            .groupBy('id_sucursal', 'Sucursales.nombre')
            .select('id_sucursal', 'Sucursales.nombre as nombre_sucursal')
            .count('Trueque.id as cantidad');
        res.json(cantidadTrueques);
    } catch (error) {
        console.error('Error al obtener la cantidad de trueques:', error);
        res.status(500).json({ error: 'Error al obtener la cantidad de trueques' });
    }
});




// -------------------------------------------------------------- ///  ------------------------------------------------------

app.post('/eliminar-empleado', async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'el id del empleado es requerido' });
        }

        const empleado = await Empleado.where({ id: id }).fetch({ require: false });
        await empleado.destroy();
        res.status(200).json({ message: 'Empleado eliminado.' });

    } catch (error) {
        console.error('Error al eliminar el empleado:', error);
        res.status(500).json({ error: 'Error al eliminar el empleado.' });
    }
});


app.get('/obtener-empleado/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ error: 'El ID del empleado es requerido.' });
        }

        const empleado = await Empleado.where({ id: id }).fetch({ require: false });

        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado.' });
        }

        res.status(200).json({ message: 'Empleado encontrado.', empleado });
    } catch (error) {
        console.error('Error al obtener el empleado:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


app.put('/editar-empleado', async (req, res) => {
    try {
        const { id, datosFormulario } = req.body;

        if (!id || !datosFormulario) {
            return res.status(400).json({ error: 'El id del empleado y los datos a actualizar son requeridos' });
        }

        await Empleado.where({ id: id }).save(datosFormulario, { method: 'update', patch: true });

        res.status(200).json({ message: 'Empleado actualizado exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar el empleado:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar el empleado.' });
    }
});


app.get('/existe-empleado/:nombre_usuario', async (req, res) => {
    try {
        const { nombre_usuario } = req.params;

        if (!nombre_usuario) {
            return res.status(400).json({ error: 'El nombre de usuario es requerido.' });
        }

        const existingEmpleado = await Empleado.where({ nombre_usuario }).fetch({ require: false });
        if (existingEmpleado) {
            return res.status(200).json({ message: 'Empleado encontrado.', empleado: existingEmpleado });
        } else {
            return res.status(200).json({ message: 'Empleado no encontrado.' });
        }

    } catch (error) {
        console.error('Error al obtener el empleado:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});




app.get('/obtener-sucursal/:sucursalId', async (req, res) => {
    try {
        const sucursalId = req.params.sucursalId;

        if (!sucursalId) {
            return res.status(400).json({ error: 'El id de la sucursal es requerido.' });
        }

        const sucursal = await Sucursal.where({ id: sucursalId }).fetch({ require: false });

        if (!sucursal) {
            return res.status(404).json({ error: 'sucursal no encontrada.' });
        }

        res.status(200).json({ message: 'sucursal encontrada.', sucursal });
    } catch (error) {
        console.error('Error al obtener la sucursal:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


app.put('/editar-sucursal', async (req, res) => {
    try {
        const { sucursalId, datosFormulario } = req.body;

        if (!sucursalId || !datosFormulario) {
            return res.status(400).json({ error: 'El id de la sucursal y los datos a actualizar son requeridos' });
        }

        await Sucursal.where({ id: sucursalId }).save(datosFormulario, { method: 'update', patch: true });

        res.status(200).json({ message: 'Sucursal actualizada exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar la sucursal:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar la sucursal.' });
    }
});


// app.post('/eliminar-sucursal', async (req, res) => {
//     const { id_sucursal } = req.body;

//     try {
//         //se fija si la sucursal tiene trueques creados o en espera, implementar estado para trueque 'exitoso' o 'rechazado', los cuales no serian
//         //trueques pendientes, por lo tanto se podria eliminar la sucursal
//         const truequesPendientesOCreados = await Trueque.where({ id_sucursal: id_sucursal })
//             .where('estado', 'in', ['espera', 'creado'])
//             .fetch({ require: false });

//         if (truequesPendientesOCreados) {
//             return res.status(400).json({ error: 'No se puede eliminar la sucursal porque tiene trueques pendientes o creados.' });
//         }
//         await Sucursal.where({ id : id_sucursal })//aca iria la linea que define que se hace con la sucursal, a resolver luego
//         res.status(200).json({ message: 'sucursal eliminada exitosamente.' });
//     } catch (error) {
//         console.error('Error al eliminar la sucursal:', error);
//         res.status(500).json({ error: 'Error interno del servidor.' });
//     }
// });

app.get('/obtener-cliente/:clienteId', async (req, res) => {
    try {
        const clienteId = req.params.clienteId;

        if (!clienteId) {
            return res.status(400).json({ error: 'El id del cliente es requerido.' });
        }

        const cliente = await Usuario.where({ id: clienteId }).fetch({ require: false });

        if (!cliente) {
            return res.status(404).json({ error: 'cliente no encontrado.' });
        }

        res.status(200).json({ message: 'cliente encontrado.', cliente });
    } catch (error) {
        console.error('Error al obtener el cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


app.put('/editar-cliente', async (req, res) => {
    try {
        const { clienteId, datosFormulario } = req.body;

        if (!clienteId || !datosFormulario) {
            return res.status(400).json({ error: 'El id de la sucursal y los datos a actualizar son requeridos' });
        }

        await Usuario.where({ id: clienteId }).save(datosFormulario, { method: 'update', patch: true });

        res.status(200).json({ message: 'Cliente actualizado exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar el cliente.' });
    }
});


app.post('/eliminar-venta', async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'el id de la venta es requerido' });
        }

        const venta = await Venta.where({ id: id }).fetch({ require: false });
        await venta.destroy();
        res.status(200).json({ message: 'Venta eliminada.' });

    } catch (error) {
        console.error('Error al eliminar la venta:', error);
        res.status(500).json({ error: 'Error al eliminar la venta.' });
    }

})

app.get('/producto_especifico/:idProducto', async (req, res) => {
    try {
        const { idProducto } = req.params;

        // Realiza la consulta para obtener el producto por su ID
        const producto = await Producto.where({ id: idProducto }).fetch({ columns: ['nombre'] });

        if (!producto) {
            console.log("no encontrado")
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ nombre: producto.get('nombre') });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});


app.get('/promedio-ventas', async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const truequesConVentas = await Trueque.query()
            .select('trueque.id as id_trueque', 'trueque.fecha as fecha_trueque')
            .sum('ventas.valor as total_valor_ventas')
            .innerJoin('ventas', 'trueque.id', 'ventas.id_trueque')
            .where('trueque.estado', 'completado')
            .whereBetween('trueque.fecha', [fechaInicio, fechaFin])
            .groupBy('trueque.id', 'trueque.fecha');
        console.log(truequesConVentas);
        res.json(truequesConVentas);

        /* const truequesConVentas = await Trueque.query()
            .select('trueque.id as id_trueque', 'trueque.fecha as fecha_trueque')
            .sum('venta.valor as total_valor_ventas')
            .innerJoin('venta', 'trueque.id', 'venta.id_trueque')
            .where('trueque.estado', 'completado')
            .whereBetween('trueque.fecha', [fechaInicio, fechaFin])
            .groupBy('trueque.id', 'trueque.fecha'); */
    } catch (error) {
        console.error('Error al traer las ventas y los trueques:', error);
        res.status(500).json({ error: 'Error al traer las ventas y los trueques' });
    }
});


// iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

