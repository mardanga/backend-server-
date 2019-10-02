var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


//====================================================//
// busqueda general 
//====================================================//
app.get('/coleccion/:tabla/:texto', (req, res, next) => {

    var tabla = req.params.tabla;
    var regex = new RegExp(req.params.texto, "i");

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = BuscarEnUsuarios(regex);
            break;
        case 'hospital':
            promesa = BuscarEnHospitales(regex);
            break;
        case 'medicos':
            promesa = BuscarEnMedicos(regex);
            break;
        default:
            break;
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            data: data
        });
    });
});



// ====================================================//
// busqueda general 
// ====================================================//
app.get('/todos/:texto', (req, res, next) => {



    Promise.all(
            [
                BuscarEnHospitales(req.params.texto),
                BuscarEnMedicos(req.params.texto),
                BuscarEnUsuarios(req.params.texto)
            ]
        )
        .then(resp => {
            res.status(200).json({
                ok: true,
                hospitales: resp[0],
                medicos: resp[1],
                usuarios: resp[2]
            })
        });
});

function BuscarEnHospitales(texto) {

    var regex = new RegExp(texto, "i");


    return new Promise((resolve, reject) => {
        Hospital.find({ 'nombre': regex }).populate('usuario', 'nombre email img')
            .exec((err, hospitales) => {
                if (err) {
                    reject("Error en obtener hospitales");
                } else {
                    resolve(hospitales);
                }
            });
    });

}

function BuscarEnMedicos(texto) {
    var regex = new RegExp(texto, "i");

    return new Promise((resolve, reject) => {
        Medico.find({ 'nombre': regex })
            .exec((err, medicos) => {
                if (err) {
                    reject("Error en obtener medicos");
                } else {
                    resolve(medicos);
                }
            });
    });

}

function BuscarEnUsuarios(texto) {

    var regex = new RegExp(texto, "i");

    return new Promise((resolve, reject) => {
        Usuario.find({ 'nombre': regex, 'email': regex })
            .exec((err, usuarios) => {
                if (err) {
                    reject("Error en obtener usuarios");
                } else {
                    resolve(usuarios);
                }
            });
    });

}


module.exports = app;