module.exports = (sequelize, Sequelize) => {
    const Inventario = sequelize.define('inventario', {
        Inventario_ID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Nombre_Item: {
            type: Sequelize.STRING(100)
        },
        Cantidad: {
            type: Sequelize.INTEGER
        },
        Fecha_Ingreso: {
            type: Sequelize.DATE
        },
        Proveedor: {
            type: Sequelize.STRING(100)
        }
    });
    
    return Inventario;
}