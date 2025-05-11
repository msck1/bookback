import express from 'express';
import { createUser, readUser, readUserByEmail, updateUserByEmail, deleteUserByEmail, loginUser } from '../controller/controllerUser.js';

// rotas user
const routerUser = express();

routerUser.post('/createUser', createUser);

routerUser.get('/readUser', readUser,); 

routerUser.get('/readUserByEmail', readUserByEmail);

routerUser.put('/updateUserByEmail', updateUserByEmail);

routerUser.delete('/deleteUserByEmail',  deleteUserByEmail);

routerUser.post('/loginUser', loginUser);

export { routerUser };