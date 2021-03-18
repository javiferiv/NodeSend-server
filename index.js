const express = require('express');
const conectarDB = require('./config/db');

//Crear el servidor
const app = express();

//Conectar a la Base de Datos
conectarDB();

console.log("Comenzando App")

//Puerto de la app
const port = process.env.PORT || 4000;

//Habilitar leer los valores de un body
app.use(express.json());

//Rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

//Arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor conectado en el puerto ${port}`)
})