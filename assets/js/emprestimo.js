import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


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
const formEmprestimoDiv = document.getElementById('formEmprestimo');
const alertaBusca = document.getElementById('alertaBusca');

const tituloLivroSpan = document.getElementById('tituloLivro');
const autorLivroSpan = document.getElementById('autorLivro');
const codigoLivroCode = document.getElementById('codigoLivro');
const statusLivroSpan = document.getElementById('statusLivro');

const inputNomePessoa = document.getElementById('nomePessoa');
const inputEmailPessoa = document.getElementById('emailPessoa');
const btnRegistrar = document.getElementById('btnRegistrar');

let livroEncontradoId = null; // Armazena o ID do documento do livro encontrado

// 3. Função de Busca
async function buscarLivro() {
    const codigo = inputCodigoBusca.value.trim();

    // Resetar estado
    detalhesLivroDiv.classList.add('d-none');
    formEmprestimoDiv.classList.add('d-none');
    livroEncontradoId = null;
    alertaBusca.className = 'alert alert-info text-center';
    alertaBusca.innerHTML = 'Digite o **código** do livro para iniciar o empréstimo.';


    if (!codigo) {
        alert("Por favor, digite o código do livro.");
        inputCodigoBusca.focus();
        return;
    }

    try {
        // Consulta no Firestore pelo código
        const q = query(collection(db, "livros"), where("codigo", "==", codigo));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alertaBusca.className = 'alert alert-danger text-center';
            alertaBusca.innerHTML = '❌ Livro não encontrado com este código.';
            return;
        }

        // Se encontrou, pega o primeiro (assumindo código único)
        const docSnap = querySnapshot.docs[0];
        const livro = docSnap.data();
        livroEncontradoId = docSnap.id;

        // Exibir detalhes do livro
        tituloLivroSpan.textContent = livro.titulo;
        autorLivroSpan.textContent = livro.autor;
        codigoLivroCode.textContent = livro.codigo;
        statusLivroSpan.textContent = livro.status || 'Disponível';

        // Lógica para cor do status
        if ((livro.status || 'Disponível') === 'Emprestado') {
            statusLivroSpan.className = 'badge bg-warning text-dark';
            alertaBusca.className = 'alert alert-warning text-center';
            alertaBusca.innerHTML = `⚠️ Livro já está **Emprestado**. Não pode ser emprestado novamente.`;
        } else {
            statusLivroSpan.className = 'badge bg-success';
            alertaBusca.className = 'alert alert-success text-center';
            alertaBusca.innerHTML = `✅ Livro **${livro.titulo}** está disponível! Preencha os dados do empréstimo.`;
            formEmprestimoDiv.classList.remove('d-none');
        }

        detalhesLivroDiv.classList.remove('d-none');

    } catch (error) {
        console.error("Erro ao buscar livro:", error);
        alertaBusca.className = 'alert alert-danger text-center';
        alertaBusca.innerHTML = `Erro ao buscar livro: ${error.message}`;
    }
}

// 4. Função de Registro de Empréstimo
btnRegistrar.addEventListener('click', async () => {
    if (!livroEncontradoId) {
        alert("Erro: Nenhum livro selecionado para empréstimo.");
        return;
    }

    const nomePessoa = inputNomePessoa.value.trim();
    const emailPessoa = inputEmailPessoa.value.trim();

    if (!nomePessoa || !emailPessoa) {
        alert("Por favor, preencha o nome e o e-mail da pessoa.");
        return;
    }

    // Verificação de formato de e-mail simples
    if (!/^\S+@\S+\.\S+$/.test(emailPessoa)) {
        alert("Por favor, insira um endereço de e-mail válido.");
        return;
    }

    try {
        const docRef = doc(db, "livros", livroEncontradoId);

        // Atualiza o status e adiciona os dados da pessoa
        await updateDoc(docRef, {
            status: 'Emprestado',
            nomePessoa: nomePessoa,
            emailPessoa: emailPessoa,
            dataEmprestimo: new Date()
        });

        alert("✅ Empréstimo registrado com sucesso! O livro foi marcado como 'Emprestado'.");

        // Limpa e volta para o estado inicial
        inputCodigoBusca.value = '';
        inputNomePessoa.value = '';
        inputEmailPessoa.value = '';
        inputCodigoBusca.focus();
        buscarLivro(); // Chama para resetar a tela

    } catch (error) {
        console.error("Erro ao registrar empréstimo:", error);
        alert("Erro ao registrar empréstimo: " + error.message);
    }
});

// Ação para o botão de busca
btnBuscar.addEventListener('click', buscarLivro);

// Permite buscar também com a tecla Enter
inputCodigoBusca.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        buscarLivro();
    }
});