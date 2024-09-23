const db = require('../config/db.config.js');
const Usuario = db.Usuario;

exports.create = (req, res) => {
    let usuario = {};

    try{
        // Construyendo el objeto Usuario a partir del cuerpo de la solicitud
        usuario.Nombre_Usuario = req.body.Nombre_Usuario;
        usuario.Correo = req.body.Correo;
        usuario.Contraseña = req.body.Contraseña;
        usuario.Rol = req.body.Rol;
        usuario.Telefono = req.body.Telefono;
        usuario.Fecha_Creacion = req.body.Fecha_Creacion;
    
        // Guardar en la base de datos MySQL
        Usuario.create(usuario).then(result => {    
            // Enviar mensaje de éxito al cliente
            res.status(200).json({
                message: "Subido correctamente un Usuario con id = " + result.Usuario_ID,
                usuario: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Error!",
            error: error.message
        });
    }
}

exports.retrieveAllUsuarios = (req, res) => {
    // Buscar toda la información de Usuario
    Usuario.findAll()
        .then(usuarioInfos => {
            res.status(200).json({
                message: "Obtenida toda la información de Usuarios exitosamente!",
                usuarios: usuarioInfos
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

exports.getUsuarioById = (req, res) => {
  let usuarioId = req.params.id;
  Usuario.findByPk(usuarioId)
      .then(usuario => {
          res.status(200).json({
              message: "Obtenido exitosamente un Usuario con id = " + usuarioId,
              usuario: usuario
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

exports.filteringByRole = (req, res) => {
  let rol = req.query.rol;

    Usuario.findAll({
                      attributes: ['Usuario_ID', 'Nombre_Usuario', 'Correo', 'Rol', 'Telefono', 'Fecha_Creacion'],
                      where: {Rol: rol}
                    })
          .then(results => {
            res.status(200).json({
                message: "Obtenidos todos los Usuarios con Rol = " + rol,
                usuarios: results,
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
  
    Usuario.findAndCountAll({ limit: limit, offset:offset })
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
              "usuarios": data.rows
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
    let rol = req.query.rol;
  
    const offset = page ? page * limit : 0;
  
    Usuario.findAndCountAll({
                                attributes: ['Usuario_ID', 'Nombre_Usuario', 'Correo', 'Rol'],
                                where: {Rol: rol}, 
                                order: [
                                  ['Nombre_Usuario', 'ASC'],
                                  ['Correo', 'DESC']
                                ],
                                limit: limit, 
                                offset:offset 
                              })
      .then(data => {
        const totalPages = Math.ceil(data.count / limit);
        const response = {
          message: "Solicitud de paginación, filtrado y ordenación completada! Parámetros: page = " + page + ", limit = " + limit + ", rol = " + rol,
          data: {
              "totalItems": data.count,
              "totalPages": totalPages,
              "limit": limit,
              "rol-filtering": rol,
              "currentPageNumber": page + 1,
              "currentPageSize": data.rows.length,
              "usuarios": data.rows
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
        let usuarioId = req.params.id;
        let usuario = await Usuario.findByPk(usuarioId);
    
        if(!usuario){
            res.status(404).json({
                message: "No encontrado para actualizar el Usuario con id = " + usuarioId,
                usuario: "",
                error: "404"
            });
        } else {    
            let updatedObject = {
                Nombre_Usuario: req.body.Nombre_Usuario,
                Correo: req.body.Correo,
                Contraseña: req.body.Contraseña,
                Rol: req.body.Rol,
                Telefono: req.body.Telefono,
                Fecha_Creacion: req.body.Fecha_Creacion
            }
            let result = await Usuario.update(updatedObject, {returning: true, where: {Usuario_ID: usuarioId}});
            
            if(!result) {
                res.status(500).json({
                    message: "Error -> No se puede actualizar el Usuario con id = " + req.params.id,
                    error: "No actualizado",
                });
            }

            res.status(200).json({
                message: "Actualización exitosa del Usuario con id = " + usuarioId,
                usuario: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> No se puede actualizar el Usuario con id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try{
        let usuarioId = req.params.id;
        let usuario = await Usuario.findByPk(usuarioId);

        if(!usuario){
            res.status(404).json({
                message: "No existe un Usuario con id = " + usuarioId,
                error: "404",
            });
        } else {
            await usuario.destroy();
            res.status(200).json({
                message: "Eliminación exitosa del Usuario con id = " + usuarioId,
                usuario: usuario,
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> No se pudo eliminar el Usuario con id = " + req.params.id,
            error: error.message,
        });
    }
}
