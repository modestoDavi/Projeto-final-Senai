// 1. Importação (COM query importado)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Configuração
const firebaseConfig = {
    apiKey: "AIzaSyAqCzcbTf4ZWwQKXGY5ELD3qjxjokay6Ds",
    authDomain: "projeto-final-bb566.firebaseapp.com",
    projectId: "projeto-final-bb566",
    storageBucket: "projeto-final-bb566.firebasestorage.app",
    messagingSenderId: "964611662890",
    appId: "1:964611662890:web:b0988263a185c92da1cf53"
};

// 3. Inicializa
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- LEITOR DE CÓDIGO ---
const inputCodigo = document.getElementById('codigo');
const inputTitulo = document.getElementById('titulo');

inputCodigo.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
        evento.preventDefault();
        inputTitulo.focus();
    }
});

// --- BOTÃO SALVAR COM VERIFICAÇÃO ---
document.getElementById('btnSalvar').addEventListener('click', async () => {

    const titulo = document.getElementById('titulo').value;
    const codigo = document.getElementById('codigo').value;
    const autor = document.getElementById('autor').value;
    const editora = document.getElementById('editora').value;
    const categoria = document.getElementById('categoria').value;
    const status = document.getElementById('status').value;

    // Validação básica
    if (!titulo || !codigo || !categoria || !status) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    try {
        // === PASSO 1: VERIFICAR SE JÁ EXISTE ===
        // query() AGORA ESTÁ DISPONÍVEL
        const consultaCodigo = query(collection(db, "livros"), where("codigo", "==", codigo));

        // Executa a busca
        const resultadoBusca = await getDocs(consultaCodigo);

        // Se o resultado NÃO estiver vazio, achou um livro igual
        if (!resultadoBusca.empty) {
            alert("⚠️ ERRO: Já existe um livro cadastrado com este código!");
            
            // Limpar o campo código para a pessoa tentar outro
            document.getElementById('codigo').value = '';
            document.getElementById('codigo').focus();
            return;
        }

        // === PASSO 2: CADASTRAR NOVO LIVRO ===
        await addDoc(collection(db, "livros"), {
            titulo: titulo,
            codigo: codigo,
            autor: autor || "",
            editora: editora || "",
            categoria: categoria,
            status: status,
            dataCadastro: new Date().toISOString()
        });

        alert("✅ Livro cadastrado com sucesso!");

        // Limpa todos os campos
        document.getElementById('titulo').value = '';
        document.getElementById('codigo').value = '';
        document.getElementById('autor').value = '';
        document.getElementById('editora').value = '';
        document.getElementById('categoria').value = '';
        document.getElementById('status').value = '';

        // Foco no campo de código para próximo cadastro
        inputCodigo.focus();

    } catch (erro) {
        console.error("Erro completo:", erro);
        alert("Erro ao cadastrar livro: " + erro.message);
    }
});