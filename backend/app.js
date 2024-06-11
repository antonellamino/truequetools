const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { Usuario, Sucursal, Producto, Categoria, Empleado, Comentario, Notificacion, Trueque, Venta} = require('./models');


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
        console.log(nuevoProducto);
        await nuevoProducto.save();

        return res.status(201).json({ mensaje: 'Producto creado exitosamente' });
    } catch (error) {
        console.error('Error al registrar el producto:', error);
        return res.status(500).json({ error: 'No se pudo registrar el producto' });
    }
});

/* EL QUE HABIA HECHO YO
//endpoint para publicar producto
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
app.post('/publicarProducto', upload.array('foto',1), async (req, res) => {
    try {
        const { nombre, descripcion, sucursal_elegida, categoria_id, usuario_id } = req.body;
        //console.log(req.files[0]);
        const imagenes = req.files;

        
        //const imagen = req.files [0];
        //const imagen2 = req.files[1];
        

        //console.log(req.body.foto);
        //console.log(imagen);
        
        let imagenesBase64 = null;
        if( imagenes && imagenes.length > 0){
            imagenesBase64 = imagenes.map( img => img.buffer.toString('base64'));
        }
        
        /* if (imagen) {
            imagenBase64 = imagen.buffer.toString('base64');
            
            console.log(imagenBase64);
        }
        //ESTO ESTABA COMENTADO

        const nuevoProducto = await Producto.forge({
            nombre,
            descripcion,
            sucursal_elegida,
            categoria_id,
            usuario_id,
            imagen: imagenesBase64 // Guardar fotos en la base de datos como base64
        })

        await nuevoProducto.save();

        res.status(201).json({ mensaje: 'Producto creado exitosamente'});
    } catch (error) {
        // respuesta si hay error
        console.error('error al registrar el producto:', error);
        res.status(500).json({ error: 'no se pudo registrar el producto' });
    }
});
*/


// Endpoint para cerrar sesión
// app.post('/logout', (req, res) => {

//     res.status(200).json({ mensaje : 'Sesion cerrada' });
//     console.log(req.session);
// });



//solo admin
app.post('/agregar-sucursal', async (req, res) => {
    try {

        const { nombre, direccion, telefono } = req.body;

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

        const query = Producto.forge();

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



//endpooint a usar cuando el admin quiera obtener la lista de empleados
app.get('/empleados', async (req, res) => {
    try {
        const usuarios = await Empleado.fetchAll();
        res.json({ usuarios });
    } catch (error) {
        console.error('error al obtener los empleados:', error);
        res.status(500).json({ error: 'ocurrio un error al obtener los empleados' });
    }
})


//INICIO DE SESION COMO EMPLEADO
app.post('/iniciar-sesion-empleado', async (req, res) => {
    const { nombre_usuario, contrasena } = req.body;

    try {
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


app.post('/agregar-venta', async(req, res) => {
    try {
        const { articulo, fecha_venta, valor, email_usuario } = req.body;

        const nuevaVenta = await Venta.forge({
            articulo,
            fecha_venta,
            valor,
            email_usuario
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


app.get('/productos-truequear', async (req, res) => {
    try {

        const { productoId, usuarioId, categoriaId } = req.query;

        console.log(productoId);
        console.log("me llego el usuario", usuarioId);

        const productos = await Producto.query((p) => {
            p.where('productos.usuario_id', usuarioId)
                .join('categorias', 'productos.categoria_id', 'categorias.id');
        }).fetchAll();

        res.json({ productos });
    }
    catch (error) {
        console.error('error al obtener los productos:', error);
        res.status(500).json({ error: 'ocurrio un error al obtener los productos' });
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
app.post('/registrar-empleado', async (req, res) => {
    try {
        const { nombre, contrasena } = req.body;

        // verificar si ya existe un usuario con el mismo nombre de usuario
        const existingusuario = await Empleado.where({ nombre }).fetch();
        if (existingusuario) {
            return res.status(400).send(`El usuario con dni ${nombre} ya existe`);
        }

        // crear un nuevo usuario con el rol de empleado
        const newusuario = await Empleado.forge({
            nombre,
            contrasena,
            rol_id: 2
        });
        newusuario.save();

        res.status(201).send('Empleado registrado exitosamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});



//endpooint a usar cuando el admin quiera obtener la lista de empleados
app.get('/empleados', async (req, res) => {
    try {
        const usuarios = await Empleado.fetchAll();
        res.json({ usuarios });
    } catch (error) {
        console.error('error al obtener los empleados:', error);
        res.status(500).json({ error: 'ocurrio un error al obtener los empleados' });
    }
})

//INICIO DE SESION COMO EMPLEADO
app.post('/iniciar-sesion-empleado', async (req, res) => {
    const login = { nombre, contrasena } = req.body;

    try {
        const empleado = await Empleado.where({ nombre }).fetch();

        if (!empleado) {
            return res.status(404).json({ error: 'empleado no encontrado' });
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
        res.status(500).send('Internal Server Error');
    }
});

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
        const comentarios = await Comentario.query(c =>{
            c.where('comentarios.id_producto', id)
            .join('usuarios', 'comentarios.id_usuario', 'usuarios.id')
            .select('comentarios.*',
                    'usuarios.nombre as nombre_usuario');
        }).fetchAll();
        if (comentarios){
            res.json(comentarios);
        }else{
            res.status(404).json({ message: 'comentarios no encontrados' });
        }
    } catch (error) {
        console.error('Error al obtener comentarios del producto:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }

});

app.post('/agregar-comentario', async (req, res) => {
    const { id_producto, id_usuario,  comentario } = req.body;
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

app.get('/productos-truequear', async (req, res) => {
    try {
        const { usuarioId, categoriaId } = req.query;

        const productos = await Producto.query(p => {
            p.where('usuario_id', usuarioId)
             .andWhere('categoria_id', categoriaId) // Agrega la condición para la categoría
             .join('categorias', 'productos.categoria_id', 'categorias.id')
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

        console.log( id_usuario );
        console.log( mensaje );
        console.log( link );

    
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

app.post('/guardar-trueque',async (req,res) => {
    try{
        const { id_propietario, id_ofertante, id_producto_propietario, id_producto_ofertante, fecha } = req.body;

        const nuevoTrueque = await Trueque.forge({
            id_propietario,
            id_ofertante,
            id_producto_propietario,
            id_producto_ofertante,
            fecha
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
        // Construyendo la consulta para buscar trueques donde el usuario es propietario o ofertante
        const trueques = await Trueque.query(qb => {
            qb.where('id_propietario', usuario_id).orWhere('id_ofertante', usuario_id);
        }).fetchAll({
            withRelated: ['propietario', 'ofertante', 'productoPropietario', 'productoOfertante'] // Asegúrate de que estos nombres coincidan con los métodos definidos en tu modelo Trueque
        });
        res.json({ trueques });
    } catch (error) {
        console.error('Error al obtener los trueques:', error);
        res.status(500).json({ error: 'Error al obtener los trueques' });
    }
});

// iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


