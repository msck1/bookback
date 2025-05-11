import { getConnection } from '../config.js';

async function createUser(req, res) {
    const connection = await getConnection(); // Obter uma conexão do pool
    
    try {
        const { nomeuser, email, senha } = req.body;

        if (!nomeuser || !email || !senha) {
            return res.status(400).send({
                message: "Nome de usuário, email e senha são obrigatórios"
            });
        }

        const checkDuplicate = `SELECT nomeuser, email FROM users WHERE nomeuser = ? OR email = ? LIMIT 1`;
        const [existingUsers] = await connection.query(checkDuplicate, [nomeuser, email]);

        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: "Este usuário já está em uso"
            });
        }

        const insert = `INSERT INTO users (nomeuser, email, senha) VALUES (?, ?, ?)`;
        const [result] = await connection.query(insert, [nomeuser, email, senha]);

        const newUser = {
            id: result.insertId,
            nomeuser,
            email
        };

        res.status(201).send(newUser);
    } catch (err) {
        console.error("Erro ao criar usuário:", err);
        res.status(500).send({ message: "Erro ao criar usuário", error: err.message });
    } finally {
        if (connection) connection.release(); // Liberar a conexão
    }
}

async function readUser(req, res) {
    const connection = await getConnection(); // Obter uma conexão do pool
    
    try {
        const select = `SELECT * FROM users`;
        const [users] = await connection.query(select);

        res.status(200).send({ message: "Dados pegos do banco de dados", users });
    } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        res.status(500).send({ message: "Erro ao buscar usuários", error: err.message });
    } finally {
        if (connection) connection.release(); // Liberar a conexão
    }
}

async function readUserByEmail(req, res) {
    const connection = await getConnection(); // Obter uma conexão do pool
    
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email é obrigatório"
            });
        }

        const selectByEmail = `SELECT * FROM users WHERE email = ?`;
        const [users] = await connection.query(selectByEmail, [email]);

        if (!users.length) {
            return res.status(404).send({ message: 'Usuário não encontrado' });
        }

        res.status(200).send({ message: "Dados pegos do banco de dados", users });
    } catch (err) {
        console.error("Erro ao buscar usuário por email:", err);
        res.status(500).send({ message: "Erro ao buscar usuário", error: err.message });
    } finally {
        if (connection) connection.release(); // Liberar a conexão
    }
}

async function updateUserByEmail(req, res) {
    const connection = await getConnection(); // Obter uma conexão do pool
    
    try {
        const { nomeuser, senha, email, emailantigo } = req.body;

        if (!nomeuser || !senha || !email || !emailantigo) {
            return res.status(400).send({
                message: "Nome de usuário, senha, email e email antigo são obrigatórios"
            });
        }

        const checkEmail = `SELECT * FROM users WHERE email = ?`;
        const [existingUser] = await connection.query(checkEmail, [emailantigo]);

        if (!existingUser.length) {
            return res.status(404).send({
                message: "Usuário não encontrado para atualização"
            });
        }

        const updateByEmail = `UPDATE users SET nomeuser = ?, email = ?, senha = ? WHERE email = ?`;
        await connection.query(updateByEmail, [nomeuser, email, senha, emailantigo]);

        res.status(200).send({ message: 'Usuário atualizado com sucesso' });
    } catch (err) {
        console.error("Erro ao atualizar usuário:", err);
        res.status(500).send({ message: "Erro ao atualizar usuário", error: err.message });
    } finally {
        if (connection) connection.release(); // Liberar a conexão
    }
}

async function deleteUserByEmail(req, res) {
    const connection = await getConnection(); // Obter uma conexão do pool
    
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).send({
                message: "Email é obrigatório"
            });
        }

        const checkEmail = `SELECT * FROM users WHERE email = ?`;
        const [existingUser] = await connection.query(checkEmail, [email]);

        if (!existingUser.length) {
            return res.status(404).send({
                message: "Usuário não encontrado para exclusão"
            });
        }

        const deleteByEmail = `DELETE FROM users WHERE email = ?`;
        await connection.query(deleteByEmail, [email]);

        res.status(200).send({ message: 'Usuário deletado com sucesso' });
    } catch (err) {
        console.error("Erro ao deletar usuário:", err);
        res.status(500).send({ message: "Erro ao deletar usuário", error: err.message });
    } finally {
        if (connection) connection.release(); // Liberar a conexão
    }
}

async function loginUser(req, res) {
    const connection = await getConnection(); // Obter uma conexão do pool
    
    try {
        const { nomeuser, senha } = req.body;

        if (!nomeuser || !senha) {
            return res.status(400).send({
                message: "Nome de usuário e senha são obrigatórios"
            });
        }

        const checkExists = `SELECT idusers, nomeuser, senha, email FROM users WHERE nomeuser = ?`;
        const [existingUsers] = await connection.query(checkExists, [nomeuser]);

        if (!existingUsers.length) {
            return res.status(404).send({
                message: "Este usuário não existe"
            });
        }

        const user = existingUsers[0];

        if (senha !== user.senha) {
            return res.status(401).send({
                message: "Senha incorreta"
            });
        }

        res.status(200).send({ message: "Login bem-sucedido", user });
    } catch (err) {
        console.error("Erro durante login:", err);
        res.status(500).send({ message: "Erro durante login", error: err.message });
    } finally {
        if (connection) connection.release(); // Liberar a conexão
    }
}

export { createUser, readUser, readUserByEmail, updateUserByEmail, deleteUserByEmail, loginUser };