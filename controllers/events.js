const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async (req, res = response) => {
  const eventos = await Evento.find().populate('user', 'name');

  res.json({
    ok: true,
    eventos,
  });
};

const crearEvento = async (req, res = response) => {
  // Verificar que la petición tenga el evento
  console.log(req.body);

  const evento = new Evento(req.body);

  try {
    evento.user = req.uid;
    const savedEvent = await evento.save();
    res.json({
      ok: true,
      evento: savedEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador ',
    });
  }
};

const actualizarEvento = async (req, res = response) => {
  const eventoId = req.params.id;

  try {
    const evento = await Evento.findById(eventoId);
    const uid = req.uid;

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: 'Evento con ese id no existe',
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegio para editar este evento',
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: uid,
    };

    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventoId,
      nuevoEvento,
      { new: true },
    );

    res.json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el admin',
    });
  }
};

const eliminarEvento = async (req, res = response) => {
  const eventoId = req.params.id;

  try {
    const uid = req.uid;
    const evento = await Evento.findById(eventoId);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: 'El evento no existe',
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegios para realizar esta acción',
      });
    }

    const deletedEvent = await Evento.findByIdAndDelete(eventoId);

    res.json({
      ok: true,
      deletedEvent,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
