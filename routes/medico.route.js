var express = require('express');
var app = express();
var Medico = require('../models/medico');

var bodyParser = require('body-parser');
var mdAutentificacion = require('../middlewares/validaciones');



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//====================================================//
//  obtener medicos
//====================================================//
app.get('/', (req, res, next) => {

    var pagina = req.query.pagina || 0;
    pagina = Number(pagina);

    Medico.find({})
        .skip(pagina * 3)
        .limit(3)
        .populate('usuario', 'nombre email')
        .populate('hospital', 'nombre')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error en obtener medicos",
                        errores: err
                    });
                }

                Medico.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        usuarioPeticion: req.usuarioPeticion,
                        total: conteo
                    });
                });
            }
        );

});

//====================================================//
// crear megicos 
//====================================================//
app.post('/', mdAutentificacion.VerificaToken, (req, res) => {

    var body = req.body;

    var medicoNuevo = new Medico({
        nombre: body.nombre,
        img: '',
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medicoNuevo.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error en crear medico",
                errores: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuarioPeticion: req.usuarioPeticion
        });

    });

});

//====================================================//
// actualizar medico 
//====================================================//
app.put('/:id', mdAutentificacion.VerificaToken, (req, res) => {

    Medico.findById(req.params.id, (err, medicobd) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error en buscar medico",
                errores: err
            });
        }

        if (!medicobd) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe ese medico"
            });
        }

        var body = req.body;
        medicobd.nombre = body.nombre;
        medicobd.img = body.img;
        medicobd.usuario = req.usuario._id;
        medicobd.hospital = req.hospital;

        medicobd.save((err, medicoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al actualizar el medico",
                    errores: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado,
                usuarioPeticion: req.usuarioPeticion
            });

        });

    });

});

//====================================================//
// delete medico
//====================================================//
app.delete('/:id', mdAutentificacion.VerificaToken, (req, res) => {

    Medico.findByIdAndRemove(req.params.id, (err, medicoEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error en buscar medico",
                errores: err
            });
        }

        if (!medicoEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe ese medico"
            });
        }


        res.status(200).json({
            ok: true,
            medico: medicoEliminado,
            usuarioPeticion: req.usuarioPeticion
        });


    });

});


module.exports = app;