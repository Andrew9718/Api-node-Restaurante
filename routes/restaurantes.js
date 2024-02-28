const express = require('express');
const router = express.Router();
const Restaurantes = require('../services/restaurantes')


//mostrar todos----------------------------------------------------------------------------------------
router.get('/Mostrartodos', async function (req, res, next) {
    try {
        res.json(await Restaurantes.getMultiple(req.query.page));
    } catch (err) {
        console.error(`No ha sido posible mostrar los restaurantes `, err.message);
        next(err);
    }
});


//añadir nuevo--------------------------------------------------------------------------------------------
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const path = require('path'); // Importa el módulo 'path'
const fs = require('fs').promises;

router.post('/', upload.single('Imagen'), async function (req, res, next) {

    var ruta = "vercel no permite rutas";

    try {
        const restauranteData = req.body;
        restauranteData.Imagen = req.file ? req.file.path : null; // Guarda la ruta de la imagen

        // if (req.file) {
        //     const imgPath = path.join(__dirname, '..', req.file.path); // Ruta absoluta al archivo temporal
        //     const imgDestPath = path.join(__dirname, '..', '/Imagenes', req.file.originalname); // Ruta donde se guardará la imagen
        //    ruta = imgDestPath;
        //     await fs.rename(imgPath, imgDestPath); // Mueve el archivo a la carpeta de imágenes
        //     restauranteData.Img = imgDestPath; // Guarda la ruta de la imagen en la base de datos
        //  }
        // console.log(ruta)

        res.json(await Restaurantes.create(restauranteData, ruta));
    } catch (err) {
        console.error(`Error creando el Restaurante`, err.message);
        next(err);
    }
});




//actualiza-------------------------------------------------------------------------------------------------
router.put('/:id', upload.single('Imagen'), async function (req, res, next) {
    var ruta = "versel no permite ruta";

    try {
        const restauranteData = req.body;
        restauranteData.Imagen = req.file ? req.file.path : null; // Guarda la ruta de la imagen

        // if (req.file) {
        // comentar esta parte para versel
        // const imgPath = path.join(__dirname, '..', req.file.path); // Ruta absoluta al archivo temporal
        //  const imgDestPath = path.join(__dirname, '..', '/Imagenes', req.file.originalname); // Ruta donde se guardará la imagen
        //  ruta = imgDestPath;
        // await fs.rename(imgPath, imgDestPath); // Mueve el archivo a la carpeta de imágenes
        // restauranteData.Img = imgDestPath; // Guarda la ruta de la imagen en la base de datos
        // }
        console.log(restauranteData)

        res.json(await Restaurantes.update(req.params.id, restauranteData, ruta));
    } catch (err) {
        console.error(`Error actualizando el Restaurante`, err.message);
        next(err);
    }
});



// eliminar----------------------------------------------------------------------------------------------------

router.delete('/:id', async function (req, res, next) {
    try {
        res.json(await Restaurantes.remove(req.params.id));
    } catch (err) {

        console.error(`Error, El Restaurante no ha sido eliminado`, err.message);
        next(err);
    }
});

// busqueda de un Restaurante por ID------------------------------------------------------------------------------------

router.get('/:id', async function (req, res, next) {
    try {
        res.json(await Restaurantes.search(req.params.id));
    } catch (err) {
        console.error(`Error, No se ha realizado la busqueda `, err.message);
        next(err);
    }
});



module.exports = router;