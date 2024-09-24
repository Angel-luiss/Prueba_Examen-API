module.exports = (sequelize, Sequelize) => {
  const ControlIngreso = sequelize.define('controlingreso', {
    id_ingreso: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_Catedratico: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'catedraticos',  // Nombre de la tabla debe coincidir con el de PostgreSQL
        key: 'IdCatedratico'
      }
    },
    FechaHoraIngreso: {
      type: Sequelize.DATE
    },
    FechaHoraSalida: {
      type: Sequelize.DATE
    },
    Estatus: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[0, 1]]  // Validación para aceptar solo 0 o 1
      }
    }
  }, {
    tableName: 'controlingreso',  // Nombre de la tabla
    timestamps: false  // Desactivar timestamps automáticos si no son necesarios
  });

  return ControlIngreso;
};
