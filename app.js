//requieres
var express = require('express');

//inicializacion variables
var app = express();

//escuchar peticiones

app.listen(3000, () => {
    console.log('Express puerto 3000: online');
});