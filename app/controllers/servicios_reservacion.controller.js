const db = require('../config/db.config.js');
const ServicioReservacion = db.ServicioReservacion;

exports.create = (req, res) => {
    let servicioReservacion = {};

    try{
        // Construyendo el objeto ServicioReservacion a partir del cuerpo de la solicitud
        servicioReservacion.Reservacion_ID = req.body.Reservacion_ID;
        servicioReservacion.Servicio_ID = req.body.Servicio_ID;
        servicioReservacion.Cantidad = req.body.Cantidad;
        servicioReservacion.Precio = req.body.Precio;
    
        // Guardar en la base de datos MySQL
        ServicioReservacion.create(servicioReservacion).then(result => {    
            // Enviar mensaje de éxito al cliente
            res.status(200).json({
                message: "Servicio de Reservación creado exitosamente con id = " + result.Servicio_Reservacion_ID,
                servicioReservacion: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Error!",
            error: error.message
        });
    }
}

exports.retrieveAllServiciosReservacion = (req, res) => {
    // Buscar toda la información de ServicioReservacion
    ServicioReservacion.findAll()
        .then(servicioReservacionInfos => {
            res.status(200).json({
                message: "Obtenida toda la información de Servicios de Reservación exitosamente!",
                serviciosReservacion: servicioReservacionInfos
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

exports.getServicioReservacionById = (req, res) => {
  let servicioReservacionId = req.params.id;
  ServicioReservacion.findByPk(servicioReservacionId)
      .then(servicioReservacion => {
          res.status(200).json({
              message: "Obtenido exitosamente un Servicio de Reservación con id = " + servicioReservacionId,
              servicioReservacion: servicioReservacion
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

exports.filteringByPrecio = (req, res) => {
  let precio = req.query.precio;

    ServicioReservacion.findAll({
                      attributes: ['Servicio_Reservacion_ID', 'Reservacion_ID', 'Servicio_ID', 'Cantidad', 'Precio'],
                      where: {Precio: precio}
                    })
          .then(results => {
            res.status(200).json({
                message: "Obtenidos todos los Servicios de Reservación con precio = " + precio,
                serviciosReservacion: results,
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
  
    ServicioReservacion.findAndCountAll({ limit: limit, offset:offset })
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
              "serviciosReservacion": data.rows
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
    let precio = parseFloat(req.query.precio);
  
    const offset = page ? page * limit : 0;
  
    ServicioReservacion.findAndCountAll({
                                attributes: ['Servicio_Reservacion_ID', 'Reservacion_ID', 'Servicio_ID', 'Cantidad', 'Precio'],
                                where: {Precio: precio}, 
                                order: [
                                  ['Reservacion_ID', 'ASC'],
                                  ['Precio', 'DESC']
                                ],
                                limit: limit, 
                                offset:offset 
                              })
      .then(data => {
        const totalPages = Math.ceil(data.count / limit);
        const response = {
          message: "Paginación, filtrado y orden completados! Parámetros: page = " + page + ", limit = " + limit + ", precio = " + precio,
          data: {
              "totalItems": data.count,
              "totalPages": totalPages,
              "limit": limit,
              "precio-filtering": precio,
              "currentPageNumber": page + 1,
              "currentPageSize": data.rows.length,
              "serviciosReservacion": data.rows
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
        let servicioReservacionId = req.params.id;
        let servicioReservacion = await ServicioReservacion.findByPk(servicioReservacionId);
    
        if(!servicioReservacion){
            res.status(404).json({
                message: "No encontrado para actualizar el Servicio de Reservación con id = " + servicioReservacionId,
                servicioReservacion: "",
                error: "404"
            });
        } else {    
            let updatedObject = {
                Reservacion_ID: req.body.Reservacion_ID,
                Servicio_ID: req.body.Servicio_ID,
                Cantidad: req.body.Cantidad,
                Precio: req.body.Precio
            }
            let result = await ServicioReservacion.update(updatedObject, {returning: true, where: {Servicio_Reservacion_ID: servicioReservacionId}});
            
            if(!result) {
                res.status(500).json({
                    message: "Error -> No se puede actualizar el Servicio de Reservación con id = " + req.params.id,
                    error: "No Actualizado",
                });
            }

            res.status(200).json({
                message: "Actualización exitosa del Servicio de Reservación con id = " + servicioReservacionId,
                servicioReservacion: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> No se puede actualizar el Servicio de Reservación con id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try{
        let servicioReservacionId = req.params.id;
        let servicioReservacion = await ServicioReservacion.findByPk(servicioReservacionId);

        if(!servicioReservacion){
            res.status(404).json({
                message: "No existe un Servicio de Reservación con id = " + servicioReservacionId,
                error: "404",
            });
        } else {
            await servicioReservacion.destroy();
            res.status(200).json({
                message: "Eliminación exitosa del Servicio de Reservación con id = " + servicioReservacionId,
                servicioReservacion: servicioReservacion,
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> No se pudo eliminar el Servicio de Reservación con id = " + req.params.id,
            error: error.message,
        });
    }
}
