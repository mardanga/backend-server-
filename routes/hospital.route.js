var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var bodyParser = require('body-parser');
var mdAutentificacion = require('../middlewares/validaciones');



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//====================================================//
//  obtener hospitales
//====================================================//
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(3)
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error en obtener hospitales",
                        errores: err
                    });
                }

                Hospital.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        usuarioPeticion: req.usuarioPeticion,
                        total: conteo
                    });
                });


            }
        );
});

//====================================================//
//  obtener hospitales
//====================================================//
app.get('/:id', (req, res, next) => {

    var id = req.params.id;
    Hospital.findById(id)
        .populate('usuario', 'nombre img email')
        .exec(
            (err, hospital) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error en obtener hospital",
                        errores: err
                    });
                }

                if (!hospital) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El hospital con el id ' + id + ' no existe',
                        errors: { message: 'No existe un hospital con ese ID' }
                    });
                }



                res.status(200).json({
                    ok: true,
                    hospital
                });
            }
        );
});


//====================================================//
// crear hospital 
//====================================================//
app.post('/', mdAutentificacion.VerificaToken, (req, res) => {

    var body = req.body;
    console.log("hola mundo");


    var hospitalNuevo = new Hospital({
        nombre: body.nombre,

        usuario: req.usuario._id
    });

    hospitalNuevo.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error en crear hospital",
                errores: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            usuarioPeticion: req.usuarioPeticion
        });

    });

});

//====================================================//
// actualizar hospital 
//====================================================//
app.put('/:id', mdAutentificacion.VerificaToken, (req, res) => {

    Hospital.findById(req.params.id, (err, hospitalbd) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error en buscar hospital",
                errores: err
            });
        }

        if (!hospitalbd) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe ese hospital"
            });
        }

        var body = req.body;
        hospitalbd.nombre = body.nombre;
        hospitalbd.img = body.img;
        hospitalbd.usuario = req.usuario._id;

        hospitalbd.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al actualizar el hospital",
                    errores: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado,
                usuarioPeticion: req.usuarioPeticion
            });

        });

    });

});

//====================================================//
// delete hospital
//====================================================//
app.delete('/:id', mdAutentificacion.VerificaToken, (req, res) => {

    Hospital.findByIdAndRemove(req.params.id, (err, hospitalEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error en buscar hospital",
                errores: err
            });
        }

        if (!hospitalEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe ese hospital"
            });
        }


        res.status(200).json({
            ok: true,
            hospital: hospitalEliminado,
            usuarioPeticion: req.usuarioPeticion
        });


    });

});


module.exports = app;