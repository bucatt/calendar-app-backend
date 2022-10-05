const express = require('express');
const { dbConnection } = require('./db/config');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

console.log(process.env);
//Crear el servidor de express

const app = express();

//DB

dbConnection();

// CORS
app.use(cors());

// Directorio publico

app.use(express.static(__dirname + '/public'));

// Lectura y parseo del body
app.use(express.json());

// Rutas

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Escuchar preticiones

app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo en puerto ${process.env.PORT}`);
});
