import express from 'express';
import { 
    createReview, 
    deleteReviewByName, 
    readReview, 
    readReviewByBook, 
    readReviewByName, 
    updateReviewByName 
} from '../controller/controllerBookReview.js';

// rotas para review de livros

const routerReview = express();

routerReview.post('/createReview', createReview);

routerReview.get('/readReview', readReview);

routerReview.get('/readReviewByName', readReviewByName);

routerReview.get('/readReviewByBook', readReviewByBook);

routerReview.put('/updateReviewByName', updateReviewByName);

routerReview.delete('/deleteReviewByName', deleteReviewByName);

export { routerReview };
