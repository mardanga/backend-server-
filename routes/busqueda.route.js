var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');


//====================================================//
// busqueda general 
//====================================================//
app.get('/:tabla/:texto', (req, res, next) => {

    var tabla = req.params.tabla;
    var regex = new RegExp(req.params.texto, "i");

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = BuscarEnUsuarios(regex);
            break;
        case 'hospitales':
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



//====================================================//
// busqueda general 
//====================================================//
app.get('/todos/:texto', (req, res, next) => {

    Promise.all(
            [BuscarEnHospitales(req.params.texto),
                BuscarEnMedicos(req.params.texto),
                BuscarEnUsuarios(res.params.texto)
            ]
        )
        .then(resp => {
            res.status(200).json({
                ok: true,
                hospitales: resp[0],
                medicos: resp[1],
                usuarios: resp[2]
            });
        });
});

function BuscarEnHospitales(texto) {

    var regex = new RegExp(texto, "i");
    return new Promise((resolve, reject) => {
        Hospital.find({ 'nombre': regex }, (err, hospitales) => {
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
        Medico.find({ 'nombre': regex }, (err, medicos) => {
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
        Usuario.find({ 'nombre': regex, 'email': regex }, (err, usuarios) => {
            if (err) {
                reject("Error en obtener usuarios");
            } else {
                resolve(usuarios);
            }
        });
    });



}



module.exports = app;