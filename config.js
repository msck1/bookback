// Modifique o config.js assim:
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import mysql from 'mysql2/promise';

// Primeiro crie um pool para conectar sem especificar um banco de dados
const initialPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Função para criar o banco de dados
async function createDb() {
    const connection = await initialPool.getConnection();
    try {
        const query = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;
        await connection.query(query);
        console.log("Banco criado com sucesso");
    } catch (err) {
        console.error("Erro ao criar banco de dados", err);
        throw err;
    } finally {
        connection.release();
    }
}

// Pool com o banco de dados especificado (para ser usado depois de criar o banco)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Função para obter uma conexão do pool
async function getConnection() {
    return pool.getConnection();
}

// Função para criar as tabelas no banco
async function createTables() {
    const connection = await pool.getConnection();
    try {
        // Tabela users
        const tableUser = `CREATE TABLE IF NOT EXISTS users
        (idusers INT AUTO_INCREMENT PRIMARY KEY,
        nomeuser VARCHAR(40),
        email VARCHAR(30) UNIQUE,
        senha VARCHAR(8))`;
        
        // Tabela books
        const tableBooks = `CREATE TABLE IF NOT EXISTS books
        (idbooks INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(40),
        sinopse VARCHAR(120),
        autores VARCHAR(40))`;
        
        // Tabela book_reviews
        const tableBookReviews = `CREATE TABLE IF NOT EXISTS book_review
        (idbookreviews INT AUTO_INCREMENT PRIMARY KEY,
        book_review_id INT NOT NULL,
        user_review_id INT NOT NULL,
        nota FLOAT,
        comentario VARCHAR(255),
        FOREIGN KEY (book_review_id) REFERENCES books(idbooks) ON DELETE CASCADE,
        FOREIGN KEY (user_review_id) REFERENCES users(idusers) ON DELETE CASCADE)`;
        
        // Executando as queries para criar as tabelas
        await connection.query(tableUser);
        await connection.query(tableBooks);
        await connection.query(tableBookReviews);
        console.log("Tabelas criadas com sucesso");
    } catch (err) {
        console.error("Erro ao criar tabelas", err);
        throw err;
    } finally {
        connection.release();
    }
}

// Exportar as funções para uso externo
export { getConnection, createDb, createTables };