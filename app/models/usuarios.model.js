module.exports = (sequelize, Sequelize) => {
	const Usuario = sequelize.define('usuario', {	
	  Usuario_ID: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
    },
	  Nombre_Usuario: {
			type: Sequelize.STRING(100)
	  },
	  Correo: {
			type: Sequelize.STRING(100)
  	},
	  Contraseña: {
			type: Sequelize.STRING(100)
	  },
	  Rol: {
			type: Sequelize.STRING(50)
    },
	  Telefono: {
			type: Sequelize.STRING(15)
	  },
	  Fecha_Creacion: {
			type: Sequelize.DATE
    }
	});
	
	return Usuario;
}
