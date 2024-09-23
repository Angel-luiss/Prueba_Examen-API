const db = require('../config/db.config.js');
const Servicio = db.Servicio;

exports.create = (req, res) => {
    let servicio = {};

    try{
        // Construyendo el objeto Servicio a partir del cuerpo de la solicitud
        servicio.Nombre_Servicio = req.body.Nombre_Servicio;
        servicio.Descripcion = req.body.Descripcion;
        servicio.Precio = req.body.Precio;
        servicio.Duracion = req.body.Duracion;
    
        // Guardar en la base de datos MySQL
        Servicio.create(servicio).then(result => {    
            // Enviar mensaje de éxito al cliente
            res.status(200).json({
                message: "Subida exitosa de un Servicio con id = " + result.Servicio_ID,
                servicio: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Error!",
            error: error.message
        });
    }
}

exports.retrieveAllServicios = (req, res) => {
    // Buscar toda la información de Servicio
    Servicio.findAll()
        .then(servicioInfos => {
            res.status(200).json({
                message: "Obtenida toda la información de Servicios exitosamente!",
                servicios: servicioInfos
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

exports.getServicioById = (req, res) => {
  let servicioId = req.params.id;
  Servicio.findByPk(servicioId)
      .then(servicio => {
          res.status(200).json({
              message: "Obtenido exitosamente un Servicio con id = " + servicioId,
              servicio: servicio
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

    Servicio.findAll({
                      attributes: ['Servicio_ID', 'Nombre_Servicio', 'Descripcion', 'Precio', 'Duracion'],
                      where: {Precio: precio}
                    })
          .then(results => {
            res.status(200).json({
                message: "Obtenidos todos los Servicios con precio = " + precio,
                servicios: results,
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
  
    Servicio.findAndCountAll({ limit: limit, offset:offset })
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
              "servicios": data.rows
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
  
    Servicio.findAndCountAll({
                                attributes: ['Servicio_ID', 'Nombre_Servicio', 'Descripcion', 'Precio', 'Duracion'],
                                where: {Precio: precio}, 
                                order: [
                                  ['Nombre_Servicio', 'ASC'],
                                  ['Duracion', 'DESC']
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
              "servicios": data.rows
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
        let servicioId = req.params.id;
        let servicio = await Servicio.findByPk(servicioId);
    
        if(!servicio){
            res.status(404).json({
                message: "No encontrado para actualizar el Servicio con id = " + servicioId,
                servicio: "",
                error: "404"
            });
        } else {    
            let updatedObject = {
                Nombre_Servicio: req.body.Nombre_Servicio,
                Descripcion: req.body.Descripcion,
                Precio: req.body.Precio,
                Duracion: req.body.Duracion
            }
            let result = await Servicio.update(updatedObject, {returning: true, where: {Servicio_ID: servicioId}});
            
            if(!result) {
                res.status(500).json({
                    message: "Error -> No se puede actualizar el Servicio con id = " + req.params.id,
                    error: "No Actualizado",
                });
            }

            res.status(200).json({
                message: "Actualización exitosa del Servicio con id = " + servicioId,
                servicio: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> No se puede actualizar el Servicio con id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try{
        let servicioId = req.params.id;
        let servicio = await Servicio.findByPk(servicioId);

        if(!servicio){
            res.status(404).json({
                message: "No existe un Servicio con id = " + servicioId,
                error: "404",
            });
        } else {
            await servicio.destroy();
            res.status(200).json({
                message: "Eliminación exitosa del Servicio con id = " + servicioId,
                servicio: servicio,
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> No se pudo eliminar el Servicio con id = " + req.params.id,
            error: error.message,
        });
    }
}
