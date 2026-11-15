const formulario = document.getElementById("formPaciente");

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const paciente = {
        nome: document.getElementById("nome").value,
        data_nascimento: document.getElementById("data_nascimento").value,
        cpf: document.getElementById("cpf").value.trim() || null,
        telefone: document.getElementById("telefone").value
    };

    try {
        const resposta = await fetch("/cadastro_de_paciente", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(paciente)
        });

        const resultado = await resposta.json();

        document.getElementById("mensagem").textContent =
            resposta.ok ? resultado.mensagem : resultado.erro;

        if (resposta.ok) {
            formulario.reset();
        }

    } catch (erro) {
        document.getElementById("mensagem").textContent =
            "Não foi possível conectar ao servidor.";
    }
});