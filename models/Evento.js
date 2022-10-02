const { Schema, model } = require('mongoose');

const EventoSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
});

// Configuraciones adicionales
// Reemplazar nombre del atributo _id por id
// Ocultar el atributo __v
// Estas modificaciones solo son visibles en la respuesta,
// La base de datos no es modificada.

EventoSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model('Evento', EventoSchema);
