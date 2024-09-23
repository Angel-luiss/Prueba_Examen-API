const db = require('../config/db.config.js');
const LogDisponibilidad = db.LogDisponibilidad;

exports.create = (req, res) => {
    let logDisponibilidad = {};

    try{
        // Construyendo el objeto LogDisponibilidad a partir del cuerpo de la solicitud
        logDisponibilidad.Habitacion_ID = req.body.Habitacion_ID;
        logDisponibilidad.Estado = req.body.Estado;
        logDisponibilidad.Fecha_Cambio = req.body.Fecha_Cambio;
        logDisponibilidad.Comentarios = req.body.Comentarios;
    
        // Guardar en la base de datos MySQL
        LogDisponibilidad.create(logDisponibilidad).then(result => {    
            // Enviar mensaje de éxito al cliente
            res.status(200).json({
                message: "Log de Disponibilidad creado exitosamente con id = " + result.Log_ID,
                logDisponibilidad: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Error!",
            error: error.message
        });
    }
}

exports.retrieveAllLogs = (req, res) => {
    // Buscar toda la información de LogDisponibilidad
    LogDisponibilidad.findAll()
        .then(logInfos => {
            res.status(200).json({
                message: "Obtenida toda la información de Logs de Disponibilidad exitosamente!",
                logs: logInfos
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

exports.getLogById = (req, res) => {
  let logId = req.params.id;
  LogDisponibilidad.findByPk(logId)
      .then(log => {
          res.status(200).json({
              message: "Log de Disponibilidad obtenido exitosamente con id = " + logId,
              log: log
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

exports.filteringByEstado = (req, res) => {
  let estado = req.query.estado;

    LogDisponibilidad.findAll({
                      attributes: ['Log_ID', 'Habitacion_ID', 'Estado', 'Fecha_Cambio', 'Comentarios'],
                      where: {Estado: estado}
                    })
          .then(results => {
            res.status(200).json({
                message: "Obtenidos todos los logs con estado = " + estado,
                logs: results,
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
 
exports.pagination = (req, res) => {
  try{
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
  
    const offset = page ? page * limit : 0;
  
    LogDisponibilidad.findAndCountAll({ limit: limit, offset:offset })
      .then(data => {
        const totalPages = Math.ceil(data.count / limit);
        const response = {
          message: "Paginación completada! Parámetros: page = " + page + ", limit = " + limit,
          data: {
              "totalItems": data.count,
              "totalPages": totalPages,
              "limit": limit,
              "currentPageNumber": page + 1,
              "currentPageSize": data.rows.length,
              "logs": data.rows
          }
        };
        res.send(response);
      });  
  }catch(error) {
    res.status(500).send({
      message: "Error -> No se pudo completar la solicitud de paginación!",
      error: error.message,
    });
  }    
}

exports.pagingfilteringsorting = (req, res) => {
  try{
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let estado = req.query.estado;
  
    const offset = page ? page * limit : 0;
  
    LogDisponibilidad.findAndCountAll({
                                attributes: ['Log_ID', 'Habitacion_ID', 'Estado', 'Fecha_Cambio', 'Comentarios'],
                                where: {Estado: estado}, 
                                order: [
                                  ['Fecha_Cambio', 'ASC'],
                                  ['Estado', 'DESC']
                                ],
                                limit: limit, 
                                offset:offset 
                              })
      .then(data => {
        const totalPages = Math.ceil(data.count / limit);
        const response = {
          message: "Paginación, filtrado y orden completados! Parámetros: page = " + page + ", limit = " + limit + ", estado = " + estado,
          data: {
              "totalItems": data.count,
              "totalPages": totalPages,
              "limit": limit,
              "estado-filtering": estado,
              "currentPageNumber": page + 1,
              "currentPageSize": data.rows.length,
              "logs": data.rows
          }
        };
        res.send(response);
      });  
  }catch(error) {
    res.status(500).send({
      message: "Error -> No se pudo completar la solicitud de paginación!",
      error: error.message,
    });
  }      
}

exports.updateById = async (req, res) => {
    try{
        let logId = req.params.id;
        let log = await LogDisponibilidad.findByPk(logId);
    
        if(!log){
            res.status(404).json({
                message: "No encontrado para actualizar el Log con id = " + logId,
                log: "",
                error: "404"
            });
        } else {    
            let updatedObject = {
                Habitacion_ID: req.body.Habitacion_ID,
                Estado: req.body.Estado,
                Fecha_Cambio: req.body.Fecha_Cambio,
                Comentarios: req.body.Comentarios
            }
            let result = await LogDisponibilidad.update(updatedObject, {returning: true, where: {Log_ID: logId}});
            
            if(!result) {
                res.status(500).json({
                    message: "Error -> No se puede actualizar el Log con id = " + req.params.id,
                    error: "No Actualizado",
                });
            }

            res.status(200).json({
                message: "Actualización exitosa del Log con id = " + logId,
                log: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> No se puede actualizar el Log con id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try{
        let logId = req.params.id;
        let log = await LogDisponibilidad.findByPk(logId);

        if(!log){
            res.status(404).json({
                message: "No existe un Log con id = " + logId,
                error: "404",
            });
        } else {
            await log.destroy();
            res.status(200).json({
                message: "Eliminación exitosa del Log con id = " + logId,
                log: log,
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> No se pudo eliminar el Log con id = " + req.params.id,
            error: error.message,
        });
    }
}
