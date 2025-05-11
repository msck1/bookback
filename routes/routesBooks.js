import express from 'express';
import { 
    createBook, 
    deleteBookByAuthor, 
    readBook, 
    readBookByAuthor, 
    updateBookByAuthor 
} from '../controller/controllerBooks.js';

// rotas book
const routerBooks = express();

routerBooks.post('/createBook', createBook);

routerBooks.get('/readBook', readBook);

routerBooks.get('/readBookByAuthor', readBookByAuthor);

routerBooks.put('/updateBookByAuthor', updateBookByAuthor);

routerBooks.delete('/deleteBookByAuthor', deleteBookByAuthor);

export { routerBooks };
