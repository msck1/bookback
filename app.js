import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import express from 'express';
import { routerUser } from './routes/routesUser.js';
import { routerBooks } from './routes/routesBooks.js';
import { routerReview } from './routes/routesBookReview.js';

const app = express();

app.use(express.json());
app.use('/users', routerUser);
app.use('/books', routerBooks);
app.use('/reviews', routerReview);

app.listen(3000, () => {
    console.log('API Rodando na porta 3000');
});
