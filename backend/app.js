const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const knex = require('knex');
const fs = require('fs');//sacar
const cors = require('cors');

const jwt = require('jsonwebtoken');
const multer = require('multer');


const { Usuario, Sucursal, Producto, Categoria, Empleado } = require('./models');
const upload = multer();

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

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));


//mover funcion
const verificarAutenticacion = (req, res, next) => {
    if (req.session.usuario) {
        next();
    } else {
        res.status(401).json({ error: 'Acceso denegado. Debes iniciar sesión para acceder a esta ruta.' });
    }
};

const verificarAutorizacionAdmin = (req, res, next) => {
    if (req.session.usuario && req.session.usuario.rol_id === 1) {
        next();
    } else {
        res.status(403).json({ error: 'Acceso denegado. Se requiere permisos de administrador.' });
    }
};







// endpoint para registrar un usuario cliente
//luego del registro se tiene que redirigir al login
app.post('/registrar-cliente', async (req, res) => {
    try {
        // extraer los datos del cuerpo de la solicitud
        const { nombre, apellido, correo, fecha_nacimiento, sucursal_preferencia, contrasena } = req.body;

        // Verificar si ya existe un usuario con el mismo correo electrónico
        // let usuarioExistente;
        // try {
        //     usuarioExistente = await Usuario.where({ correo }).fetch();
        // } catch (error) {
        //     console.error('Error al buscar usuario existente:', error);
        //     return res.status(500).json({ error: 'Error interno del servidor al buscar usuario existente' });
        // }

        // if (usuarioExistente !== null) {
        //     return res.status(400).json({ error: 'Ya existe un usuario con este correo electrónico' });
        // }

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




// endpoint para registrar un usuario empleado, solo admin
app.post('/registrar-empleado', verificarAutorizacionAdmin, async (req, res) => {
    try {
        const { dni, contrasena } = req.body;

        // verificar si ya existe un usuario con el mismo nombre de usuario
        const existingusuario = await Empleado.where({ dni }).fetch();
        if (existingusuario) {
            return res.status(400).send(`El usuario con dni ${dni} ya existe`);
        }

        // crear un nuevo usuario con el rol de empleado
        const newusuario = await Empleado.forge({
            dni,
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

app.post('/iniciar-sesion-cliente', async (req, res) => {

    const { correo, contrasena } = req.body;

    try {
<<<<<<< Updated upstream
        const usuario = await Usuario.where({ correo }).fetch();
        console.log(usuario);
=======
        let usuario;
        try {
            usuario = await Usuario.where({ correo }).fetch({ require: false });
        } catch (fetchError) {
            console.error("Error al buscar el usuario:", fetchError);
        }
>>>>>>> Stashed changes

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

<<<<<<< Updated upstream
        // Si el usuario existe, verificar la contraseña
        const contrasenaValida = await usuario.validarContrasena(contrasena);
        if (!contrasenaValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }



        // almacenar información del usuario en la sesion
        req.session.usuario = { id: usuario.get('id'), correo: usuario.get('correo'), rol_id: usuario.get('rol_id') };
        console.log(req.session.usuario.correo);

        res.status(200).json({ mensaje: 'inicio de sesion exitoso', usuario: { rol_id: usuario.get('rol_id') } }); //devuelvo el usuario y que el frontend maneje la redireccion

=======
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
        console.log("Token generado:", token);

        // Responder con éxito
        return res.status(200).json({ mensaje: 'Inicio de sesión exitoso', token, userId });

>>>>>>> Stashed changes
    } catch (error) {
        return res.status(500).send('Error Interno del Servidor');
    }
});


<<<<<<< Updated upstream

//iniciar sesion empleado
=======
// iniciar sesion empleado
>>>>>>> Stashed changes
//borrar logs
//empty response cuando dni incorrecto
app.post('/iniciar-sesion-empleado', async (req, res) => {

    const login = { dni, contrasena } = req.body;

    try {
        const usuario = await Empleado.where({ dni }).fetch();
        console.log(usuario);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const contrasenaValida = await usuario.validarContrasena(contrasena);
        if (!contrasenaValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // guardar informacion del usuario en la sesion
        req.session.usuario = { id: usuario.get('id'), correo: usuario.get('dni'), rol_id: usuario.get('rol_id') };
        console.log(req.session.usuario.correo);

        return res.status(200).json({ mensaje: 'inicio de sesion exitoso', usuario: { rol_id: usuario.get('rol_id') } }); //devuelvo el usuario y que el frontend maneje la redireccion

    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});


//endpoint para publicar producto
<<<<<<< Updated upstream

app.post('/publicar-producto', verificarAutenticacion, upload.any(), async (req, res) => {
    try {
        const { nombre, descripcion, sucursal_elegida, categoria_id } = req.body;
        const imagen = req.files ? req.files[0] : null;
        const usuario_id = req.session.usuario.id;
=======
const multer = require('multer');
const upload = multer();
app.post('/publicarProducto', upload.array('foto', 1), async (req, res) => {
    try {
        //console.log(req.files[0]);
        const { nombre, descripcion, sucursal_elegida, categoria_id, usuario_id } = req.body;
        const imagen = req.files ? req.files[0] : null;
        console.log(req.body.foto);
        console.log(imagen);
>>>>>>> Stashed changes

        
        let imagenBase64 = null;
        if (imagen) {
            imagenBase64 = imagen.buffer.toString('base64');
        }
        


        const nuevoProducto = await Producto.forge({
            nombre,
            descripcion,
            sucursal_elegida,
            categoria_id,
            usuario_id,
            imagen: imagenBase64 // Guardar foto en la base de datos como base64
        })
        await nuevoProducto.save();
<<<<<<< Updated upstream
        res.status(201).json({ mensaje: 'Producto creado exitosamente'});
=======
        
        return res.status(201).json({ mensaje: 'Producto creado exitosamente'});
>>>>>>> Stashed changes
    } catch (error) {
        // respuesta si hay error
        console.error('error al registrar el producto:', error);
        return res.status(500).json({ error: 'no se pudo registrar el producto' });
    }
});



// Endpoint para cerrar sesión
app.post('/logout', (req, res) => {
    
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
    });
    res.status(200).json({ mensaje : 'Sesion cerrada' });
    console.log(req.session);
});



//solo admin
app.post('/agregar-sucursal', verificarAutorizacionAdmin, async (req, res) => {
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


//solo admin
app.get('/usuarios', verificarAutorizacionAdmin, async (req, res) => {
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
app.get('/productos', async(req, res) => {
    try {
        const productos = await Producto.fetchAll();
        res.json({ productos });
    } catch (error) {
        console.error('error al obtener los productos:', error);
        res.status(500).json({ error: 'ocurrio un error al obtener los productos' });
    }
})




// iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


