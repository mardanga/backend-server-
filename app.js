//requieres
var express = require('express');
var mongoose = require('mongoose');

var rootRoutes = require('./routes/root.route');
var usuarioRoutes = require('./routes/usuario.route');
var loginRoutes = require('./routes/login.route');


//inicializacion variables
var app = express();

//conexion a BD
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', { useNewUrlParser: true }, (err, resp) => {
    if (err) throw err;

    console.log('Mongo Database: \x1b[31m%s\x1b[0m', 'online');
});

// rutas
app.use('/', rootRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);


//escuchar peticiones

app.listen(3000, () => {
    console.log('Express puerto 3000: \x1b[31m%s\x1b[0m', 'online');
});