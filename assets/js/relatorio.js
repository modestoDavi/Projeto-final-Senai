import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

async function carregarRelatorio() {
    const tabela = document.getElementById('tabelaRelatorio');
    const totalLivrosSpan = document.getElementById('totalLivros');

    try {
        // Mostrar mensagem de carregamento
        tabela.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="spinner-border text-danger" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                    <p class="mt-2">Buscando livros emprestados...</p>
                </td>
            </tr>`;

        // Criar a query para buscar livros emprestados
        const q = query(collection(db, "livros"), where("status", "==", "Emprestado"));
        const querySnapshot = await getDocs(q);

        // Limpar a tabela
        tabela.innerHTML = "";

        // Verificar se veio vazio
        if (querySnapshot.empty) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted p-5">
                        <i class="bi bi-check-circle-fill text-success display-4"></i>
                        <h4 class="mt-3">Todos os livros estão disponíveis!</h4>
                        <p class="text-muted">Nenhum livro consta como "Emprestado" no momento.</p>
                    </td>
                </tr>`;

            if (totalLivrosSpan) {
                totalLivrosSpan.textContent = "0";
            }
            return;
        }

        // Atualizar contador
        if (totalLivrosSpan) {
            totalLivrosSpan.textContent = querySnapshot.size;
        }

        // Se tiver dados, desenha na tela
        querySnapshot.forEach((doc) => {
            const livro = doc.data();

            // Pegar os dados da pessoa (agora buscando do Firestore)
            const nomePessoa = livro.nomePessoa || 'Não informado';
            const emailPessoa = livro.emailPessoa || 'Não informado';
            const dataEmprestimo = livro.dataEmprestimo ?
                new Date(livro.dataEmprestimo).toLocaleDateString('pt-BR') :
                'Data não registrada';

            // Formatar email como link
            const emailLink = emailPessoa !== 'Não informado' && emailPessoa.includes('@') ?
                `<a href="mailto:${emailPessoa}" class="text-decoration-none">${emailPessoa}</a>` :
                emailPessoa;

            const linha = `
                <tr>
                    <td class="fw-bold">${livro.titulo || 'Sem título'}</td>
                    <td>${livro.autor || 'Não informado'}</td>
                    <td>${livro.editora || '-'}</td>
                    <td><code class="bg-light p-1 rounded">${livro.codigo || 'Sem código'}</code></td>
                    <td>
                        <span class="badge bg-warning text-dark">
                            <i class="bi bi-bookmark-check me-1"></i>Emprestado
                        </span>
                        <br>
                        <small class="text-muted">${dataEmprestimo}</small>
                    </td>
                    <td>
                        <strong>${nomePessoa}</strong>
                    </td>
                    <td>
                        ${emailLink}
                    </td>
                </tr>
            `;
            tabela.innerHTML += linha;
        });

        // Adicionar rodapé com resumo
        const linhaResumo = `
            <tr class="table-info">
                <td colspan="7" class="text-center fw-bold">
                    <i class="bi bi-info-circle me-2"></i>
                    Total de livros emprestados: ${querySnapshot.size}
                    ${querySnapshot.size === 1 ? 'livro' : 'livros'}
                </td>
            </tr>
        `;
        tabela.innerHTML += linhaResumo;

    } catch (erro) {
        console.error("Erro completo:", erro);
        tabela.innerHTML = `
            <tr>
                <td colspan="7" class="text-danger text-center p-4">
                    <i class="bi bi-exclamation-triangle-fill display-4"></i>
                    <h4 class="mt-3">Erro ao carregar relatório</h4>
                    <p>${erro.message}</p>
                    <button onclick="carregarRelatorio()" class="btn btn-sm btn-outline-danger mt-2">
                        <i class="bi bi-arrow-clockwise me-1"></i>Tentar novamente
                    </button>
                </td>
            </tr>`;
    }
}

// Função para tornar carregarRelatorio disponível globalmente (para o botão de tentar novamente)
window.carregarRelatorio = carregarRelatorio;

// Carregar quando a página for aberta
document.addEventListener('DOMContentLoaded', carregarRelatorio);