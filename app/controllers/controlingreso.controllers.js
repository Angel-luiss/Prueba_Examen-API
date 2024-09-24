const db = require('../config/db.config.js');
const ControlIngreso = db.ControlIngreso;

exports.create = (req, res) => {
    let controlIngreso = {};

    try {
        // Construyendo el objeto ControlIngreso a partir del cuerpo de la solicitud
        controlIngreso.id_Catedratico = req.body.id_Catedratico;
        controlIngreso.FechaHoraIngreso = req.body.FechaHoraIngreso;
        controlIngreso.FechaHoraSalida = req.body.FechaHoraSalida;
        controlIngreso.Estatus = req.body.Estatus;

        // Guardar en la base de datos
        ControlIngreso.create(controlIngreso).then(result => {
            // Enviar mensaje de éxito al cliente
            res.status(200).json({
                message: "Subido correctamente un registro de Control de Ingreso con id = " + result.id_ingreso,
                controlIngreso: result,
            });
        });
    } catch (error) {
        res.status(500).json({
            message: "Error!",
            error: error.message
        });
    }
};

exports.retrieveAll = (req, res) => {
    // Buscar toda la información de Control de Ingreso
    ControlIngreso.findAll()
        .then(controlIngresoInfos => {
            res.status(200).json({
                message: "Obtenida toda la información de Control de Ingreso exitosamente!",
                controlIngresos: controlIngresoInfos
            });
        })
        .catch(error => {
            console.log(error);

            res.status(500).json({
                message: "Error!",
                error: error
            });
        });
};

exports.getById = (req, res) => {
    let ingresoId = req.params.id;
    ControlIngreso.findByPk(ingresoId)
        .then(controlIngreso => {
            res.status(200).json({
                message: "Obtenido exitosamente un Control de Ingreso con id = " + ingresoId,
                controlIngreso: controlIngreso
            });
        })
        .catch(error => {
            console.log(error);

            res.status(500).json({
                message: "Error!",
                error: error
            });
        });
};

exports.updateById = async (req, res) => {
    try {
        let ingresoId = req.params.id;
        let controlIngreso = await ControlIngreso.findByPk(ingresoId);

        if (!controlIngreso) {
            res.status(404).json({
                message: "No encontrado para actualizar el Control de Ingreso con id = " + ingresoId,
                controlIngreso: "",
                error: "404"
            });
        } else {
            let updatedObject = {
                id_Catedratico: req.body.id_Catedratico,
                FechaHoraIngreso: req.body.FechaHoraIngreso,
                FechaHoraSalida: req.body.FechaHoraSalida,
                Estatus: req.body.Estatus
            };
            let result = await ControlIngreso.update(updatedObject, { returning: true, where: { id_ingreso: ingresoId } });

            if (!result) {
                res.status(500).json({
                    message: "Error -> No se puede actualizar el Control de Ingreso con id = " + req.params.id,
                    error: "No actualizado",
                });
            }

            res.status(200).json({
                message: "Actualización exitosa del Control de Ingreso con id = " + ingresoId,
                controlIngreso: updatedObject,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> No se puede actualizar el Control de Ingreso con id = " + req.params.id,
            error: error.message
        });
    }
};

exports.deleteById = async (req, res) => {
    try {
        let ingresoId = req.params.id;
        let controlIngreso = await ControlIngreso.findByPk(ingresoId);

        if (!controlIngreso) {
            res.status(404).json({
                message: "No existe un Control de Ingreso con id = " + ingresoId,
                error: "404",
            });
        } else {
            await controlIngreso.destroy();
            res.status(200).json({
                message: "Eliminación exitosa del Control de Ingreso con id = " + ingresoId,
                controlIngreso: controlIngreso,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> No se pudo eliminar el Control de Ingreso con id = " + req.params.id,
            error: error.message,
        });
    }
};
