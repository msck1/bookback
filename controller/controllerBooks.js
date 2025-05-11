import { getConnection } from '../config.js';

async function createBook(req, res) {
    const connection = await getConnection(); // Obter uma conexão do pool
    
    try {
        const { titulo, sinopse, autores } = req.body;
        if (!titulo || !sinopse || !autores) {
            return res.status(400).json({ message: "Título, sinopse e autores são obrigatórios" });
        }

        const checkDuplicate = `SELECT idbooks FROM books WHERE titulo = ? AND autores = ? AND sinopse = ? LIMIT 1`;
        const [existingBooks] = await connection.query(checkDuplicate, [titulo, autores, sinopse]);

        if (existingBooks.length > 0) {
            return res.status(409).json({ message: "Livro já existente" });
        }

        const insert = `INSERT INTO books (titulo, sinopse, autores) VALUES (?, ?, ?)`;
        const [result] = await connection.query(insert, [titulo, sinopse, autores]);

        const newBook = { id: result.insertId, titulo, sinopse, autores };
        res.status(201).json(newBook);

    } catch (err) {
        console.error("Erro ao criar livro:", err);
        res.status(500).json({ message: "Erro ao criar livro", error: err.message });
    } finally {
        if (connection) connection.release(); // Liberar a conexão
    }
}

async function readBook(req, res) {
    const connection = await getConnection(); // Obter uma conexão do pool
    
    try {
        const select = `SELECT * FROM books`;
        const [books] = await connection.query(select);

        res.status(200).json({ message: "Dados do banco", data: books });

    } catch (err) {
        console.error("Erro ao buscar livros:", err);
        res.status(500).json({ message: "Erro ao buscar livros", error: err.message });
    } finally {
        if (connection) connection.release(); // Liberar a conexão
    }
}

async function readBookByAuthor(req, res) {
    const connection = await getConnection(); // Obter uma conexão do pool
    
    try {
        const { autores } = req.body;
        if (!autores) {
            return res.status(400).json({ message: "Autor obrigatório" });
        }

        const selectByAuthor = `SELECT * FROM books WHERE autores = ?`;
        const [books] = await connection.query(selectByAuthor, [autores]);

        res.status(200).json({ message: "Dados do banco", data: books });

    } catch (err) {
        console.error("Erro ao buscar livros do autor:", err);
        res.status(500).json({ message: "Erro ao buscar livros do autor", error: err.message });
    } finally {
        if (connection) connection.release(); // Liberar a conexão
    }
}

async function updateBookByAuthor(req, res) {
    const connection = await getConnection(); // Obter uma conexão do pool
    
    try {
        const { titulo, sinopse, autores, autoresantigos } = req.body;
        if (!titulo || !sinopse || !autores || !autoresantigos) {
            return res.status(400).json({ message: "Título, sinopse, autor atual e antigo são obrigatórios" });
        }

        const update = `UPDATE books SET titulo = ?, sinopse = ?, autores = ? WHERE autores = ?`;
        const [result] = await connection.query(update, [titulo, sinopse, autores, autoresantigos]);

        res.status(200).json({ message: "Livro atualizado com sucesso", data: result });

    } catch (err) {
        console.error("Erro ao atualizar livro:", err);
        res.status(500).json({ message: "Erro ao atualizar livro", error: err.message });
    } finally {
        if (connection) connection.release(); // Liberar a conexão
    }
}

async function deleteBookByAuthor(req, res) {
    const connection = await getConnection(); // Obter uma conexão do pool
    
    try {
        const { autores } = req.body;
        if (!autores) {
            return res.status(400).json({ message: "Autor obrigatório" });
        }

        const del = `DELETE FROM books WHERE autores = ?`;
        const [result] = await connection.query(del, [autores]);

        res.status(200).json({ message: "Livro(s) deletado(s)", data: result });

    } catch (err) {
        console.error("Erro ao deletar livro:", err);
        res.status(500).json({ message: "Erro ao deletar livro", error: err.message });
    } finally {
        if (connection) connection.release(); // Liberar a conexão
    }
}

export {
    createBook,
    readBook,
    readBookByAuthor,
    updateBookByAuthor,
    deleteBookByAuthor
};