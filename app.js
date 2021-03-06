//requieres
var express = require('express');
var mongoose = require('mongoose');

var rootRoutes = require('./routes/root.route');
var usuarioRoutes = require('./routes/usuario.route');
var loginRoutes = require('./routes/login.route');
var hospitalRoutes = require('./routes/hospital.route');
var medicoRoutes = require('./routes/medico.route');
var busquedaRoutes = require('./routes/busqueda.route');
var uploadRoutes = require('./routes/upload.route');

var imagenesRoutes = require('./routes/images.route');


//inicializacion variables
var app = express();

// CORS
app.use(function(req, res, next) {
    //res.header('Access-Control-Allow-Credentials', "true");
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    //res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers,Content-Type,Authorization,Content-Length,X-Requested-With,Access-Control-Request-Headers,token');
    res.header('Access-Control-Allow-Headers', '*');
    next();

});

//conexion a BD
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', { useNewUrlParser: true }, (err, resp) => {
    if (err) throw err;

    console.log('Mongo Database: \x1b[31m%s\x1b[0m', 'online');
});

// rutas

app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

app.use('/', rootRoutes);

//escuchar peticiones

app.listen(3000, () => {
    console.log('Express puerto 3000: \x1b[31m%s\x1b[0m', 'online');
});