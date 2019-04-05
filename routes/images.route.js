var express = require('express');
var app = express();

var path = require('path');
var fs = require('fs');


app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var path = `./uploads/${ tipo }/${ img }`;

    fs.exists(path, existe => {

        if (!existe) {
            path = './assets/user.png';
        }


        res.sendfile(path);

    });


});


module.exports = app;