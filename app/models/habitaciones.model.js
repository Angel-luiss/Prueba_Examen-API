module.exports = (sequelize, Sequelize) => {
	const Habitacion = sequelize.define('habitacion', {	
	  Habitacion_ID: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
    },
	  Nombre_Habitacion: {
			type: Sequelize.STRING(100)
	  },
	  Estado: {
			type: Sequelize.STRING(50)
  	},
	  Capacidad_Maxima: {
			type: Sequelize.INTEGER
	  },
	  Tipo_Habitacion: {
			type: Sequelize.STRING(50)
    },
	  Ubicacion: {
			type: Sequelize.STRING(100)
	  },
	  Descripcion: {
			type: Sequelize.TEXT
    },
	  Precio_Base: {
			type: Sequelize.DECIMAL(10, 2)
    }
	});
	
	return Habitacion;
}
