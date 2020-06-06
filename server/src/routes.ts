import express from 'express';
import multer from 'multer';
import multerConfig from './multer/multer';
import { celebrate, Joi } from 'celebrate';

import ItemsController from  './controllers/ItemsController'
import PointsController from './controllers/PointsController';

const routes = express.Router();
const upload = multer(multerConfig);


const pointsController = new PointsController;
const itemsController  = new ItemsController;

// Padroes para nomes de métodos em controlers : 
// index = > listagem , show => um único registro, create/store => criar registro, update, delete/destroy => deletar registro

routes.get('/items', itemsController.index);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

// Rota para criar ponto com validação de dados
routes.post(
    '/points', 
    upload.single('image'), 
    pointsController.create,
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(), 
            uf: Joi.string().required().max(2), 
            items: Joi.string().required(),
        })
    }, {
        abortEarly: false,
    }),
);


export default routes;