// 1. Importação (Adicionei query e where)
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
    const codigo = document.getElementById('codigo').value; // O código lido
    const autor = document.getElementById('autor').value;
    const editora = document.getElementById('editora').value;
    const categoria = document.getElementById('categoria').value;
    const status = document.getElementById('status').value;

    try {
        // === PASSO NOVO: VERIFICAR SE JÁ EXISTE ===

        // 1. Cria uma consulta: Vá na coleção 'livros' e procure onde o campo 'codigo' é igual ao 'codigo' digitado
        const consultaCodigo = query(collection(db, "livros"), where("codigo", "==", codigo));

        // 2. Executa a busca
        const resultadoBusca = await getDocs(consultaCodigo);

        // 3. Se o resultado NÃO estiver vazio (!empty), significa que achou um livro igual
        if (!resultadoBusca.empty) {
            alert("⚠️ ERRO: Já existe um livro cadastrado com este código de barras!");

            // Opcional: Limpar o campo código para a pessoa tentar outro
            document.getElementById('codigo').value = '';
            document.getElementById('codigo').focus();
            return; // PARA AQUI. Não deixa salvar.
        }

        // === SE PASSOU DAQUI, PODE SALVAR ===

        await addDoc(collection(db, "livros"), {
            titulo: titulo,
            codigo: codigo,
            autor: autor,
            editora: editora,
            categoria: categoria,
            status: status,
            dataCadastro: new Date()
        });

        alert("✅ Livro cadastrado com sucesso!");

        // Limpa tudo
        document.getElementById('titulo').value = '';
        document.getElementById('codigo').value = '';
        document.getElementById('autor').value = '';
        document.getElementById('editora').value = '';
        document.getElementById('categoria').value = '';
        document.getElementById('status').value = '';

        inputCodigo.focus();

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao processar: " + erro.message);
    }
});