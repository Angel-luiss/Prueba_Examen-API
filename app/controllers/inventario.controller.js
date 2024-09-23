const db = require('../config/db.config.js');
const Inventario = db.Inventario;

exports.create = (req, res) => {
    let inventario = {};

    try {
        // Construir objeto Inventario desde el cuerpo de la solicitud
        inventario.Nombre_Item = req.body.Nombre_Item;
        inventario.Cantidad = req.body.Cantidad;
        inventario.Fecha_Ingreso = req.body.Fecha_Ingreso;
        inventario.Proveedor = req.body.Proveedor;

        // Guardar en la base de datos
        Inventario.create(inventario).then(result => {
            // Enviar mensaje al cliente
            res.status(200).json({
                message: "Item added successfully to Inventario with id = " + result.Inventario_ID,
                inventario: result,
            });
        });
    } catch (error) {
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
}

exports.retrieveAllInventarios = (req, res) => {
    // Obtener toda la información de Inventario
    Inventario.findAll()
        .then(inventarioInfos => {
            res.status(200).json({
                message: "Retrieve all Inventario items successfully!",
                inventarios: inventarioInfos
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

exports.getInventarioById = (req, res) => {
    // Obtener información de Inventario por ID
    let inventarioId = req.params.id;
    Inventario.findByPk(inventarioId)
        .then(inventario => {
            res.status(200).json({
                message: "Successfully retrieved Inventario item with id = " + inventarioId,
                inventarios: inventario
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

exports.filteringByProveedor = (req, res) => {
    let proveedor = req.query.proveedor;

    Inventario.findAll({
        attributes: ['Inventario_ID', 'Nombre_Item', 'Cantidad', 'Fecha_Ingreso', 'Proveedor'],
        where: { Proveedor: proveedor }
    })
        .then(results => {
            res.status(200).json({
                message: "Get all Inventario items with Proveedor = " + proveedor,
                inventarios: results,
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
    try {
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);

        const offset = page ? page * limit : 0;

        Inventario.findAndCountAll({ limit: limit, offset: offset })
            .then(data => {
                const totalPages = Math.ceil(data.count / limit);
                const response = {
                    message: "Pagination completed! Query parameters: page = " + page + ", limit = " + limit,
                    data: {
                        "totalItems": data.count,
                        "totalPages": totalPages,
                        "limit": limit,
                        "currentPageNumber": page + 1,
                        "currentPageSize": data.rows.length,
                        "inventarios": data.rows
                    }
                };
                res.send(response);
            });
    } catch (error) {
        res.status(500).send({
            message: "Error -> Cannot complete a paging request!",
            error: error.message,
        });
    }
}

exports.pagingfilteringsorting = (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        let proveedor = req.query.proveedor;

        const offset = page ? page * limit : 0;

        Inventario.findAndCountAll({
            attributes: ['Inventario_ID', 'Nombre_Item', 'Cantidad', 'Fecha_Ingreso', 'Proveedor'],
            where: { Proveedor: proveedor },
            order: [
                ['Nombre_Item', 'ASC'],
                ['Fecha_Ingreso', 'DESC']
            ],
            limit: limit,
            offset: offset
        })
            .then(data => {
                const totalPages = Math.ceil(data.count / limit);
                const response = {
                    message: "Pagination, Filtering, and Sorting request completed! Query parameters: page = " + page + ", limit = " + limit + ", proveedor = " + proveedor,
                    data: {
                        "totalItems": data.count,
                        "totalPages": totalPages,
                        "limit": limit,
                        "currentPageNumber": page + 1,
                        "currentPageSize": data.rows.length,
                        "inventarios": data.rows
                    }
                };
                res.send(response);
            });
    } catch (error) {
        res.status(500).send({
            message: "Error -> Cannot complete a paging request!",
            error: error.message,
        });
    }
}

exports.updateById = async (req, res) => {
    try {
        let inventarioId = req.params.id;
        let inventario = await Inventario.findByPk(inventarioId);

        if (!inventario) {
            res.status(404).json({
                message: "Not Found for updating an Inventario item with id = " + inventarioId,
                inventario: "",
                error: "404"
            });
        } else {
            let updatedObject = {
                Nombre_Item: req.body.Nombre_Item,
                Cantidad: req.body.Cantidad,
                Fecha_Ingreso: req.body.Fecha_Ingreso,
                Proveedor: req.body.Proveedor
            }
            let result = await Inventario.update(updatedObject, { returning: true, where: { Inventario_ID: inventarioId } });

            if (!result) {
                res.status(500).json({
                    message: "Error -> Cannot update an Inventario item with id = " + req.params.id,
                    error: "Cannot Update",
                });
            }

            res.status(200).json({
                message: "Update successfully an Inventario item with id = " + inventarioId,
                inventario: updatedObject,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> Cannot update an Inventario item with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try {
        let inventarioId = req.params.id;
        let inventario = await Inventario.findByPk(inventarioId);

        if (!inventario) {
            res.status(404).json({
                message: "Does not exist an Inventario item with id = " + inventarioId,
                error: "404",
            });
        } else {
            await inventario.destroy();
            res.status(200).json({
                message: "Deleted successfully an Inventario item with id = " + inventarioId,
                inventario: inventario,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> Cannot delete an Inventario item with id = " + req.params.id,
            error: error.message,
        });
    }
}
