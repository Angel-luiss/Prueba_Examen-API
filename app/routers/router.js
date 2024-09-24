
let express = require('express');
let router = express.Router();
 
const usuarios = require('../controllers/usuarios.controller.js');


//Usuarios
router.post('/api/usuarios/create', usuarios.create);
router.get('/api/usuarios/all', usuarios.retrieveAllUsuarios);
router.get('/api/usuarios/onebyid/:id', usuarios.getUsuarioById);
router.get('/api/usuarios/filteringbyrole', usuarios.filteringByRole);
router.get('/api/usuarios/pagination', usuarios.pagination);
router.get('/api/usuarios/pagefiltersort', usuarios.pagingfilteringsorting);
router.put('/api/usuarios/update/:id', usuarios.updateById);
router.delete('/api/usuarios/delete/:id', usuarios.deleteById);



const catedraticos = require('../controllers/catedraticos.controllers.js');

//Catedraticos
router.post('/api/catedraticos/create', catedraticos.create);
router.get('/api/catedraticos/all', catedraticos.retrieveAllCatedraticos);
router.get('/api/catedraticos/onebyid/:id', catedraticos.getCatedraticoById);
router.put('/api/catedraticos/update/:id', catedraticos.updateById);
router.delete('/api/catedraticos/delete/:id', catedraticos.deleteById);

const horarios = require('../controllers/horarios.controllers.js');

//Horarios
router.post('/api/horarios/create', horarios.create);
router.get('/api/horarios/all', horarios.retrieveAllHorarios);
router.get('/api/horarios/onebyid/:id', horarios.getHorarioById);
router.put('/api/horarios/update/:id', horarios.updateById);
router.delete('/api/horarios/delete/:id', horarios.deleteById);



//const controlIngreso = require('../controllers/controlingreso.controller.js');

// Control de Ingreso
//router.post('/api/controlingreso/create', controlIngreso.create);
//router.get('/api/controlingreso/all', controlIngreso.retrieveAll);
//router.get('/api/controlingreso/onebyid/:id', controlIngreso.getById);
//router.put('/api/controlingreso/update/:id', controlIngreso.updateById);
//router.delete('/api/controlingreso/delete/:id', controlIngreso.deleteById);

module.exports = router;