var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
var fs = require('fs');

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');



app.use(fileUpload({
    limits: { fileSize: 3 * 1024 * 1024 },
}));

app.put('/:tabla/:id', (req, res, next) => {

    if (!req.files) {
        res.status(400).json({
            ok: false,
            mensaje: "No hay imagenes para subir"
        });
    }


    var archivo = req.files.imagen;
    var split = archivo.name.split('.');
    var extension = split[split.length - 1];
    var extensionesValidas = ['jpg', 'bmp', 'gif', 'png'];

    if (extensionesValidas.indexOf(extension) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: "Archivo no válido"
        });
    }


    var nombreGaurdado = req.params.id + '-' + Math.random() + '.' + extension;
    var path = './uploads/' + req.params.tabla + '/';



    archivo.mv(path + nombreGaurdado, function(err) {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        subirPorTipo(req.params.id, req.params.tabla, nombreGaurdado, res);

    });
});

function subirPorTipo(id, tabla, nombre, res) {

    if (tabla === 'usuario') {
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario inexistente'
                });
            }

            var pathViejo = './uploads/usuario/' + usuario.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombre;
            usuario.save((err, usuarioGuardado) => {

                if (err) {
                    res.status(400).json({
                        ok: false,
                        mensaje: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: "Usuario actualizado",
                    usuario: usuarioGuardado

                });
            });
        });
    }

    if (tabla === 'hospital') {
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital inexistente'
                });
            }

            var pathViejo = './uploads/hospital/' + hospital.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            hospital.img = nombre;
            hospital.save((err, hospitalGuardado) => {

                if (err) {
                    res.status(400).json({
                        ok: false,
                        mensaje: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: "Hospital actualizado",
                    hospital: hospitalGuardado

                });
            });
        });
    }

    if (tabla === 'medico') {
        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario inexistente'
                });
            }

            var pathViejo = './uploads/hospital/' + medico.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            medico.img = nombre;
            medico.save((err, medicoGuardado) => {

                if (err) {
                    res.status(400).json({
                        ok: false,
                        mensaje: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: "Medico actualizado",
                    medico: medicoGuardado

                });
            });
        });
    }
};


module.exports = app;