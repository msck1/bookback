import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import { createDb, createTables } from './config.js';

async function initDatabase() {
    try {
        // Criar o banco de dados
        await createDb();
        console.log("Banco de dados criado ou já existe.");
        
        // Criar as tabelas
        await createTables();
        console.log("Tabelas criadas com sucesso.");
    } catch (err) {
        console.error("Erro ao criar banco ou tabelas:", err);
    }
}

// Chama a função de inicialização
initDatabase();