var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var Usuario = require('../models/usuario');

var SEED = require('../config/config').SEED;
var CLIENT_ID = require('../config/config').CLIENT_ID;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('743582030731-r84206nq8crd356gicqc30pkj2kphfc5.apps.googleusercontent.com');


//====================================================//
//  login google
//====================================================//


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '743582030731-r84206nq8crd356gicqc30pkj2kphfc5.apps.googleusercontent.com'
    }).catch((err) => {
        return res.status(403).json({
            ok: false,
            mensaje: "error verifyIdToken",
            err: err
        });
    });
    const payload = ticket.getPayload().catch((err) => {
        return res.status(403).json({
            ok: false,
            mensaje: "error verifyIdToken",
            err: err
        });
    });
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        google: true
    }

}


app.post('/google', async(req, res) => {
    var token = req.body.token;
    var googleUser = await verify(token).catch(
        (err) => {
            return res.status(403).json({
                ok: false,
                mensaje: "Token invalido",
                err: err
            });
        }
    );



    Usuario.findOne({ email: googleUser.email }, (err, usuarioDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al ingresar al sistema con GoogleSignIn",
                errores: err
            });
        }



        if (usuarioDb) {
            if (usuarioDb.google === false) {
                return res.status(200).json({
                    ok: false,
                    mensaje: "Debe ingresar con el login del sistema"
                });
            } else {
                var token = jwt.sign({ usuario: usuarioDb }, SEED, { expiresIn: 14400 });

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDb,
                    id: usuarioDb.id,
                    token: token
                });
            }
        } else {
            let usuarioNuevo = new Usuario();
            usuarioNuevo.nombre = googleUser.name;
            usuarioNuevo.email = googleUser.email;
            usuarioNuevo.img = googleUser.picture;
            usuarioNuevo.password = ";)"
            usuarioNuevo.google = true;
            usuarioNuevo.save((err, usuarioDb) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error al crear el usuario desde GoogleSignIn",
                        errores: err
                    });
                }


                var token = jwt.sign({ usuario: usuarioDb }, SEED, { expiresIn: 14400 });

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDb,
                    id: usuarioDb.id,
                    token: token,
                    menu: obtenerMenu(usuarioDb.role)
                });
            });
        }


    });

});



//====================================================//
//  login normal
//====================================================//
app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                errores: err
            });
        }

        if (!usuarioDb) {
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas - email",
                errores: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDb.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas - password",
                errores: err
            });
        }

        //token
        usuarioDb.password = ';)';
        var token = jwt.sign({ usuario: usuarioDb }, SEED, { expiresIn: 14400 });


        res.status(200).json({
            ok: true,
            usuario: usuarioDb,
            id: usuarioDb.id,
            token: token,
            menu: obtenerMenu(usuarioDb.role)
        });
    });


});

function obtenerMenu(rol) {
    var menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'ProgressBar', url: '/progress' },
                { titulo: 'Gráficas', url: '/graficas1' },
                { titulo: 'Promesas', url: '/promesas' },
                { titulo: 'Rxjs', url: '/rxjs' }
            ]
        },
        {
            titulo: 'Mantenimiento',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [

                { titulo: 'Hospitales', url: '/hospitales' },
                { titulo: 'Medicos', url: '/medicos' }

            ]
        }
    ];

    if (rol === "ADMIN_ROLE") {
        menu[1].submenu.push({ titulo: 'Usuarios', url: '/usuarios' });
    }
    return menu;
}

module.exports = app;