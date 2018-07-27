//requieres
var express = require('express');
var mongoose = require('mongoose');

//inicializacion variables
var app = express();

//conexion a BD
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', { useNewUrlParser: true }, (err, resp) => {
    if (err) throw err;

    console.log('Mongo Database: \x1b[31m%s\x1b[0m', 'online');
});

//escuchar peticiones

app.listen(3000, () => {
    console.log('Express puerto 3000: \x1b[31m%s\x1b[0m', 'online');
});