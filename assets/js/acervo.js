import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAqCzcbTf4ZWwQKXGY5ELD3qjxjokay6Ds",
    authDomain: "projeto-final-bb566.firebaseapp.com",
    projectId: "projeto-final-bb566",
    storageBucket: "projeto-final-bb566.firebasestorage.app",
    messagingSenderId: "964611662890",
    appId: "1:964611662890:web:b0988263a185c92da1cf53"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let todosOsLivros = [];

// Referências
const tabela = document.getElementById('tabelaLivros');
const inputBusca = document.getElementById('inputBusca');

// 1. Carregar Acervo
async function carregarAcervo() {
    tabela.innerHTML = '<tr><td colspan="7" class="text-center">Carregando...</td></tr>';

    try {
        const querySnapshot = await getDocs(collection(db, "livros"));
        todosOsLivros = [];

        querySnapshot.forEach((documento) => {
            todosOsLivros.push({
                id: documento.id,
                ...documento.data()
            });
        });

        renderizarTabela(todosOsLivros);

    } catch (erro) {
        console.error("Erro:", erro);
        tabela.innerHTML = `<tr><td colspan="7" class="text-danger text-center">Erro: ${erro.message}</td></tr>`;
    }
}

// 2. Renderizar Tabela (Com o botão Atualizar)
function renderizarTabela(listaDeLivros) {
    tabela.innerHTML = "";

    if (listaDeLivros.length === 0) {
        tabela.innerHTML = '<tr><td colspan="7" class="text-center p-4">Nenhum livro encontrado.</td></tr>';
        return;
    }

    listaDeLivros.forEach(livro => {
        const linha = `
            <tr>
                <td class="fw-bold">${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>${livro.editora || '-'}</td>
                <td><span class="badge bg-secondary">${livro.categoria}</span></td>
                <td><code>${livro.codigo}</code></td>
                <td>
                    <span class="badge ${livro.status === 'Emprestado' ? 'bg-warning text-dark' : 'bg-success'}">
                        ${livro.status || 'Disponível'}
                    </span>
                </td>
                <td class="text-center">
                    <a href="/pages/atualizar.html?id=${livro.id}" class="btn btn-primary btn-sm me-2">
                        Editar
                    </a>
                    
                    <button onclick="excluirLivro('${livro.id}')" class="btn btn-danger btn-sm">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
        tabela.innerHTML += linha;
    });
}

// Busca (Filtro)
if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const listaFiltrada = todosOsLivros.filter(livro =>
            (livro.titulo || '').toLowerCase().includes(termo) ||
            (livro.autor || '').toLowerCase().includes(termo) ||
            (livro.codigo || '').toLowerCase().includes(termo) ||
            (livro.editora || '').toLowerCase().includes(termo) ||
            (livro.status || '').toLowerCase().includes(termo) ||
            (livro.categoria || '').toLowerCase().includes(termo)
        );
        renderizarTabela(listaFiltrada);
    });
}

// 4. Excluir Global
window.excluirLivro = async (id) => {
    if (confirm("Tem certeza que deseja excluir este livro?")) {
        try {
            await deleteDoc(doc(db, "livros", id));
            alert("Livro excluído!");
            carregarAcervo();
        } catch (erro) {
            alert("Erro: " + erro.message);
        }
    }
}

// Inicia
carregarAcervo();