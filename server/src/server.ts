import path from 'path';
import cors from 'cors';
import express from 'express';
import routes from './routes';

const app  = express();

app.use(cors());

app.use(express.json()); //Agora o express entende o body em formato json 

app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(3333);

export default app;