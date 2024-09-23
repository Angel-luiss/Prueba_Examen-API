const db = require('../config/db.config.js');
const Promocion = db.Promocion;

exports.create = (req, res) => {
    let promocion = {};

    try{
        // Construyendo el objeto Promocion a partir del cuerpo de la solicitud
        promocion.Nombre = req.body.Nombre;
        promocion.Descripcion = req.body.Descripcion;
        promocion.Descuento = req.body.Descuento;
        promocion.Fecha_Inicio = req.body.Fecha_Inicio;
        promocion.Fecha_Fin = req.body.Fecha_Fin;
    
        // Guardar en la base de datos MySQL
        Promocion.create(promocion).then(result => {    
            // Enviar mensaje de éxito al cliente
            res.status(200).json({
                message: "Subida exitosa de una Promocion con id = " + result.Promocion_ID,
                promocion: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Error!",
            error: error.message
        });
    }
}

exports.retrieveAllPromociones = (req, res) => {
    // Buscar toda la información de Promocion
    Promocion.findAll()
        .then(promocionInfos => {
            res.status(200).json({
                message: "Obtenida toda la información de Promociones exitosamente!",
                promociones: promocionInfos
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

exports.getPromocionById = (req, res) => {
  let promocionId = req.params.id;
  Promocion.findByPk(promocionId)
      .then(promocion => {
          res.status(200).json({
              message: "Obtenida exitosamente una Promocion con id = " + promocionId,
              promocion: promocion
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

exports.filteringByDescuento = (req, res) => {
  let descuento = req.query.descuento;

    Promocion.findAll({
                      attributes: ['Promocion_ID', 'Nombre', 'Descripcion', 'Descuento', 'Fecha_Inicio', 'Fecha_Fin'],
                      where: {Descuento: descuento}
                    })
          .then(results => {
            res.status(200).json({
                message: "Obtenidas todas las Promociones con descuento = " + descuento,
                promociones: results,
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
  
    Promocion.findAndCountAll({ limit: limit, offset:offset })
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
              "promociones": data.rows
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
    let descuento = parseFloat(req.query.descuento);
  
    const offset = page ? page * limit : 0;
  
    Promocion.findAndCountAll({
                                attributes: ['Promocion_ID', 'Nombre', 'Descripcion', 'Descuento', 'Fecha_Inicio', 'Fecha_Fin'],
                                where: {Descuento: descuento}, 
                                order: [
                                  ['Nombre', 'ASC'],
                                  ['Fecha_Fin', 'DESC']
                                ],
                                limit: limit, 
                                offset:offset 
                              })
      .then(data => {
        const totalPages = Math.ceil(data.count / limit);
        const response = {
          message: "Paginación, filtrado y orden completados! Parámetros: page = " + page + ", limit = " + limit + ", descuento = " + descuento,
          data: {
              "totalItems": data.count,
              "totalPages": totalPages,
              "limit": limit,
              "descuento-filtering": descuento,
              "currentPageNumber": page + 1,
              "currentPageSize": data.rows.length,
              "promociones": data.rows
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
        let promocionId = req.params.id;
        let promocion = await Promocion.findByPk(promocionId);
    
        if(!promocion){
            res.status(404).json({
                message: "No encontrada para actualizar la Promocion con id = " + promocionId,
                promocion: "",
                error: "404"
            });
        } else {    
            let updatedObject = {
                Nombre: req.body.Nombre,
                Descripcion: req.body.Descripcion,
                Descuento: req.body.Descuento,
                Fecha_Inicio: req.body.Fecha_Inicio,
                Fecha_Fin: req.body.Fecha_Fin
            }
            let result = await Promocion.update(updatedObject, {returning: true, where: {Promocion_ID: promocionId}});
            
            if(!result) {
                res.status(500).json({
                    message: "Error -> No se puede actualizar la Promocion con id = " + req.params.id,
                    error: "No Actualizado",
                });
            }

            res.status(200).json({
                message: "Actualización exitosa de la Promocion con id = " + promocionId,
                promocion: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> No se puede actualizar la Promocion con id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try{
        let promocionId = req.params.id;
        let promocion = await Promocion.findByPk(promocionId);

        if(!promocion){
            res.status(404).json({
                message: "No existe una Promocion con id = " + promocionId,
                error: "404",
            });
        } else {
            await promocion.destroy();
            res.status(200).json({
                message: "Eliminación exitosa de la Promocion con id = " + promocionId,
                promocion: promocion,
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> No se pudo eliminar la Promocion con id = " + req.params.id,
            error: error.message,
        });
    }
}
