const db = require('../config/db.config.js');
const Horario = db.Horario;

exports.create = (req, res) => {
    let horario = {};

    try {
        // Construyendo el objeto Horario a partir del cuerpo de la solicitud
        horario.id_catedratico = req.body.id_catedratico;
        horario.curso = req.body.curso;
        horario.hora_inicio = req.body.hora_inicio;
        horario.hora_fin = req.body.hora_fin;
    
        // Guardar en la base de datos
        Horario.create(horario).then(result => {    
            // Enviar mensaje de éxito al cliente
            res.status(200).json({
                message: "Subido correctamente un Horario con id = " + result.id_horario,
                horario: result,
            });
        });
    } catch (error) {
        res.status(500).json({
            message: "Error!",
            error: error.message
        });
    }
}

exports.retrieveAllHorarios = (req, res) => {
    // Buscar toda la información de Horarios
    Horario.findAll()
        .then(horarioInfos => {
            res.status(200).json({
                message: "Obtenida toda la información de Horarios exitosamente!",
                horarios: horarioInfos
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error!",
                error: error
            });
        });
}

exports.getHorarioById = (req, res) => {
    let horarioId = req.params.id;
    Horario.findByPk(horarioId)
        .then(horario => {
            res.status(200).json({
                message: "Obtenido exitosamente un Horario con id = " + horarioId,
                horario: horario
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error!",
                error: error
            });
        });
}

exports.updateById = async (req, res) => {
    try {
        let horarioId = req.params.id;
        let horario = await Horario.findByPk(horarioId);
    
        if (!horario) {
            res.status(404).json({
                message: "No encontrado para actualizar el Horario con id = " + horarioId,
                horario: "",
                error: "404"
            });
        } else {    
            let updatedObject = {
                id_catedratico: req.body.id_catedratico,
                curso: req.body.curso,
                hora_inicio: req.body.hora_inicio,
                hora_fin: req.body.hora_fin
            }
            let result = await Horario.update(updatedObject, { returning: true, where: { id_horario: horarioId } });
            
            if (!result) {
                res.status(500).json({
                    message: "Error -> No se puede actualizar el Horario con id = " + req.params.id,
                    error: "No actualizado",
                });
            }

            res.status(200).json({
                message: "Actualización exitosa del Horario con id = " + horarioId,
                horario: updatedObject,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> No se puede actualizar el Horario con id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try {
        let horarioId = req.params.id;
        let horario = await Horario.findByPk(horarioId);

        if (!horario) {
            res.status(404).json({
                message: "No existe un Horario con id = " + horarioId,
                error: "404",
            });
        } else {
            await horario.destroy();
            res.status(200).json({
                message: "Eliminación exitosa del Horario con id = " + horarioId,
                horario: horario,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> No se pudo eliminar el Horario con id = " + req.params.id,
            error: error.message,
        });
    }
}
