module.exports = (sequelize, Sequelize) => {
	const Promocion = sequelize.define('promocion', {	
	  Promocion_ID: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
    },
	  Nombre: {
			type: Sequelize.STRING(100)
	  },
	  Descripcion: {
			type: Sequelize.TEXT
  	},
	  Descuento: {
			type: Sequelize.DECIMAL(5, 2)
	  },
	  Fecha_Inicio: {
			type: Sequelize.DATE
    },
	  Fecha_Fin: {
			type: Sequelize.DATE
    }
	});
	
	return Promocion;
}
