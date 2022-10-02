/*
    Rutas de eventos / Events
    host + /api/events
*/

// Todas tienen que pasar por la validación del JWT
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} = require('../controllers/events');
const router = Router();
const { validarJWT } = require('../middlewares/validar-jwt');
const { isDate } = require('../helpers/isDate');

// Aplicar middleware a todas las rutas que estén DEBAJO

router.use(validarJWT);

// Obtener eventos

router.get('/', getEventos);

//Crear evento

router.post(
  '/',
  [
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio obligatoria').custom(isDate),
    check('end', 'Fecha de finalización obligatoria').custom(isDate),
    validarCampos,
  ],
  crearEvento,
);

//Actualizar evento

router.put(
  '/:id',
  [
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio obligatoria').custom(isDate),
    check('end', 'Fecha de finalización obligatoria').custom(isDate),
    validarCampos,
  ],
  actualizarEvento,
);

//Borrar evento

router.delete('/:id', eliminarEvento);

module.exports = router;
