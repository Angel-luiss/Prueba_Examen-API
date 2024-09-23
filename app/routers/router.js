
let express = require('express');
let router = express.Router();
 
const usuarios = require('../controllers/usuarios.controller.js');
const mascotas = require('../controllers/mascotas.controller.js');
const habitaciones = require('../controllers/habitaciones.controller.js');
const servicios = require('../controllers/servicios.controller.js');
const precios = require('../controllers/precios.controller.js');
const promociones = require('../controllers/promociones.controller.js');
const reservaciones = require('../controllers/reservaciones.controller.js');
const serviciosReservacion = require('../controllers/servicios_reservacion.controller.js');
const pagos = require('../controllers/pagos.controller.js');
const logs = require('../controllers/logs_disponibilidad.controller.js');
const inventarios = require('../controllers/inventario.controller.js');
const proveedores = require('../controllers/proveedores.controller.js');


//Usuarios
router.post('/api/usuarios/create', usuarios.create);
router.get('/api/usuarios/all', usuarios.retrieveAllUsuarios);
router.get('/api/usuarios/onebyid/:id', usuarios.getUsuarioById);
router.get('/api/usuarios/filteringbyrole', usuarios.filteringByRole);
router.get('/api/usuarios/pagination', usuarios.pagination);
router.get('/api/usuarios/pagefiltersort', usuarios.pagingfilteringsorting);
router.put('/api/usuarios/update/:id', usuarios.updateById);
router.delete('/api/usuarios/delete/:id', usuarios.deleteById);
//Mascotas
router.post('/api/mascotas/create', mascotas.create);
router.get('/api/mascotas/all', mascotas.retrieveAllMascotas);
router.get('/api/mascotas/onebyid/:id', mascotas.getMascotaById);
router.get('/api/mascotas/filteringbyedad', mascotas.filteringByEdad);
router.get('/api/mascotas/pagination', mascotas.pagination);
router.get('/api/mascotas/pagefiltersort', mascotas.pagingfilteringsorting);
router.put('/api/mascotas/update/:id', mascotas.updateById);
router.delete('/api/mascotas/delete/:id', mascotas.deleteById);
//Habitaciones
router.post('/api/habitaciones/create', habitaciones.create);
router.get('/api/habitaciones/all', habitaciones.retrieveAllHabitaciones);
router.get('/api/habitaciones/onebyid/:id', habitaciones.getHabitacionById);
router.get('/api/habitaciones/filteringbycapacidad', habitaciones.filteringByCapacidad);
router.get('/api/habitaciones/pagination', habitaciones.pagination);
router.get('/api/habitaciones/pagefiltersort', habitaciones.pagingfilteringsorting);
router.put('/api/habitaciones/update/:id', habitaciones.updateById);
router.delete('/api/habitaciones/delete/:id', habitaciones.deleteById);
//Servicios
router.post('/api/servicios/create', servicios.create);
router.get('/api/servicios/all', servicios.retrieveAllServicios);
router.get('/api/servicios/onebyid/:id', servicios.getServicioById);
router.get('/api/servicios/filteringbyprecio', servicios.filteringByPrecio);
router.get('/api/servicios/pagination', servicios.pagination);
router.get('/api/servicios/pagefiltersort', servicios.pagingfilteringsorting);
router.put('/api/servicios/update/:id', servicios.updateById);
router.delete('/api/servicios/delete/:id', servicios.deleteById);
//Precios
router.post('/api/precios/create', precios.create);
router.get('/api/precios/all', precios.retrieveAllPrecios);
router.get('/api/precios/onebyid/:id', precios.getPrecioById);
router.put('/api/precios/update/:id', precios.updateById);
router.delete('/api/precios/delete/:id', precios.deleteById);
//Promociones
router.post('/api/promociones/create', promociones.create);
router.get('/api/promociones/all', promociones.retrieveAllPromociones);
router.get('/api/promociones/onebyid/:id', promociones.getPromocionById);
router.get('/api/promociones/filteringbydescuento', promociones.filteringByDescuento);
router.get('/api/promociones/pagination', promociones.pagination);
router.get('/api/promociones/pagefiltersort', promociones.pagingfilteringsorting);
router.put('/api/promociones/update/:id', promociones.updateById);
router.delete('/api/promociones/delete/:id', promociones.deleteById);
//Resevaciones
router.post('/api/reservaciones/create', reservaciones.create);
router.get('/api/reservaciones/all', reservaciones.retrieveAllReservaciones);
router.get('/api/reservaciones/onebyid/:id', reservaciones.getReservacionById);
router.get('/api/reservaciones/filteringbyestado', reservaciones.filteringByEstado);
router.get('/api/reservaciones/pagination', reservaciones.pagination);
router.get('/api/reservaciones/pagefiltersort', reservaciones.pagingfilteringsorting);
router.put('/api/reservaciones/update/:id', reservaciones.updateById);
router.delete('/api/reservaciones/delete/:id', reservaciones.deleteById);
//Servicios_Resevacione
router.post('/api/serviciosreservacion/create', serviciosReservacion.create);
router.get('/api/serviciosreservacion/all', serviciosReservacion.retrieveAllServiciosReservacion);
router.get('/api/serviciosreservacion/onebyid/:id', serviciosReservacion.getServicioReservacionById);
router.get('/api/serviciosreservacion/filteringbyprecio', serviciosReservacion.filteringByPrecio);
router.get('/api/serviciosreservacion/pagination', serviciosReservacion.pagination);
router.get('/api/serviciosreservacion/pagefiltersort', serviciosReservacion.pagingfilteringsorting);
router.put('/api/serviciosreservacion/update/:id', serviciosReservacion.updateById);
router.delete('/api/serviciosreservacion/delete/:id', serviciosReservacion.deleteById);
//Pagos
router.post('/api/pagos/create', pagos.create);
router.get('/api/pagos/all', pagos.retrieveAllPagos);
router.get('/api/pagos/onebyid/:id', pagos.getPagoById);
router.get('/api/pagos/filteringbyestado', pagos.filteringByEstado);
router.get('/api/pagos/pagination', pagos.pagination);
router.get('/api/pagos/pagefiltersort', pagos.pagingfilteringsorting);
router.put('/api/pagos/update/:id', pagos.updateById);
router.delete('/api/pagos/delete/:id', pagos.deleteById);
//Logs_Disponibilidad
router.post('/api/logs/create', logs.create);
router.get('/api/logs/all', logs.retrieveAllLogs);
router.get('/api/logs/onebyid/:id', logs.getLogById);
router.get('/api/logs/filteringbyestado', logs.filteringByEstado);
router.get('/api/logs/pagination', logs.pagination);
router.get('/api/logs/pagefiltersort', logs.pagingfilteringsorting);
router.put('/api/logs/update/:id', logs.updateById);
router.delete('/api/logs/delete/:id', logs.deleteById);
//Inventario
router.post('/api/inventarios/create', inventarios.create);
router.get('/api/inventarios/all', inventarios.retrieveAllInventarios);
router.get('/api/inventarios/onebyid/:id', inventarios.getInventarioById);
router.get('/api/inventarios/filteringbyproveedor', inventarios.filteringByProveedor);
router.get('/api/inventarios/pagination', inventarios.pagination);
router.get('/api/inventarios/pagefiltersort', inventarios.pagingfilteringsorting);
router.put('/api/inventarios/update/:id', inventarios.updateById);
router.delete('/api/inventarios/delete/:id', inventarios.deleteById);
//Proveedores
router.post('/api/proveedores/create', proveedores.create);
router.get('/api/proveedores/all', proveedores.retrieveAllProveedores);
router.get('/api/proveedores/onebyid/:id', proveedores.getProveedorById);
router.get('/api/proveedores/filteringbyage', proveedores.filteringByAge);
router.get('/api/proveedores/pagination', proveedores.pagination);
router.get('/api/proveedores/pagefiltersort', proveedores.pagingfilteringsorting);
router.put('/api/proveedores/update/:id', proveedores.updateById);
router.delete('/api/proveedores/delete/:id', proveedores.deleteById);

module.exports = router;