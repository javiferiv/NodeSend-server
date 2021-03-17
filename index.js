const express = require('express');
const conectarDB = require('./config/db');

//Crear el servidor
const app = express();

//Conectar a la Base de Datos
conectarDB();

console.log("Comenzando App")

//Puerto de la app
const port = process.env.PORT || 4000;

//Arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor conectado en el puerto ${port}`)
})