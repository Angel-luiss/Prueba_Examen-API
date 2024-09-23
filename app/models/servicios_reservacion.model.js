module.exports = (sequelize, Sequelize) => {
	const ServicioReservacion = sequelize.define('servicio_reservacion', {	
	  Servicio_Reservacion_ID: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
    },
	  Reservacion_ID: {
			type: Sequelize.INTEGER
	  },
	  Servicio_ID: {
			type: Sequelize.INTEGER
  	},
	  Cantidad: {
			type: Sequelize.INTEGER
	  },
	  Precio: {
			type: Sequelize.DECIMAL(10, 2)
    }
	});
	
	return ServicioReservacion;
}
