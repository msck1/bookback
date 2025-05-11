import { getConnection } from "../config.js";

async function createReview(req, res) {
  const connection = await getConnection(); // Obter uma conexão do pool
  
  try {
    const { titulo, user, nota, comentario } = req.body;

    if (!titulo || !user || !nota || !comentario) {
      return res.status(400).json({
        message: "Titulo, user, nota e comentario são obrigatórios"
      });
    }

    if (nota > 5) {
      return res.status(400).json({
        message: "A nota máxima é 5"
      });
    }

    const checkDuplicate = `
      SELECT idbookreviews 
      FROM book_review 
      INNER JOIN books ON book_review.book_review_id = books.idbooks 
      INNER JOIN users ON book_review.user_review_id = users.idusers 
      WHERE titulo = ? AND nomeuser = ?`;
    const [duplicateResult] = await connection.query(checkDuplicate, [titulo, user]);

    if (duplicateResult.length > 0) {
      return res.status(400).json({
        message: "Você já fez uma review para este livro"
      });
    }

    const insert = `
      INSERT INTO book_review (book_review_id, user_review_id, nota, comentario) 
      VALUES (
        (SELECT idbooks FROM books WHERE titulo = ?), 
        (SELECT idusers FROM users WHERE nomeuser = ?), ?, ?)`;
    const [result] = await connection.query(insert, [titulo, user, nota, comentario]);

    const newReview = {
      id: result.insertId,
      titulo,
      user,
      nota,
      comentario,
    };

    res.status(201).send(newReview);
  } catch (err) {
    console.error("Erro ao criar review:", err);
    res.status(500).send({ message: "Erro ao criar review", error: err.message });
  } finally {
    if (connection) connection.release(); // Liberar a conexão
  }
}

async function readReview(req, res) {
  const connection = await getConnection(); // Obter uma conexão do pool
  
  try {
    const select = `
      SELECT titulo, nomeuser, nota, comentario 
      FROM book_review 
      INNER JOIN users ON book_review.user_review_id = users.idusers 
      INNER JOIN books ON book_review.book_review_id = books.idbooks`;
    const [query] = await connection.query(select);
    
    res.status(200).send({ message: "Dados pegos do banco de dados", data: query });
  } catch (err) {
    console.error("Erro ao buscar reviews:", err);
    res.status(500).send({ message: "Erro ao buscar reviews", error: err.message });
  } finally {
    if (connection) connection.release(); // Liberar a conexão
  }
}

async function readReviewByBook(req, res) {
  const connection = await getConnection(); // Obter uma conexão do pool
  
  try {
    const { titulo } = req.body;

    if (!titulo) {
      return res.status(400).json({
        message: "Titulo é obrigatório"
      });
    }

    const selectByBook = `
      SELECT titulo, nomeuser, nota, comentario 
      FROM book_review 
      INNER JOIN users ON book_review.user_review_id = users.idusers 
      INNER JOIN books ON book_review.book_review_id = books.idbooks 
      WHERE titulo = ?`;
    const [query] = await connection.query(selectByBook, [titulo]);

    res.status(200).send({ message: "Dados pegos do banco", data: query });
  } catch (err) {
    console.error("Erro ao buscar reviews por livro:", err);
    res.status(500).send({ message: "Erro ao buscar reviews por livro", error: err.message });
  } finally {
    if (connection) connection.release(); // Liberar a conexão
  }
}

async function readReviewByName(req, res) {
  const connection = await getConnection(); // Obter uma conexão do pool
  
  try {
    const { nomeuser } = req.body;

    if (!nomeuser) {
      return res.status(400).json({
        message: "Nome de usuário é obrigatório"
      });
    }

    const selectByName = `
      SELECT titulo, nomeuser, nota, comentario 
      FROM book_review 
      INNER JOIN users ON book_review.user_review_id = users.idusers 
      INNER JOIN books ON book_review.book_review_id = books.idbooks 
      WHERE nomeuser = ?`;
    const [query] = await connection.query(selectByName, [nomeuser]);

    res.status(200).send({ message: "Dados pegos do banco", data: query });
  } catch (err) {
    console.error("Erro ao buscar reviews por usuário:", err);
    res.status(500).send({ message: "Erro ao buscar reviews por usuário", error: err.message });
  } finally {
    if (connection) connection.release(); // Liberar a conexão
  }
}

async function updateReviewByName(req, res) {
  const connection = await getConnection(); // Obter uma conexão do pool
  
  try {
    const { nomeuser, titulo, nota, comentario, nomeuserantigo, tituloantigo } = req.body;

    if (!nomeuser || !titulo || !nota || !comentario || !nomeuserantigo || !tituloantigo) {
      return res.status(400).json({
        message: "Todos os campos são obrigatórios"
      });
    }

    const updateByName = `
      UPDATE book_review 
      INNER JOIN books ON book_review.book_review_id = books.idbooks 
      INNER JOIN users ON users.idusers = book_review.user_review_id 
      SET 
        book_review_id = (SELECT idbooks FROM books WHERE titulo = ?), 
        user_review_id = (SELECT idusers FROM users WHERE nomeuser = ?), 
        nota = ?, 
        comentario = ? 
      WHERE titulo = ? AND nomeuser = ?`;
    const [result] = await connection.query(updateByName, [titulo, nomeuser, nota, comentario, tituloantigo, nomeuserantigo]);
    
    res.status(200).send({ message: "Review atualizada com sucesso", data: result });
  } catch (err) {
    console.error("Erro ao atualizar review:", err);
    res.status(500).send({ message: "Erro ao atualizar review", error: err.message });
  } finally {
    if (connection) connection.release(); // Liberar a conexão
  }
}

async function deleteReviewByName(req, res) {
  const connection = await getConnection(); // Obter uma conexão do pool
  
  try {
    const { nomeuser, titulo } = req.body;

    if (!nomeuser || !titulo) {
      return res.status(400).json({
        message: "Nome de usuário e título são obrigatórios"
      });
    }

    const deleteByName = `
      DELETE book_review 
      FROM book_review 
      INNER JOIN books ON book_review.book_review_id = books.idbooks 
      INNER JOIN users ON users.idusers = book_review.user_review_id 
      WHERE nomeuser = ? AND titulo = ?`;
    const [result] = await connection.query(deleteByName, [nomeuser, titulo]);
    
    res.status(200).send({ message: "Review deletada com sucesso", data: result });
  } catch (err) {
    console.error("Erro ao deletar review:", err);
    res.status(500).send({ message: "Erro ao deletar review", error: err.message });
  } finally {
    if (connection) connection.release(); // Liberar a conexão
  }
}

export {
  createReview,
  readReview,
  readReviewByBook,
  readReviewByName,
  updateReviewByName,
  deleteReviewByName
};