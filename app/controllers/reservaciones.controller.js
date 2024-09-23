const db = require('../config/db.config.js');
const Reservacion = db.Reservacion;

exports.create = (req, res) => {
    let reservacion = {};

    try{
        // Construyendo el objeto Reservacion a partir del cuerpo de la solicitud
        reservacion.Mascota_ID = req.body.Mascota_ID;
        reservacion.Habitacion_ID = req.body.Habitacion_ID;
        reservacion.Fecha_Entrada = req.body.Fecha_Entrada;
        reservacion.Fecha_Salida = req.body.Fecha_Salida;
        reservacion.Estado_Reservacion = req.body.Estado_Reservacion;
        reservacion.Total = req.body.Total;
        reservacion.Notas = req.body.Notas;
    
        // Guardar en la base de datos MySQL
        Reservacion.create(reservacion).then(result => {    
            // Enviar mensaje de éxito al cliente
            res.status(200).json({
                message: "Reservación creada exitosamente con id = " + result.Reservacion_ID,
                reservacion: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Error!",
            error: error.message
        });
    }
}

exports.retrieveAllReservaciones = (req, res) => {
    // Buscar toda la información de Reservacion
    Reservacion.findAll()
        .then(reservacionInfos => {
            res.status(200).json({
                message: "Obtenida toda la información de Reservaciones exitosamente!",
                reservaciones: reservacionInfos
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

exports.getReservacionById = (req, res) => {
  let reservacionId = req.params.id;
  Reservacion.findByPk(reservacionId)
      .then(reservacion => {
          res.status(200).json({
              message: "Obtenida exitosamente una Reservacion con id = " + reservacionId,
              reservacion: reservacion
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

    Reservacion.findAll({
                      attributes: ['Reservacion_ID', 'Mascota_ID', 'Habitacion_ID', 'Fecha_Entrada', 'Fecha_Salida', 'Estado_Reservacion', 'Total', 'Notas'],
                      where: {Estado_Reservacion: estado}
                    })
          .then(results => {
            res.status(200).json({
                message: "Obtenidas todas las Reservaciones con estado = " + estado,
                reservaciones: results,
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
  
    Reservacion.findAndCountAll({ limit: limit, offset:offset })
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
              "reservaciones": data.rows
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
  
    Reservacion.findAndCountAll({
                                attributes: ['Reservacion_ID', 'Mascota_ID', 'Habitacion_ID', 'Fecha_Entrada', 'Fecha_Salida', 'Estado_Reservacion', 'Total', 'Notas'],
                                where: {Estado_Reservacion: estado}, 
                                order: [
                                  ['Fecha_Entrada', 'ASC'],
                                  ['Total', 'DESC']
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
              "reservaciones": data.rows
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
        let reservacionId = req.params.id;
        let reservacion = await Reservacion.findByPk(reservacionId);
    
        if(!reservacion){
            res.status(404).json({
                message: "No encontrada para actualizar la Reservacion con id = " + reservacionId,
                reservacion: "",
                error: "404"
            });
        } else {    
            let updatedObject = {
                Mascota_ID: req.body.Mascota_ID,
                Habitacion_ID: req.body.Habitacion_ID,
                Fecha_Entrada: req.body.Fecha_Entrada,
                Fecha_Salida: req.body.Fecha_Salida,
                Estado_Reservacion: req.body.Estado_Reservacion,
                Total: req.body.Total,
                Notas: req.body.Notas
            }
            let result = await Reservacion.update(updatedObject, {returning: true, where: {Reservacion_ID: reservacionId}});
            
            if(!result) {
                res.status(500).json({
                    message: "Error -> No se puede actualizar la Reservacion con id = " + req.params.id,
                    error: "No Actualizado",
                });
            }

            res.status(200).json({
                message: "Actualización exitosa de la Reservacion con id = " + reservacionId,
                reservacion: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> No se puede actualizar la Reservacion con id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try{
        let reservacionId = req.params.id;
        let reservacion = await Reservacion.findByPk(reservacionId);

        if(!reservacion){
            res.status(404).json({
                message: "No existe una Reservacion con id = " + reservacionId,
                error: "404",
            });
        } else {
            await reservacion.destroy();
            res.status(200).json({
                message: "Eliminación exitosa de la Reservacion con id = " + reservacionId,
                reservacion: reservacion,
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> No se pudo eliminar la Reservacion con id = " + req.params.id,
            error: error.message,
        });
    }
}
