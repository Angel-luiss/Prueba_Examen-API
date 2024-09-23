const db = require('../config/db.config.js');
const Precio = db.Precio;

exports.create = (req, res) => {
    let precio = {};

    try{
        // Construir el objeto Precio a partir del cuerpo de la solicitud
        precio.Tipo_Mascota = req.body.Tipo_Mascota;
        precio.Tipo_Habitacion = req.body.Tipo_Habitacion;
        precio.Precio_Diario = req.body.Precio_Diario;
    
        // Guardar en la base de datos MySQL
        Precio.create(precio).then(result => {    
            // Enviar mensaje de éxito al cliente
            res.status(200).json({
                message: "Upload Successfully a Precio with id = " + result.Precio_ID,
                precio: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
}

exports.retrieveAllPrecios = (req, res) => {
    // Encontrar toda la información de Precio
    Precio.findAll()
        .then(precioInfos => {
            res.status(200).json({
                message: "Get all Precios' Infos Successfully!",
                precios: precioInfos
            });
        })
        .catch(error => {
            // Log en consola
            console.log(error);

            res.status(500).json({
                message: "Error!",
                error: error
            });
        });
}

exports.getPrecioById = (req, res) => {
    // Encontrar la información de Precio por ID
    let precioId = req.params.id;
    Precio.findByPk(precioId)
        .then(precio => {
            res.status(200).json({
                message: "Successfully Get a Precio with id = " + precioId,
                precio: precio
            });
        })
        .catch(error => {
            // Log en consola
            console.log(error);

            res.status(500).json({
                message: "Error!",
                error: error
            });
        });
}

exports.updateById = async (req, res) => {
    try {
        let precioId = req.params.id;
        let precio = await Precio.findByPk(precioId);

        if (!precio) {
            // Enviar respuesta al cliente
            res.status(404).json({
                message: "Not Found for updating a Precio with id = " + precioId,
                precio: "",
                error: "404"
            });
        } else {
            // Actualizar los cambios en la base de datos
            let updatedObject = {
                Tipo_Mascota: req.body.Tipo_Mascota,
                Tipo_Habitacion: req.body.Tipo_Habitacion,
                Precio_Diario: req.body.Precio_Diario
            }
            let result = await Precio.update(updatedObject, { returning: true, where: { Precio_ID: precioId } });

            // Enviar respuesta al cliente
            if (!result) {
                res.status(500).json({
                    message: "Error -> Can not update a Precio with id = " + req.params.id,
                    error: "Can NOT Updated",
                });
            }

            res.status(200).json({
                message: "Update successfully a Precio with id = " + precioId,
                precio: updatedObject,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> Can not update a Precio with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try {
        let precioId = req.params.id;
        let precio = await Precio.findByPk(precioId);

        if (!precio) {
            res.status(404).json({
                message: "Does Not exist a Precio with id = " + precioId,
                error: "404",
            });
        } else {
            await precio.destroy();
            res.status(200).json({
                message: "Delete Successfully a Precio with id = " + precioId,
                precio: precio,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> Can NOT delete a Precio with id = " + req.params.id,
            error: error.message,
        });
    }
}
