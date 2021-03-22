const { CustomValidation } = require('express-validator/src/context-items');
const Enlaces = require('./../models/Enlace');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');


exports.subirArchivos = async (req, res, next) => {
    const configuracionMulter = {
        limits: { fileSize: req.usuario ? 1024 * 1024 * 100 : 1000000 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            },

        })
    };

    const upload = multer(configuracionMulter).single('archivo');

    upload(req, res, async (error) => {
        if (!error) {
            res.json({ archivo: req.file.filename });
        }
        else {
            console.log(error);
            return next();
        }
    });
  
};

//Descarga un archivo
exports.descargar = async (req, res, next) => {

    //Obtiene el enlace
    const enlace = await Enlaces.findOne({nombre : req.params.archivo})

    const archivoDescarga = __dirname + '/../uploads/' + req.params.archivo;
    res.download(archivoDescarga);

    //Eliminar el archivo
    //Si las descargas son iguales a 1 - Borrar entrada y borrar archivo
    const { descargas, nombre } = enlace;

    if (descargas === 1) {
        //Eliminar el archivo
        req.archivo = nombre;

        //Eliminar la entrada de la BBDD
        await Enlaces.findOneAndRemove(enlace.id);
        next();
    }
    else {
        //Si las descargas son mayores a 1 - Restar una descarga
        enlace.descargas--;
        await enlace.save();
    }

};

//Eliminar un archivo
exports.eliminarArchivos = async (req, res) => {

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`)
        console.log("Archivo eliminado")
    }
    catch (error) {
        console.log(error)
    }
};