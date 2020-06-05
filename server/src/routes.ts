import express from 'express';

import ItemsController from  './controllers/ItemsController'
import PointsController from './controllers/PointsController';

const routes = express.Router();

const pointsController = new PointsController;
const itemsController  = new ItemsController;

// Padroes para nomes de métodos em controlers : 
// index = > listagem , show => um único registro, create/store => criar registro, update, delete/destroy => deletar registro

routes.get('/items', itemsController.index);

routes.get('/points', pointsController.index);
routes.post('/points', pointsController.create);
routes.get('/points/:id', pointsController.show);



export default routes;