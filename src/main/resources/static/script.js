const API = 'http://localhost:8080/blog';

// Variáveis de Estado
let editandoId = null;      // Guarda o ID se estivermos editando
let idParaExcluir = null;   // Guarda o ID temporariamente para o Modal

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
  carregarArtigos();

  // Botões de Navegação e Ação
  document.getElementById('btn-novo').addEventListener('click', mostrarFormulario);
  document.getElementById('btn-cancelar').addEventListener('click', mostrarLista);
  document.getElementById('btn-salvar').addEventListener('click', salvarArtigo);

  // Listeners do Modal (Caixa de Confirmação)
  document.getElementById('btn-sim-exclusao').addEventListener('click', confirmarExclusaoReal);
  document.getElementById('btn-nao-exclusao').addEventListener('click', fecharModal);
});

// --- FUNÇÕES DE UI (INTERFACE) ---

function mostrarFormulario() {
  document.getElementById('tela-lista').style.display = 'none';
  document.getElementById('tela-formulario').style.display = 'block';
  limparFormulario();
}

function mostrarLista() {
  document.getElementById('tela-lista').style.display = 'block';
  document.getElementById('tela-formulario').style.display = 'none';
}

function limparFormulario() {
  editandoId = null;
  document.getElementById('titulo').value = '';
  document.getElementById('autor').value = '';
  // Define a data como hoje (formato YYYY-MM-DD)
  document.getElementById('dataPubli').value = new Date().toISOString().slice(0, 10);
  document.getElementById('texto').value = '';
  document.getElementById('mensagem').innerText = '';
}

function fecharModal() {
  idParaExcluir = null; // Limpa o ID da memória
  document.getElementById('modal-confirmacao').style.display = 'none';
}

// --- CRUD: READ (LER) ---

async function carregarArtigos() {
  try {
    const resp = await fetch(API);
    const data = await resp.json();
    renderizarArtigos(data);
  } catch (err) {
    console.error(err);
    document.getElementById('artigos').innerHTML = '<p>Erro ao carregar artigos.</p>';
  }
}

function renderizarArtigos(lista) {
  const container = document.getElementById('artigos');
  container.innerHTML = '';

  if (!lista || lista.length === 0) {
    container.innerHTML = '<p>Nenhum texto cadastrado.</p>';
    return;
  }

  for (const a of lista) {
    const card = document.createElement('div');
    card.className = 'article-card';

    // 1. Título e Badge
    const titulo = document.createElement('div');
    titulo.className = 'article-title';
    titulo.innerText = a.titulo;

    // Lógica para badge "NÃO PUBLICADO"
    // Adicionamos 'T00:00:00' para garantir que o navegador entenda a data local corretamente
    const dataString = a.dataPubli.includes('T') ? a.dataPubli : a.dataPubli + 'T00:00:00';
    const dpub = new Date(dataString);
    const hoje = new Date();

    // Zera a hora de hoje para comparar apenas a data
    hoje.setHours(0,0,0,0);

    if (dpub > hoje) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.innerText = 'NÃO PUBLICADO';
      titulo.appendChild(badge);
    }
    card.appendChild(titulo);

    // 2. Metadados (Autor e Data)
    const meta = document.createElement('div');
    // Corrige problema de fuso horário ao exibir a data
    const dataFormatada = new Date(dataString).toLocaleDateString('pt-BR');
    meta.innerHTML = `Autor: ${a.autor} <br> Publicado em: ${dataFormatada}`;
    card.appendChild(meta);

    // 3. Resumo (Texto)
    const resumo = document.createElement('div');
    resumo.innerHTML = `<p>${a.texto}</p>`;
    card.appendChild(resumo);

    // 4. Botões de Ação
    const btnContainer = document.createElement('div');

    const btnAlterar = document.createElement('button');
    btnAlterar.innerText = 'Alterar';
    btnAlterar.addEventListener('click', () => prepararEdicao(a));

    const btnExcluir = document.createElement('button');
    btnExcluir.innerText = 'Excluir';
    btnExcluir.className = 'delete'; // Estilo vermelho
    btnExcluir.addEventListener('click', () => excluirArtigo(a.id)); // Abre o Modal

    btnContainer.appendChild(btnAlterar);
    btnContainer.appendChild(btnExcluir);
    card.appendChild(btnContainer);

    container.appendChild(card);
  }
}

// --- CRUD: CREATE & UPDATE (CRIAR E ATUALIZAR) ---

async function salvarArtigo() {
  const dto = {
    titulo: document.getElementById('titulo').value.trim(),
    autor: document.getElementById('autor').value.trim(),
    dataPubli: document.getElementById('dataPubli').value,
    texto: document.getElementById('texto').value.trim()
  };

  const msg = document.getElementById('mensagem');
  msg.style.color = 'red';

  // Validação Front-end
  if (!dto.titulo || !dto.autor || !dto.dataPubli || !dto.texto) {
    msg.innerText = 'Todos os campos são obrigatórios.';
    return;
  }
  if (dto.texto.length < 10) {
    msg.innerText = 'O texto deve ter no mínimo 10 caracteres.';
    return;
  }

  const id = editandoId;
  const hojeString = new Date().toISOString().slice(0, 10);

  // Só valida a data se for um NOVO artigo
  if (dto.dataPubli < hojeString && !id) {
    msg.innerText = 'A data de publicação deve ser hoje ou no futuro.';
    return;
  }

  // Define se é POST (novo) ou PUT (edição)
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API}/${id}` : API;

  try {
    const resp = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    });

    if (resp.ok) {
      msg.style.color = 'green';
      msg.innerText = 'Texto salvo com sucesso!';

      await carregarArtigos();
      setTimeout(() => mostrarLista(), 700); // Volta pra lista após 0.7s
    } else {
      // Tenta ler o erro do Back-end
      const err = await resp.json();
      if (err.errors) {
        msg.innerText = err.errors.join(' | ');
      } else if (err.error) {
        msg.innerText = err.error;
      } else {
        msg.innerText = 'Erro ao salvar (servidor).';
      }
    }
  } catch (e) {
    msg.innerText = 'Erro ao conectar com o servidor.';
    console.error(e);
  }
}

function prepararEdicao(artigo) {
  editandoId = artigo.id;
  console.log("Aquii");

  document.getElementById('titulo').value = artigo.titulo;
  document.getElementById('autor').value = artigo.autor;
  document.getElementById('dataPubli').value = artigo.dataPubli; // Já vem como YYYY-MM-DD do Java LocalDate
  document.getElementById('texto').value = artigo.texto;

  mostrarFormulario();
  document.getElementById('mensagem').innerText = '';
}

// --- CRUD: DELETE (EXCLUIR COM MODAL) ---

function excluirArtigo(id) {
  idParaExcluir = id;
  document.getElementById('modal-confirmacao').style.display = 'flex';
}

async function confirmarExclusaoReal() {
  if (!idParaExcluir) return;

  try {
    const resp = await fetch(`${API}/${idParaExcluir}`, {
      method: 'DELETE'
    });

    if (resp.ok) {
      fecharModal();
      await carregarArtigos();
    } else {
      alert('Erro ao excluir o artigo.');
      fecharModal();
    }
  } catch (e) {
    console.error(e);
    alert('Erro de conexão.');
    fecharModal();
  }
}