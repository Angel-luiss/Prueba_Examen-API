module.exports = (sequelize, Sequelize) => {
	const Reservacion = sequelize.define('reservacion', {	
	  Reservacion_ID: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
    },
	  Mascota_ID: {
			type: Sequelize.INTEGER
	  },
	  Habitacion_ID: {
			type: Sequelize.INTEGER
  	},
	  Fecha_Entrada: {
			type: Sequelize.DATE
	  },
	  Fecha_Salida: {
			type: Sequelize.DATE
    },
	  Estado_Reservacion: {
			type: Sequelize.STRING(50)
	  },
	  Total: {
			type: Sequelize.DECIMAL(10, 2)
    },
	  Notas: {
			type: Sequelize.TEXT
    }
	});
	
	return Reservacion;
}
