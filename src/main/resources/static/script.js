const API = 'http://localhost:8080/blog';
let editandoId = null; // Para controlar se estamos editando ou criando

document.addEventListener('DOMContentLoaded', () => {
  carregarArtigos();

  document.getElementById('btn-novo').addEventListener('click', () => mostrarFormulario());
  document.getElementById('btn-cancelar').addEventListener('click', () => mostrarLista());
  document.getElementById('btn-salvar').addEventListener('click', salvarArtigo);
});

function mostrarFormulario(){
  document.getElementById('tela-lista').style.display = 'none';
  document.getElementById('tela-formulario').style.display = 'block';
  limparFormulario();
}

function mostrarLista(){
  document.getElementById('tela-lista').style.display = 'block';
  document.getElementById('tela-formulario').style.display = 'none';
}

function limparFormulario(){
  editandoId = null; // Limpa o ID de edição
  document.getElementById('titulo').value = '';
  document.getElementById('autor').value = '';
  document.getElementById('dataPubli').value = new Date().toISOString().slice(0,10);
  document.getElementById('texto').value = '';
  document.getElementById('mensagem').innerText = '';
}

async function carregarArtigos(){
  try {
    const resp = await fetch(API);
    const data = await resp.json();
    renderizarArtigos(data);
  } catch(err){
    console.error(err);
    document.getElementById('artigos').innerHTML = '<p>Erro ao carregar artigos.</p>';
  }
}

function renderizarArtigos(lista){
  const container = document.getElementById('artigos');
  container.innerHTML = '';
  if(!lista || lista.length === 0){
    container.innerHTML = '<p>Nenhum texto cadastrado.</p>';
    return;
  }
  for(const a of lista){
    const card = document.createElement('div');
    card.className = 'article-card';
    
    // --- Título e Badge (Ajustado para bater com a imagem) ---
    const titulo = document.createElement('div');
    titulo.className = 'article-title';
    titulo.innerText = a.titulo; // Adiciona o texto do título
    
    const pub = a.dataPubli;
    const hoje = new Date();
    const dpub = new Date(pub);
    
    if(dpub > new Date(hoje.toDateString())){
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.innerText = 'NÃO PUBLICADO';
      titulo.appendChild(badge); // Adiciona o badge *dentro* da div do título
    }
    card.appendChild(titulo); // Adiciona a div do título ao card

    // --- Meta (Autor e Data) (Ajustado para bater com a imagem) ---
    const meta = document.createElement('div');
    const dataFormatada = new Date(pub).toLocaleDateString();
    // Remove 'strong' para ficar igual à imagem
    meta.innerHTML = `Autor: ${a.autor} <br> Publicado em: ${dataFormatada}`;
    card.appendChild(meta);

    // --- Resumo (Texto) ---
    const resumo = document.createElement('div');
    resumo.innerHTML = `<p>${a.texto}</p>`;
    card.appendChild(resumo);

    // --- BOTÕES (Novo) ---
    const btnContainer = document.createElement('div');
    
    const btnAlterar = document.createElement('button');
    btnAlterar.innerText = 'Alterar';
    btnAlterar.addEventListener('click', () => prepararEdicao(a)); // Chama a nova função
    
    const btnExcluir = document.createElement('button');
    btnExcluir.innerText = 'Excluir';
    btnExcluir.className = 'delete'; // Adiciona a classe para o CSS deixar vermelho
    btnExcluir.addEventListener('click', () => excluirArtigo(a.id)); // Chama a nova função
    
    btnContainer.appendChild(btnAlterar);
    btnContainer.appendChild(btnExcluir);
    card.appendChild(btnContainer); // Adiciona o container de botões ao card

    container.appendChild(card);
  }
}

async function salvarArtigo(){
  const dto = {
    titulo: document.getElementById('titulo').value.trim(),
    autor: document.getElementById('autor').value.trim(),
    dataPubli: document.getElementById('dataPubli').value,
    texto: document.getElementById('texto').value.trim()
  };

  const msg = document.getElementById('mensagem');
  msg.style.color = 'red';
  if(!dto.titulo || !dto.autor || !dto.dataPubli || !dto.texto){
    msg.innerText = 'Todos os campos são obrigatórios.';
    return;
  }
  if(dto.texto.length < 10){
    msg.innerText = 'O texto deve ter no mínimo 10 caracteres.';
    return;
  }
  
  const id = editandoId; // Pega o ID (null se for novo)
  const hoje = new Date().toISOString().slice(0,10);
  
  // Só valida a data se for um *novo* artigo
  if(dto.dataPubli < hoje && !id){
    msg.innerText = 'A data de publicação deve ser hoje ou no futuro.';
    return;
  }

  // --- LÓGICA DE SALVAR ATUALIZADA ---
  const method = id ? 'PUT' : 'POST'; // Define o método
  const url = id ? `${API}/${id}` : API; // Define a URL

  try {
    const resp = await fetch(url, {
      method: method, // USA O MÉTODO DINÂMICO
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(dto)
    });

    if(resp.ok){
      msg.style.color = 'green';
      msg.innerText = 'Texto salvo com sucesso!';
      
      await carregarArtigos();

      setTimeout(() => mostrarLista(), 700);
    } else {
      const err = await resp.json();

      if(err.errors) {
        msg.innerText = err.errors.join(' | ');
      } else if(err.error){
        msg.innerText = err.error;
      } else {
        msg.innerText = 'Erro ao salvar (servidor).';
      }
    }
  } catch(e){
    msg.innerText = 'Erro ao conectar com o servidor.';
    console.error(e);
  }
}

// --- NOVAS FUNÇÕES ---

function prepararEdicao(artigo){
  editandoId = artigo.id; // Guarda o ID do artigo que estamos editando
  
  // Preenche o formulário com os dados do artigo
  document.getElementById('titulo').value = artigo.titulo;
  document.getElementById('autor').value = artigo.autor;
  // Formata a data para o input type="date" (YYYY-MM-DD)
  document.getElementById('dataPubli').value = new Date(artigo.dataPubli).toISOString().slice(0,10);
  document.getElementById('texto').value = artigo.texto;
  
  // Mostra o formulário
  document.getElementById('tela-lista').style.display = 'none';
  document.getElementById('tela-formulario').style.display = 'block';
  document.getElementById('mensagem').innerText = '';
}

async function excluirArtigo(id) {
  // Pede confirmação
  if (confirm('Tem certeza que deseja excluir este artigo?')) {
    try {
      const resp = await fetch(`${API}/${id}`, {
        method: 'DELETE'
      });
      
      if (resp.ok) {
        // Deletado com sucesso, recarregar a lista
        await carregarArtigos();
      } else {
        alert('Erro ao excluir o artigo.');
        console.error(await resp.text());
      }
    } catch (e) {
      alert('Erro ao conectar com o servidor.');
      console.error(e);
    }
  }
}