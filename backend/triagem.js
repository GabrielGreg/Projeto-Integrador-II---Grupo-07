const API_BASE_URL = "http://localhost:3000";

const select = document.getElementById("atendimentoSelect");
const form = document.getElementById("triagemForm");
const message = document.getElementById("message");
const statusLista = document.getElementById("listStatus");
const saveButton = document.getElementById("saveButton");
const refreshButton = document.getElementById("refreshButton");
let atendimentoAtual = null;

function aviso(texto, tipo="info") {
  message.textContent = texto;
  message.className = `show ${tipo}`;
}
function limparAviso() { message.textContent = ""; message.className = ""; }
function bloquearCampos(bloquear) {
  [...form.elements].forEach(el => {
    if (el.id !== "clearButton" && el.id !== "saveButton") el.disabled = bloquear;
  });
  saveButton.disabled = bloquear;
}
function preencherPaciente(paciente={}, atendimento={}) {
  document.getElementById("nomePaciente").value = paciente.nome || "";
  document.getElementById("cpfPaciente").value = paciente.cpf || "";
  document.getElementById("nascimentoPaciente").value = paciente.data_nascimento || "";
  document.getElementById("numeroAtendimento").value = atendimento.id_atendimento ?? "";
  document.getElementById("dataHora").value = new Date().toLocaleString("pt-BR");
}

async function carregarAtendimentos() {
  select.innerHTML = '<option value="">Consultando servidor...</option>';
  statusLista.textContent = "Buscando atendimentos no banco de dados...";
  refreshButton.disabled = true;
  try {
    const resp = await fetch(`${API_BASE_URL}/api/atendimentos/aguardando-triagem`);
    if (!resp.ok) throw new Error(`Erro ao consultar atendimentos: HTTP ${resp.status}`);
    const lista = await resp.json();
    select.innerHTML = '<option value="">Selecione um atendimento</option>';
    if (!Array.isArray(lista) || lista.length === 0) {
      select.innerHTML = '<option value="">Nenhum atendimento aguardando triagem</option>';
      statusLista.textContent = "Não há atendimentos aguardando triagem.";
      return;
    }
    lista.forEach(item => {
      const option = document.createElement("option");
      option.value = item.id_atendimento;
      option.textContent = `Atendimento #${item.id_atendimento}`;
      select.appendChild(option);
    });
    statusLista.textContent = `${lista.length} atendimento(s) encontrado(s).`;
  } catch (err) {
    select.innerHTML = '<option value="">Falha ao consultar API</option>';
    statusLista.textContent = "Verifique se o backend está ativo e se a URL da API está correta.";
    aviso(`${err.message}. Nenhum dado de exemplo foi carregado.`, "error");
  } finally { refreshButton.disabled = false; }
}

async function carregarDetalhes(id) {
  limparAviso();
  atendimentoAtual = null;
  preencherPaciente();
  bloquearCampos(true);
  if (!id) return;
  try {
    const resp = await fetch(`${API_BASE_URL}/api/atendimentos/${encodeURIComponent(id)}`);
    if (!resp.ok) throw new Error(`Erro ao carregar paciente: HTTP ${resp.status}`);
    const dados = await resp.json();
    // Resposta esperada: { id_atendimento, paciente: { nome, cpf, data_nascimento } }
    atendimentoAtual = dados;
    preencherPaciente(dados.paciente, dados);
    bloquearCampos(false);
  } catch (err) { aviso(err.message, "error"); }
}

function criarPayload() {
  return {
    id_atendimento: Number(atendimentoAtual.id_atendimento),
    pressao_arterial: document.getElementById("pressao").value.trim(),
    temperatura: Number(document.getElementById("temperatura").value),
    batimentos_cardiacos: Number(document.getElementById("batimentos").value),
    queixa_principal: document.getElementById("queixa").value.trim(),
    observacoes: document.getElementById("observacoes").value.trim(),
    classificacao_risco: document.querySelector('input[name="classificacao_risco"]:checked').value
  };
}

async function salvar(event) {
  event.preventDefault();
  limparAviso();
  if (!atendimentoAtual) { aviso("Selecione um atendimento válido.", "error"); return; }
  if (!form.reportValidity()) return;
  saveButton.disabled = true;
  saveButton.textContent = "Salvando...";
  try {
    const resp = await fetch(`${API_BASE_URL}/api/triagens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(criarPayload())
    });
    if (!resp.ok) {
      const detalhe = await resp.text();
      throw new Error(detalhe || `Erro ao salvar: HTTP ${resp.status}`);
    }
    aviso("Triagem registrada com sucesso no sistema.", "success");
    form.reset();
    atendimentoAtual = null;
    preencherPaciente();
    bloquearCampos(true);
    await carregarAtendimentos();
  } catch (err) { aviso(`${err.message}. Os dados não foram salvos.`, "error"); }
  finally { saveButton.disabled = !atendimentoAtual; saveButton.textContent = "Salvar triagem →"; }
}

select.addEventListener("change", e => carregarDetalhes(e.target.value));
refreshButton.addEventListener("click", carregarAtendimentos);
form.addEventListener("submit", salvar);
document.getElementById("clearButton").addEventListener("click", () => {
  setTimeout(() => { limparAviso(); if (atendimentoAtual) preencherPaciente(atendimentoAtual.paciente, atendimentoAtual); }, 0);
});

bloquearCampos(true);
document.getElementById("dataHora").value = new Date().toLocaleString("pt-BR");
carregarAtendimentos();
