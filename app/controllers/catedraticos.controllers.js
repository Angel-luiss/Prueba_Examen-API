const db = require('../config/db.config.js');
const Catedratico = db.Catedratico;

exports.create = (req, res) => {
    let catedratico = {};

    try{
        // Construyendo el objeto Catedratico a partir del cuerpo de la solicitud
        catedratico.NombreCompleto = req.body.NombreCompleto;
        catedratico.FechaContratacion = req.body.FechaContratacion;
        catedratico.FechaNacimiento = req.body.FechaNacimiento;
        catedratico.Genero = req.body.Genero;
        catedratico.Titulo = req.body.Titulo;
        catedratico.Salario = req.body.Salario;
    
        // Guardar en la base de datos
        Catedratico.create(catedratico).then(result => {    
            // Enviar mensaje de éxito al cliente
            res.status(200).json({
                message: "Subido correctamente un Catedratico con id = " + result.IdCatedratico,
                catedratico: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Error!",
            error: error.message
        });
    }
}

exports.retrieveAllCatedraticos = (req, res) => {
    // Buscar toda la información de Catedratico
    Catedratico.findAll()
        .then(catedraticoInfos => {
            res.status(200).json({
                message: "Obtenida toda la información de Catedraticos exitosamente!",
                catedraticos: catedraticoInfos
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

exports.getCatedraticoById = (req, res) => {
  let catedraticoId = req.params.id;
  Catedratico.findByPk(catedraticoId)
      .then(catedratico => {
          res.status(200).json({
              message: "Obtenido exitosamente un Catedratico con id = " + catedraticoId,
              catedratico: catedratico
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
    try{
        let catedraticoId = req.params.id;
        let catedratico = await Catedratico.findByPk(catedraticoId);
    
        if(!catedratico){
            res.status(404).json({
                message: "No encontrado para actualizar el Catedratico con id = " + catedraticoId,
                catedratico: "",
                error: "404"
            });
        } else {    
            let updatedObject = {
                NombreCompleto: req.body.NombreCompleto,
                FechaContratacion: req.body.FechaContratacion,
                FechaNacimiento: req.body.FechaNacimiento,
                Genero: req.body.Genero,
                Titulo: req.body.Titulo,
                Salario: req.body.Salario
            }
            let result = await Catedratico.update(updatedObject, {returning: true, where: {IdCatedratico: catedraticoId}});
            
            if(!result) {
                res.status(500).json({
                    message: "Error -> No se puede actualizar el Catedratico con id = " + req.params.id,
                    error: "No actualizado",
                });
            }

            res.status(200).json({
                message: "Actualización exitosa del Catedratico con id = " + catedraticoId,
                catedratico: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> No se puede actualizar el Catedratico con id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try{
        let catedraticoId = req.params.id;
        let catedratico = await Catedratico.findByPk(catedraticoId);

        if(!catedratico){
            res.status(404).json({
                message: "No existe un Catedratico con id = " + catedraticoId,
                error: "404",
            });
        } else {
            await catedratico.destroy();
            res.status(200).json({
                message: "Eliminación exitosa del Catedratico con id = " + catedraticoId,
                catedratico: catedratico,
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> No se pudo eliminar el Catedratico con id = " + req.params.id,
            error: error.message,
        });
    }
}
