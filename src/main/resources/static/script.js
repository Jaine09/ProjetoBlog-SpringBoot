const API = 'http://localhost:8080/blog';

let editandoId = null;
let idParaExcluir = null;

document.addEventListener('DOMContentLoaded', () => {
  carregarArtigos();

  document.getElementById('btn-novo').addEventListener('click', mostrarFormulario);
  document.getElementById('btn-cancelar').addEventListener('click', mostrarLista);
  document.getElementById('btn-salvar').addEventListener('click', salvarArtigo);

  document.getElementById('btn-sim-exclusao').addEventListener('click', confirmarExclusaoReal);
  document.getElementById('btn-nao-exclusao').addEventListener('click', fecharModal);
});

function mostrarFormulario() {
  document.getElementById('tela-lista').style.display = 'none';
  document.getElementById('tela-formulario').style.display = 'block';
  document.getElementById('mensagem').innerText = '';
}

function mostrarLista() {
  editandoId = null;
  document.getElementById('tela-lista').style.display = 'block';
  document.getElementById('tela-formulario').style.display = 'none';
  limparFormulario();
}

function limparFormulario() {
  document.getElementById('titulo').value = '';
  document.getElementById('autor').value = '';
  document.getElementById('dataPubli').value = new Date().toISOString().slice(0, 10);
  document.getElementById('texto').value = '';
}


async function carregarArtigos() {
  try {
    const resp = await fetch(API);
    const data = await resp.json();
    renderizarArtigos(data);
  } catch (e) {
    console.error(e);
    document.getElementById('artigos').innerHTML = "<p>Erro ao carregar artigos.</p>";
  }
}

function renderizarArtigos(lista) {
  const container = document.getElementById('artigos');
  container.innerHTML = '';

  if (!lista.length) {
    container.innerHTML = '<p>Nenhum texto cadastrado.</p>';
    return;
  }

  lista.forEach(a => {
    const card = document.createElement('div');
    card.className = 'article-card';

    const titulo = document.createElement('div');
    titulo.className = 'article-title';
    titulo.innerText = a.titulo;

    const dataString = a.dataPubli.includes('T') ? a.dataPubli.split('T')[0] : a.dataPubli;
    const dpub = new Date(dataString);
    const hoje = new Date();
    hoje.setHours(0,0,0,0);

    if (dpub > hoje) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.innerText = 'NÃO PUBLICADO';
      titulo.appendChild(badge);
    }

    card.appendChild(titulo);

    const meta = document.createElement('div');
    meta.innerHTML = `Autor: ${a.autor}<br>Publicado em: ${new Date(dataString).toLocaleDateString("pt-BR")}`;
    card.appendChild(meta);

    const texto = document.createElement('div');
    texto.innerHTML = `<p>${a.texto}</p>`;
    card.appendChild(texto);

    const btns = document.createElement('div');
    const btnAlt = document.createElement('button');
    btnAlt.innerText = "Alterar";
    btnAlt.onclick = () => prepararEdicao(a);

    const btnExc = document.createElement('button');
    btnExc.innerText = "Excluir";
    btnExc.className = "delete";
    btnExc.onclick = () => excluirArtigo(a.id);

    btns.appendChild(btnAlt);
    btns.appendChild(btnExc);

    card.appendChild(btns);
    container.appendChild(card);
  });
}


async function salvarArtigo() {
  const dto = {
    titulo: document.getElementById('titulo').value.trim(),
    autor: document.getElementById('autor').value.trim(),
    dataPubli: document.getElementById('dataPubli').value.trim(),
    texto: document.getElementById('texto').value.trim()
  };

  const msg = document.getElementById('mensagem');
  msg.style.color = "red";

  if (!dto.titulo || !dto.autor || !dto.dataPubli || !dto.texto) {
    msg.innerText = "Todos os campos são obrigatórios.";
    return;
  }

  const method = editandoId ? "PUT" : "POST";
  const url = editandoId ? `${API}/${editandoId}` : API;

  try {
    const resp = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto)
    });

    if (resp.ok) {
      msg.style.color = "green";
      msg.innerText = "Salvo com sucesso!";
      await carregarArtigos();
      setTimeout(() => mostrarLista(), 700);
    } else {
      const err = await resp.json().catch(() => null);
      msg.innerText = err?.error || "Erro ao salvar.";
    }
  } catch (e) {
    msg.innerText = "Erro ao conectar ao servidor.";
  }
}

function prepararEdicao(post) {
  editandoId = post.id;
  console.log("Editando ID:", editandoId);

  document.getElementById('titulo').value = post.titulo;
  document.getElementById('autor').value = post.autor;

  const data = post.dataPubli.includes("T") ? post.dataPubli.split("T")[0] : post.dataPubli;
  document.getElementById('dataPubli').value = data;

  document.getElementById('texto').value = post.texto;

  mostrarFormulario();
}

function excluirArtigo(id) {
  idParaExcluir = id;
  document.getElementById('modal-confirmacao').style.display = 'flex';
}

async function confirmarExclusaoReal() {
  if (!idParaExcluir) return;

  try {
    const resp = await fetch(`${API}/${idParaExcluir}`, { method: "DELETE" });
    fecharModal();
    await carregarArtigos();
  } catch (e) {
    alert("Erro de conexão.");
  }
}

function fecharModal() {
  idParaExcluir = null;
  document.getElementById('modal-confirmacao').style.display = 'none';
}
