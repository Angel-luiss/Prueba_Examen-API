const db = require('../config/db.config.js');
const Mascota = db.Mascota;

exports.create = (req, res) => {
    let mascota = {};

    try{
        // Construyendo el objeto Mascota a partir del cuerpo de la solicitud
        mascota.Propietario_ID = req.body.Propietario_ID;
        mascota.Nombre_Mascota = req.body.Nombre_Mascota;
        mascota.Tipo = req.body.Tipo;
        mascota.Raza = req.body.Raza;
        mascota.Peso = req.body.Peso;
        mascota.Fecha_Registro = req.body.Fecha_Registro;
        mascota.Edad = req.body.Edad;
        mascota.Sexo = req.body.Sexo;
    
        // Guardar en la base de datos MySQL
        Mascota.create(mascota).then(result => {    
            // Enviar mensaje de éxito al cliente
            res.status(200).json({
                message: "Subida exitosa de una Mascota con id = " + result.Mascota_ID,
                mascota: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Error!",
            error: error.message
        });
    }
}

exports.retrieveAllMascotas = (req, res) => {
    // Buscar toda la información de Mascota
    Mascota.findAll()
        .then(mascotaInfos => {
            res.status(200).json({
                message: "Obtenida toda la información de Mascotas exitosamente!",
                mascotas: mascotaInfos
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

exports.getMascotaById = (req, res) => {
  let mascotaId = req.params.id;
  Mascota.findByPk(mascotaId)
      .then(mascota => {
          res.status(200).json({
              message: "Obtenida exitosamente una Mascota con id = " + mascotaId,
              mascota: mascota
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

exports.filteringByEdad = (req, res) => {
  let edad = req.query.edad;

    Mascota.findAll({
                      attributes: ['Mascota_ID', 'Nombre_Mascota', 'Tipo', 'Raza', 'Peso', 'Edad', 'Sexo'],
                      where: {Edad: edad}
                    })
          .then(results => {
            res.status(200).json({
                message: "Obtenidas todas las Mascotas con edad = " + edad,
                mascotas: results,
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
  
    Mascota.findAndCountAll({ limit: limit, offset:offset })
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
              "mascotas": data.rows
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
  
    Mascota.findAndCountAll({
                                attributes: ['Mascota_ID', 'Nombre_Mascota', 'Tipo', 'Raza', 'Peso', 'Edad'],
                                where: {Tipo: tipo}, 
                                order: [
                                  ['Nombre_Mascota', 'ASC'],
                                  ['Raza', 'DESC']
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
              "mascotas": data.rows
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
        let mascotaId = req.params.id;
        let mascota = await Mascota.findByPk(mascotaId);
    
        if(!mascota){
            res.status(404).json({
                message: "No encontrado para actualizar la Mascota con id = " + mascotaId,
                mascota: "",
                error: "404"
            });
        } else {    
            let updatedObject = {
                Propietario_ID: req.body.Propietario_ID,
                Nombre_Mascota: req.body.Nombre_Mascota,
                Tipo: req.body.Tipo,
                Raza: req.body.Raza,
                Peso: req.body.Peso,
                Fecha_Registro: req.body.Fecha_Registro,
                Edad: req.body.Edad,
                Sexo: req.body.Sexo
            }
            let result = await Mascota.update(updatedObject, {returning: true, where: {Mascota_ID: mascotaId}});
            
            if(!result) {
                res.status(500).json({
                    message: "Error -> No se puede actualizar la Mascota con id = " + req.params.id,
                    error: "No Actualizado",
                });
            }

            res.status(200).json({
                message: "Actualización exitosa de la Mascota con id = " + mascotaId,
                mascota: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> No se puede actualizar la Mascota con id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try{
        let mascotaId = req.params.id;
        let mascota = await Mascota.findByPk(mascotaId);

        if(!mascota){
            res.status(404).json({
                message: "No existe una Mascota con id = " + mascotaId,
                error: "404",
            });
        } else {
            await mascota.destroy();
            res.status(200).json({
                message: "Eliminación exitosa de la Mascota con id = " + mascotaId,
                mascota: mascota,
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> No se pudo eliminar la Mascota con id = " + req.params.id,
            error: error.message,
        });
    }
}
