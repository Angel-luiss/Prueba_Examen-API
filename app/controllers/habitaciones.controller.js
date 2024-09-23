const db = require('../config/db.config.js');
const Habitacion = db.Habitacion;

exports.create = (req, res) => {
    let habitacion = {};

    try{
        // Construyendo el objeto Habitacion a partir del cuerpo de la solicitud
        habitacion.Nombre_Habitacion = req.body.Nombre_Habitacion;
        habitacion.Estado = req.body.Estado;
        habitacion.Capacidad_Maxima = req.body.Capacidad_Maxima;
        habitacion.Tipo_Habitacion = req.body.Tipo_Habitacion;
        habitacion.Ubicacion = req.body.Ubicacion;
        habitacion.Descripcion = req.body.Descripcion;
        habitacion.Precio_Base = req.body.Precio_Base;
    
        // Guardar en la base de datos MySQL
        Habitacion.create(habitacion).then(result => {    
            // Enviar mensaje de éxito al cliente
            res.status(200).json({
                message: "Subida exitosa de una Habitacion con id = " + result.Habitacion_ID,
                habitacion: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Error!",
            error: error.message
        });
    }
}

exports.retrieveAllHabitaciones = (req, res) => {
    // Buscar toda la información de Habitacion
    Habitacion.findAll()
        .then(habitacionInfos => {
            res.status(200).json({
                message: "Obtenida toda la información de Habitaciones exitosamente!",
                habitaciones: habitacionInfos
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

exports.getHabitacionById = (req, res) => {
  let habitacionId = req.params.id;
  Habitacion.findByPk(habitacionId)
      .then(habitacion => {
          res.status(200).json({
              message: "Obtenida exitosamente una Habitacion con id = " + habitacionId,
              habitacion: habitacion
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

exports.filteringByCapacidad = (req, res) => {
  let capacidad = req.query.capacidad;

    Habitacion.findAll({
                      attributes: ['Habitacion_ID', 'Nombre_Habitacion', 'Estado', 'Capacidad_Maxima', 'Tipo_Habitacion', 'Ubicacion', 'Precio_Base'],
                      where: {Capacidad_Maxima: capacidad}
                    })
          .then(results => {
            res.status(200).json({
                message: "Obtenidas todas las Habitaciones con capacidad = " + capacidad,
                habitaciones: results,
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
  
    Habitacion.findAndCountAll({ limit: limit, offset:offset })
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
              "habitaciones": data.rows
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
    let tipo = req.query.tipo;
  
    const offset = page ? page * limit : 0;
  
    Habitacion.findAndCountAll({
                                attributes: ['Habitacion_ID', 'Nombre_Habitacion', 'Tipo_Habitacion', 'Ubicacion', 'Precio_Base'],
                                where: {Tipo_Habitacion: tipo}, 
                                order: [
                                  ['Nombre_Habitacion', 'ASC'],
                                  ['Precio_Base', 'DESC']
                                ],
                                limit: limit, 
                                offset:offset 
                              })
      .then(data => {
        const totalPages = Math.ceil(data.count / limit);
        const response = {
          message: "Solicitud de paginación, filtrado y ordenación completada! Parámetros: page = " + page + ", limit = " + limit + ", tipo = " + tipo,
          data: {
              "totalItems": data.count,
              "totalPages": totalPages,
              "limit": limit,
              "tipo-filtering": tipo,
              "currentPageNumber": page + 1,
              "currentPageSize": data.rows.length,
              "habitaciones": data.rows
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
        let habitacionId = req.params.id;
        let habitacion = await Habitacion.findByPk(habitacionId);
    
        if(!habitacion){
            res.status(404).json({
                message: "No encontrada la Habitacion con id = " + habitacionId,
                habitacion: "",
                error: "404"
            });
        } else {    
            let updatedObject = {
                Nombre_Habitacion: req.body.Nombre_Habitacion,
                Estado: req.body.Estado,
                Capacidad_Maxima: req.body.Capacidad_Maxima,
                Tipo_Habitacion: req.body.Tipo_Habitacion,
                Ubicacion: req.body.Ubicacion,
                Descripcion: req.body.Descripcion,
                Precio_Base: req.body.Precio_Base
            }
            let result = await Habitacion.update(updatedObject, {returning: true, where: {Habitacion_ID: habitacionId}});
            
            if(!result) {
                res.status(500).json({
                    message: "Error -> No se pudo actualizar la Habitacion con id = " + req.params.id,
                    error: "No Actualizado",
                });
            }

            res.status(200).json({
                message: "Actualización exitosa de la Habitacion con id = " + habitacionId,
                habitacion: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> No se pudo actualizar la Habitacion con id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try{
        let habitacionId = req.params.id;
        let habitacion = await Habitacion.findByPk(habitacionId);

        if(!habitacion){
            res.status(404).json({
                message: "No existe una Habitacion con id = " + habitacionId,
                error: "404",
            });
        } else {
            await habitacion.destroy();
            res.status(200).json({
                message: "Eliminación exitosa de la Habitacion con id = " + habitacionId,
                habitacion: habitacion,
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> No se pudo eliminar la Habitacion con id = " + req.params.id,
            error: error.message,
        });
    }
}
