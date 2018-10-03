var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuarios', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'hospital', required: [true, 'El id hospital es un campo obligatorio'] }
});
module.exports = mongoose.model('Medico', medicoSchema);