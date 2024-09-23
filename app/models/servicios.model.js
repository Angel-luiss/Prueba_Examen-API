module.exports = (sequelize, Sequelize) => {
	const Servicio = sequelize.define('servicio', {	
	  Servicio_ID: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
    },
	  Nombre_Servicio: {
			type: Sequelize.STRING(100)
	  },
	  Descripcion: {
			type: Sequelize.TEXT
  	},
	  Precio: {
			type: Sequelize.DECIMAL(10, 2)
	  },
	  Duracion: {
			type: Sequelize.INTEGER
    }
	});
	
	return Servicio;
}
