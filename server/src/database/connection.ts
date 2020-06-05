import knex from 'knex';
import path from 'path'; //library default do node para caminho

// o KNEX é como se fosse o Eloquent do Laravel, só que voltado para o Node.js
const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite'), 
    },
    useNullAsDefault: true,
});

export default connection;