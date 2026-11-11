const pool = require("./db");

async function testarConexao() {
    try {
        const [resultado] = await pool.query("SELECT 1");

        console.log("Conexão com MySQL realizada com sucesso!");
        console.log(resultado);

    } catch (erro) {
        console.log("Erro na conexão:", erro.message);

    } finally {
        await pool.end();
    }
}

testarConexao();