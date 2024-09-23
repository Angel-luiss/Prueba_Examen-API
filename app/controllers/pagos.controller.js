const db = require('../config/db.config.js');
const Pago = db.Pago;

exports.create = (req, res) => {
    let pago = {};

    try{
        // Construyendo el objeto Pago a partir del cuerpo de la solicitud
        pago.Reservacion_ID = req.body.Reservacion_ID;
        pago.Monto_Total = req.body.Monto_Total;
        pago.Fecha_Pago = req.body.Fecha_Pago;
        pago.Metodo_Pago = req.body.Metodo_Pago;
        pago.Estado_Pago = req.body.Estado_Pago;
    
        // Guardar en la base de datos MySQL
        Pago.create(pago).then(result => {    
            // Enviar mensaje de éxito al cliente
            res.status(200).json({
                message: "Pago creado exitosamente con id = " + result.Pago_ID,
                pago: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Error!",
            error: error.message
        });
    }
}

exports.retrieveAllPagos = (req, res) => {
    // Buscar toda la información de Pago
    Pago.findAll()
        .then(pagoInfos => {
            res.status(200).json({
                message: "Obtenida toda la información de Pagos exitosamente!",
                pagos: pagoInfos
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

exports.getPagoById = (req, res) => {
  let pagoId = req.params.id;
  Pago.findByPk(pagoId)
      .then(pago => {
          res.status(200).json({
              message: "Pago obtenido exitosamente con id = " + pagoId,
              pago: pago
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

    Pago.findAll({
                      attributes: ['Pago_ID', 'Reservacion_ID', 'Monto_Total', 'Fecha_Pago', 'Metodo_Pago', 'Estado_Pago'],
                      where: {Estado_Pago: estado}
                    })
          .then(results => {
            res.status(200).json({
                message: "Obtenidos todos los pagos con estado = " + estado,
                pagos: results,
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
  
    Pago.findAndCountAll({ limit: limit, offset:offset })
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
              "pagos": data.rows
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
  
    Pago.findAndCountAll({
                                attributes: ['Pago_ID', 'Reservacion_ID', 'Monto_Total', 'Fecha_Pago', 'Metodo_Pago', 'Estado_Pago'],
                                where: {Estado_Pago: estado}, 
                                order: [
                                  ['Fecha_Pago', 'ASC'],
                                  ['Monto_Total', 'DESC']
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
              "pagos": data.rows
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
        let pagoId = req.params.id;
        let pago = await Pago.findByPk(pagoId);
    
        if(!pago){
            res.status(404).json({
                message: "No encontrado para actualizar el Pago con id = " + pagoId,
                pago: "",
                error: "404"
            });
        } else {    
            let updatedObject = {
                Reservacion_ID: req.body.Reservacion_ID,
                Monto_Total: req.body.Monto_Total,
                Fecha_Pago: req.body.Fecha_Pago,
                Metodo_Pago: req.body.Metodo_Pago,
                Estado_Pago: req.body.Estado_Pago
            }
            let result = await Pago.update(updatedObject, {returning: true, where: {Pago_ID: pagoId}});
            
            if(!result) {
                res.status(500).json({
                    message: "Error -> No se puede actualizar el Pago con id = " + req.params.id,
                    error: "No Actualizado",
                });
            }

            res.status(200).json({
                message: "Actualización exitosa del Pago con id = " + pagoId,
                pago: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> No se puede actualizar el Pago con id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try{
        let pagoId = req.params.id;
        let pago = await Pago.findByPk(pagoId);

        if(!pago){
            res.status(404).json({
                message: "No existe un Pago con id = " + pagoId,
                error: "404",
            });
        } else {
            await pago.destroy();
            res.status(200).json({
                message: "Eliminación exitosa del Pago con id = " + pagoId,
                pago: pago,
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> No se pudo eliminar el Pago con id = " + req.params.id,
            error: error.message,
        });
    }
}
