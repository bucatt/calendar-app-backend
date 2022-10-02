const { response } = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const { generateJWT } = require('../helpers/jwt');
const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });
    console.log(usuario);

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario ya existe con ese correo.',
      });
    }

    usuario = new Usuario(req.body);

    // Encriptar contraseña

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    // Generar JSON WebToken (JWT)
    const token = await generateJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  // const errors = validationResult(req);

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe con ese email.',
      });
    }

    // Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Password incorrecto',
      });
    }

    // Generar JSON WebToken (JWT)

    const token = await generateJWT(usuario.id, usuario.name);

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador.',
    });
  }

  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ ok: false, errors: errors.mapped() });
  // }
};

const revalidarToken = async (req, res = response) => {
  //   console.log('se requiere el /');

  const uid = req.uid;
  const name = req.name;

  // Generar JWT

  const token = await generateJWT(uid, name);

  res.json({
    ok: true,
    uid,
    name,
    token,
  });
};

module.exports = { crearUsuario, loginUsuario, revalidarToken };
