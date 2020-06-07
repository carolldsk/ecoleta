import { Request , Response } from 'express';
import knex from '../database/connection';


class PointsController {

    async index(request: Request, response: Response){

        const { city, uf, items } = request.query;
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        const serializedItems = points.map(point => {
            return {
                ...point,
                image_url : `http://192.168.0.6:3333/uploads/${point.image}`
            }
        });

        return response.json(serializedItems);
        //return response.json({city, uf, items});

    }

    async show(request: Request, response: Response){
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');


        if(!point || !items){
            return response.status(400).json({message: 'Something not found.'});
        }

        const serializedItems =  {
            ...point,
            image_url : `http://192.168.0.6:3333/uploads/${point.image}`
        }

        return response.json({point, items});
    }


    async create(request: Request, response: Response){
        // Desestruturação para jogar conteúdo do body, criando variáveis
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };
    
        // Desabilitando o auto commit, para rollback se necessário
        // Auxilia para visualizar todas as transações e se uma query nao der certo, roda o rollback em todas
        const trx = await knex.transaction(); 
    
        // Persistindo na tabela points os valores abaixo que vieram do front
        // Apos inserir os dados retorna um array do ID do ultimo registro inserido (poderia ser mais de um registro inserido ao mesmo tempo)
        const insertedIds = await trx('points').insert(point);
    
        // Id do registro inserido acima (em points)
        let point_id = insertedIds[0];
    
        // Desconstruindo o array items para inserirmos o id do registro que acaba de ser inserido em points
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
            return {
                item_id,
                point_id,
            }
        })
    
        // Persistindo na tabela pivot os valores abaixo que vieram do front
        await trx('point_items').insert(pointItems);

        await trx.commit();
        
        // Fazendo um spreed operator para juntar todos os dados de point com o novo ID
        return response.json({
            id: point_id,
            ...point,
        });
    }

}

export default PointsController;