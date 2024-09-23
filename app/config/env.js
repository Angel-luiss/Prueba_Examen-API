

const env = {
  database: 'umg_antigua_web_1x9j',
  username: 'umg_antigua_web_user',
  password: 'OXx23gu6Qbus7x2uQtV0t1d2lkUJzfQo',
  host: 'dpg-crog3vo8fa8c738rajjg-a.oregon-postgres.render.com',   
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000, 
    idle: 10000
  }
};

module.exports = env;