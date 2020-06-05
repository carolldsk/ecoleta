import Knex from 'knex';

export async function up (knex: Knex){
    //criar a tabela
    return knex.schema.createTable('points', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('whatsapp').notNullable();
        table.string('latitude').notNullable();
        table.string('longetude').notNullable();
        table.string('uf', 2).notNullable();
        table.string('city').notNullable();
    });

}

export async function down (knex: Knex){
    //Rolback
    return knex.schema.dropTable('points');
}