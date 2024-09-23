

const env = require('./env.js');
 
const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  dialectOptions:{
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  operatorsAliases: false,
 
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle,
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
db.Usuario = require('../models/usuarios.model.js')(sequelize,Sequelize);
db.Mascota = require('../models/mascotas.model.js')(sequelize,Sequelize);
db.Habitacion = require('../models/habitaciones.model.js')(sequelize, Sequelize);
db.Servicio = require('../models/servicios.model.js')(sequelize,Sequelize);
db.Precio = require('..//models/precios.model.js')(sequelize,Sequelize);
db.Promocion = require('../models/promociones.model.js')(sequelize,Sequelize);
db.Reservacion  = require('../models/reservaciones.model.js')(sequelize,Sequelize);
db.ServicioReservacion = require('../models/servicios_reservacion.model.js')(sequelize,Sequelize);
db.Pago = require('../models/pagos.model.js')(sequelize, Sequelize);
db.LogDisponibilidad = require('../models/logs_disponibilidad.model.js')(sequelize,Sequelize);
db.Inventario = require('../models/inventario.model.js')(sequelize,Sequelize);
db.Proveedor = require('../models/proveedores.model.js')(sequelize,Sequelize);

module.exports = db;