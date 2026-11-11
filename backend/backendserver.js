const express = require("express");
const path = require("path");
const pool = require("./db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/teste", async (req, res) => {
    try {
        const [resultado] = await pool.query("SELECT 1");

        res.json({
            mensagem: "Servidor e banco de dados funcionando!",
            resultado
        });

    } catch (erro) {
        res.status(500).json({
            erro: erro.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.post("/cadastro_de_paciente", async (req, res) => {
    try {
        const { nome, cpf, data_nascimento } = req.body;

        const sql = `INSERT INTO pacientes (nome, cpf, data_nascimento) VALUES (?, ?, ?)`;

        const [resultado] = await pool.query(sql, [nome, cpf, data_nascimento]);

        res.json({
            mensagem: "Paciente cadastrado com sucesso!",
            id: resultado.insertId
        });

    } catch (erro) {
        res.status(500).json({
            erro: erro.message
        });
    }

    });

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});