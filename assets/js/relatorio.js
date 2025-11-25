import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// Importante: adicionei getDocs aqui na importação
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

    try {
        //  Cria a query (a pergunta)
        const q = query(collection(db, "livros"), where("status", "==", "Emprestado"));

        //  Executa a query (busca a resposta) -> AQUI ESTAVA O ERRO ANTES
        const querySnapshot = await getDocs(q);

        tabela.innerHTML = ""; // Limpa o "Carregando..."

        //  Verifica se veio vazio
        if (querySnapshot.empty) {
            tabela.innerHTML = `
                        <tr>
                            <td colspan="5" class="text-center text-muted p-4">
                                Nenhum livro consta como "Emprestado" no momento.
                            </td>
                        </tr>`;
            return;
        }

        //  Se tiver dados, desenha na tela
        querySnapshot.forEach((doc) => {
            const livro = doc.data();

            const linha = `
                        <tr>
                            <td class="fw-bold">${livro.titulo}</td>
                            <td>${livro.autor}</td>
                            <td>${livro.editora || '-'}</td>
                            <td><code>${livro.codigo}</code></td>
                            <td>
                                <span class="badge bg-warning text-dark">
                                    Emprestado
                                </span>
                            </td>
                        </tr>
                    `;
            tabela.innerHTML += linha;
        });

    } catch (erro) {
        console.error("Erro completo:", erro);
        tabela.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Erro: ${erro.message}</td></tr>`;
    }
}

carregarRelatorio();