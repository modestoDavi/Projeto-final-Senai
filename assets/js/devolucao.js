import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {getFirestore, collection, query, where, getDocs, updateDoc, doc, deleteField } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// 1. Configuração do Firebase
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

// 2. Referências dos Elementos
const inputCodigoBusca = document.getElementById('codigoBusca');
const btnBuscar = document.getElementById('btnBuscar');
const detalhesLivroDiv = document.getElementById('detalhesLivro');
const formDevolucaoDiv = document.getElementById('formDevolucao');
const alertaBusca = document.getElementById('alertaBusca');

const tituloLivroSpan = document.getElementById('tituloLivro');
const autorLivroSpan = document.getElementById('autorLivro');
const codigoLivroCode = document.getElementById('codigoLivro');
const statusLivroSpan = document.getElementById('statusLivro');
const dadosEmprestimoDiv = document.getElementById('dadosEmprestimo');
const nomePessoaSpan = document.getElementById('nomePessoa');
const emailPessoaSpan = document.getElementById('emailPessoa');

const btnDevolver = document.getElementById('btnDevolver');

let livroEncontradoId = null; 

// 3. Função de Busca
async function buscarLivro() {
    const codigo = inputCodigoBusca.value.trim();

    // Resetar estado
    detalhesLivroDiv.classList.add('d-none');
    formDevolucaoDiv.classList.add('d-none');
    dadosEmprestimoDiv.classList.add('d-none');
    livroEncontradoId = null;
    alertaBusca.className = 'alert alert-info text-center';
    alertaBusca.innerHTML = 'Digite o **código** do livro para registrar a devolução.';


    if (!codigo) {
        alert("Por favor, digite o código do livro.");
        inputCodigoBusca.focus();
        return;
    }

    try {
        const q = query(collection(db, "livros"), where("codigo", "==", codigo));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alertaBusca.className = 'alert alert-danger text-center';
            alertaBusca.innerHTML = '❌ Livro não encontrado com este código.';
            return;
        }

        const docSnap = querySnapshot.docs[0];
        const livro = docSnap.data();
        livroEncontradoId = docSnap.id;
        
        // Exibir detalhes do livro
        tituloLivroSpan.textContent = livro.titulo;
        autorLivroSpan.textContent = livro.autor;
        codigoLivroCode.textContent = livro.codigo;
        statusLivroSpan.textContent = livro.status || 'Disponível';
        
        // Lógica para cor do status e formulário de devolução
        if ((livro.status || 'Disponível') === 'Emprestado') {
            statusLivroSpan.className = 'badge bg-warning text-dark';
            alertaBusca.className = 'alert alert-success text-center';
            alertaBusca.innerHTML = `✅ Livro **${livro.titulo}** está Emprestado. Confirme a devolução.`;
            
            // Exibir dados do empréstimo
            nomePessoaSpan.textContent = livro.nomePessoa || 'Não informado';
            emailPessoaSpan.textContent = livro.emailPessoa || 'Não informado';
            dadosEmprestimoDiv.classList.remove('d-none');
            formDevolucaoDiv.classList.remove('d-none');
            
        } else {
            statusLivroSpan.className = 'badge bg-success';
            alertaBusca.className = 'alert alert-warning text-center';
            alertaBusca.innerHTML = `⚠️ Livro já está **Disponível**. Não é necessário registrar devolução.`;
        }
        
        detalhesLivroDiv.classList.remove('d-none');

    } catch (error) {
        console.error("Erro ao buscar livro:", error);
        alertaBusca.className = 'alert alert-danger text-center';
        alertaBusca.innerHTML = `Erro ao buscar livro: ${error.message}`;
    }
}

// 4. Função de Registro de Devolução
btnDevolver.addEventListener('click', async () => {
    if (!livroEncontradoId) {
        alert("Erro: Nenhum livro selecionado para devolução.");
        return;
    }

    if (!confirm("Tem certeza que deseja registrar a devolução deste livro?")) {
        return;
    }

    try {
        const docRef = doc(db, "livros", livroEncontradoId);

        // Atualiza o status e REMOVE os dados da pessoa
        await updateDoc(docRef, {
            status: 'Disponível',
            nomePessoa: deleteField(), // Remove o campo
            emailPessoa: deleteField(), // Remove o campo
            dataEmprestimo: deleteField() // Remove o campo
        });

        alert("✅ Devolução registrada com sucesso! O livro foi marcado como 'Disponível'.");
        
        // Limpa e volta para o estado inicial
        inputCodigoBusca.value = '';
        inputCodigoBusca.focus();
        buscarLivro(); // Chama para resetar a tela
        
    } catch (error) {
        console.error("Erro ao registrar devolução:", error);
        alert("Erro ao registrar devolução: " + error.message);
    }
});

// Ações
btnBuscar.addEventListener('click', buscarLivro);
inputCodigoBusca.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        buscarLivro();
    }
});