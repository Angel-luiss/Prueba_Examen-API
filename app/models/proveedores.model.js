module.exports = (sequelize, Sequelize) => {
  const Proveedor = sequelize.define('proveedor', {
    Proveedor_ID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Nombre: {
      type: Sequelize.STRING(100)
    },
    Contacto: {
      type: Sequelize.STRING(100)
    },
    Direccion: {
      type: Sequelize.TEXT
    }
  });

  return Proveedor;
}
