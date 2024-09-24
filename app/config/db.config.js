

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
db.Catedratico = require('../models/catedraticos.model.js')(sequelize,Sequelize);
db.Horario = require('../models/horarios.model.js')(sequelize,Sequelize);
//db.ControlIngreso = require('../models/control_ingreso.model.js')(sequelize,Sequelize);
db.Controlingreso = require('../models/controlingreso.model.js')(sequelize,Sequelize);

module.exports = db;