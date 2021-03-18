const Enlaces = require('./../models/Enlace');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.nuevoEnlace = async (req, res, next) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    //Crear un objeto de Enlace
    const { nombreOriginal } = req.body;
    const enlace = new Enlaces();
    enlace.url = shortid.generate();
    enlace.nombre = shortid.generate();
    enlace.nombreOriginal = nombreOriginal;

    //Si el usuario está autenticado
    if (req.usuario) {
        const { password, descargas } = req.body;

        //Asignar a enlace el número de descargas
        if (descargas) {
            enlace.descargas = descargas;
        }

        //Asignar un password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password, salt)
        }

        //Asignar el autor
        enlace.autor = req.usuario.id;
    }

    try {
        await enlace.save();
        return res.json({ msg: `${enlace.url}` })
        next();
    }
    catch (error) {
        console.log(error)
    }
   
}