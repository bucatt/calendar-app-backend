const express = require('express');
const { dbConnection } = require('./db/config');
require('dotenv').config();
const cors = require('cors');

console.log(process.env);
//Crear el servidor de express

const app = express();

//DB

dbConnection();

// CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Rutas

// TODO: auth // crear, login, renew
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// TODO: CRUD: Eventos

// Directorio publico

app.use(express.static('public'));

// Escuchar preticiones

app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo en puerto ${process.env.PORT}`);
});
