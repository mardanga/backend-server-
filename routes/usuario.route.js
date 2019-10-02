var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var mdAutentificacion = require('../middlewares/validaciones');



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//====================================================//
//  obtener usuarios
//====================================================//
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role google')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuario',
                        errors: err
                    });
                }

                Usuario.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo,
                        desde: desde
                    });

                })
            });
});


//====================================================//
// crear usuarios 
//====================================================//
app.post('/', (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 15),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error en crear usuarios",
                errores: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioPeticion: req.usuarioPeticion
        });

    });

});

//====================================================//
// actualizar usuarios 
//====================================================//
app.put('/:id', mdAutentificacion.VerificaToken, (req, res) => {

    Usuario.findById(req.params.id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error en buscar usuarios",
                errores: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe ese usuario"
            });
        }

        var body = req.body;
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al actualizar el usuario",
                    errores: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                usuarioPeticion: req.usuarioPeticion
            });
        });
    });
});

//====================================================//
// actualizar usuarios 
//====================================================//
app.delete('/:id', mdAutentificacion.VerificaToken, (req, res) => {

    Usuario.findByIdAndRemove(req.params.id, (err, usuarioEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error en buscar usuarios",
                errores: err
            });
        }

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe ese usuario"
            });
        }


        res.status(200).json({
            ok: true,
            usuario: usuarioEliminado,
            usuarioPeticion: req.usuarioPeticion
        });


    });

});


module.exports = app;