const db = require('../config/db.config.js');
const Proveedor = db.Proveedor;

exports.create = (req, res) => {
    let proveedor = {};

    try{
        // Building Proveedor object from uploading request's body
        proveedor.Nombre = req.body.Nombre;
        proveedor.Contacto = req.body.Contacto;
        proveedor.Direccion = req.body.Direccion;
    
        // Save to MySQL database
        Proveedor.create(proveedor).then(result => {    
            // send uploading message to client
            res.status(200).json({
                message: "Upload Successfully a Proveedor with id = " + result.Proveedor_ID,
                proveedor: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
}

exports.retrieveAllProveedores = (req, res) => {
    // find all Proveedor information from 
    Proveedor.findAll()
        .then(proveedorInfos => {
            res.status(200).json({
                message: "Get all Proveedores' Infos Successfully!",
                proveedores: proveedorInfos
            });
        })
        .catch(error => {
          // log on console
          console.log(error);

          res.status(500).json({
              message: "Error!",
              error: error
          });
        });
}

exports.getProveedorById = (req, res) => {
  // find all Proveedor information from 
  let proveedorId = req.params.id;
  Proveedor.findByPk(proveedorId)
      .then(proveedor => {
          res.status(200).json({
              message: "Successfully Get a Proveedor with id = " + proveedorId,
              proveedor: proveedor
          });
      })
      .catch(error => {
        // log on console
        console.log(error);

        res.status(500).json({
            message: "Error!",
            error: error
        });
      });
}


exports.filteringByAge = (req, res) => {
  let age = req.query.age;

    Proveedor.findAll({
                      attributes: ['Proveedor_ID', 'Nombre', 'Contacto', 'Direccion'],
                      where: { age: age }
                    })
          .then(results => {
            res.status(200).json({
                message: "Get all Proveedores with age = " + age,
                proveedores: results,
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
  
    Proveedor.findAndCountAll({ limit: limit, offset: offset })
      .then(data => {
        const totalPages = Math.ceil(data.count / limit);
        const response = {
          message: "Paginating is completed! Query parameters: page = " + page + ", limit = " + limit,
          data: {
              "copyrightby": "UMG ANTIGUA",
              "totalItems": data.count,
              "totalPages": totalPages,
              "limit": limit,
              "currentPageNumber": page + 1,
              "currentPageSize": data.rows.length,
              "proveedores": data.rows
          }
        };
        res.send(response);
      });  
  }catch(error) {
    res.status(500).send({
      message: "Error -> Can NOT complete a paging request!",
      error: error.message,
    });
  }    
}

exports.pagingfilteringsorting = (req, res) => {
  try{
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let age = parseInt(req.query.age);
  
    const offset = page ? page * limit : 0;

    console.log("offset = " + offset);
  
    Proveedor.findAndCountAll({
                                attributes: ['Proveedor_ID', 'Nombre', 'Contacto', 'Direccion'],
                                where: { age: age }, 
                                order: [
                                  ['Nombre', 'ASC'],
                                  ['Contacto', 'DESC']
                                ],
                                limit: limit, 
                                offset: offset 
                              })
      .then(data => {
        const totalPages = Math.ceil(data.count / limit);
        const response = {
          message: "Pagination Filtering Sorting request is completed! Query parameters: page = " + page + ", limit = " + limit + ", age = " + age,
          data: {
              "copyrightby": "UMG ANTIGUA",
              "totalItems": data.count,
              "totalPages": totalPages,
              "limit": limit,
              "age-filtering": age,
              "currentPageNumber": page + 1,
              "currentPageSize": data.rows.length,
              "proveedores": data.rows
          }
        };
        res.send(response);
      });  
  }catch(error) {
    res.status(500).send({
      message: "Error -> Can NOT complete a paging request!",
      error: error.message,
    });
  }      
}

exports.updateById = async (req, res) => {
    try{
        let proveedorId = req.params.id;
        let proveedor = await Proveedor.findByPk(proveedorId);
    
        if(!proveedor){
            // return a response to client
            res.status(404).json({
                message: "Not Found for updating a proveedor with id = " + proveedorId,
                proveedor: "",
                error: "404"
            });
        } else {    
            // update new change to database
            let updatedObject = {
                Nombre: req.body.Nombre,
                Contacto: req.body.Contacto,
                Direccion: req.body.Direccion
            }
            let result = await Proveedor.update(updatedObject, {returning: true, where: {Proveedor_ID: proveedorId}});
            
            // return the response to client
            if(!result) {
                res.status(500).json({
                    message: "Error -> Can not update a proveedor with id = " + req.params.id,
                    error: "Can NOT Updated",
                });
            }

            res.status(200).json({
                message: "Update successfully a Proveedor with id = " + proveedorId,
                proveedor: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> Can not update a proveedor with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try{
        let proveedorId = req.params.id;
        let proveedor = await Proveedor.findByPk(proveedorId);

        if(!proveedor){
            res.status(404).json({
                message: "Does Not exist a Proveedor with id = " + proveedorId,
                error: "404",
            });
        } else {
            await proveedor.destroy();
            res.status(200).json({
                message: "Delete Successfully a Proveedor with id = " + proveedorId,
                proveedor: proveedor,
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> Can NOT delete a proveedor with id = " + req.params.id,
            error: error.message,
        });
    }
} 
