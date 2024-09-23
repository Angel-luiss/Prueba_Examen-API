module.exports = (sequelize, Sequelize) => {
	const Pago = sequelize.define('pago', {	
	  Pago_ID: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
    },
	  Reservacion_ID: {
			type: Sequelize.INTEGER
	  },
	  Monto_Total: {
			type: Sequelize.DECIMAL(10, 2)
  	},
	  Fecha_Pago: {
			type: Sequelize.DATE
	  },
	  Metodo_Pago: {
			type: Sequelize.STRING(50)
    },
	  Estado_Pago: {
			type: Sequelize.STRING(50)
    }
	});
	
	return Pago;
}
